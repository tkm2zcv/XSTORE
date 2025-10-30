/**
 * Logger Utilities
 *
 * Provides structured logging for the application.
 * In production, logs are sent to stdout/stderr and can be collected by Vercel.
 *
 * For advanced logging, consider:
 * - pino (fast JSON logger)
 * - winston (flexible logger)
 * - External services: Datadog, LogRocket, Sentry
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export interface LogContext {
  [key: string]: unknown
}

export interface LogEntry {
  timestamp: string
  level: string
  message: string
  context?: LogContext
  error?: {
    name: string
    message: string
    stack?: string
  }
}

class Logger {
  private minLevel: LogLevel

  constructor() {
    // Set minimum log level based on environment
    // Use INFO level even in development for better performance
    this.minLevel = LogLevel.INFO
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.minLevel
  }

  private formatLog(level: string, message: string, context?: LogContext, error?: Error): LogEntry {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
    }

    if (context && Object.keys(context).length > 0) {
      entry.context = context
    }

    if (error) {
      entry.error = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      }
    }

    return entry
  }

  private output(level: LogLevel, entry: LogEntry): void {
    const formatted = JSON.stringify(entry)

    if (level >= LogLevel.ERROR) {
      console.error(formatted)
    } else if (level >= LogLevel.WARN) {
      console.warn(formatted)
    } else {
      console.log(formatted)
    }
  }

  /**
   * Log debug message (only in development)
   */
  debug(message: string, context?: LogContext): void {
    if (!this.shouldLog(LogLevel.DEBUG)) return
    const entry = this.formatLog('DEBUG', message, context)
    this.output(LogLevel.DEBUG, entry)
  }

  /**
   * Log informational message
   */
  info(message: string, context?: LogContext): void {
    if (!this.shouldLog(LogLevel.INFO)) return
    const entry = this.formatLog('INFO', message, context)
    this.output(LogLevel.INFO, entry)
  }

  /**
   * Log warning message
   */
  warn(message: string, context?: LogContext): void {
    if (!this.shouldLog(LogLevel.WARN)) return
    const entry = this.formatLog('WARN', message, context)
    this.output(LogLevel.WARN, entry)
  }

  /**
   * Log error message
   */
  error(message: string, error?: Error, context?: LogContext): void {
    if (!this.shouldLog(LogLevel.ERROR)) return
    const entry = this.formatLog('ERROR', message, context, error)
    this.output(LogLevel.ERROR, entry)
  }

  /**
   * Log authentication event
   */
  auth(action: string, context: LogContext): void {
    this.info(`Auth: ${action}`, { ...context, category: 'authentication' })
  }

  /**
   * Log API request
   */
  api(method: string, path: string, context?: LogContext): void {
    this.info(`API: ${method} ${path}`, { ...context, category: 'api' })
  }

  /**
   * Log database operation
   */
  db(operation: string, table: string, context?: LogContext): void {
    this.debug(`DB: ${operation} ${table}`, { ...context, category: 'database' })
  }
}

// Export singleton instance
export const logger = new Logger()

/**
 * Usage Examples:
 *
 * Basic logging:
 * ```typescript
 * logger.info('User created account')
 * logger.error('Failed to connect to database', error)
 * ```
 *
 * With context:
 * ```typescript
 * logger.info('User logged in', { userId: '123', email: 'user@example.com' })
 * logger.warn('Rate limit approaching', { ip: '192.168.1.1', requests: 8 })
 * ```
 *
 * Specialized logging:
 * ```typescript
 * logger.auth('login_success', { userId: session.user.id })
 * logger.api('POST', '/api/accounts', { accountId: data.id })
 * logger.db('INSERT', 'accounts', { id: data.id })
 * ```
 *
 * Error logging:
 * ```typescript
 * try {
 *   await supabase.from('accounts').insert(data)
 * } catch (error) {
 *   logger.error('Database insert failed', error as Error, { table: 'accounts' })
 * }
 * ```
 */

/**
 * Performance logging utility
 */
export class PerformanceLogger {
  private startTime: number
  private label: string

  constructor(label: string) {
    this.label = label
    this.startTime = Date.now()
  }

  /**
   * End the performance measurement and log the duration
   */
  end(context?: LogContext): void {
    const duration = Date.now() - this.startTime
    logger.info(`Performance: ${this.label}`, {
      ...context,
      duration: `${duration}ms`,
      category: 'performance',
    })
  }
}

/**
 * Performance logging example:
 * ```typescript
 * const perf = new PerformanceLogger('Fetch accounts')
 * const accounts = await getAccounts()
 * perf.end({ count: accounts.length })
 * ```
 */

/**
 * Request logging middleware helper
 */
export function logRequest(
  request: Request,
  context?: LogContext
): void {
  const url = new URL(request.url)
  logger.api(
    request.method,
    url.pathname,
    {
      ...context,
      query: Object.fromEntries(url.searchParams.entries()),
    }
  )
}

/**
 * Request logging example:
 * ```typescript
 * export async function GET(request: NextRequest) {
 *   logRequest(request, { endpoint: 'accounts_list' })
 *   // ... handle request
 * }
 * ```
 */
