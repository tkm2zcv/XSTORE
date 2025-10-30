'use client'

import { useEffect } from 'react'
import { onCLS, onLCP, onFCP, onTTFB, onINP } from 'web-vitals'

export function WebVitals() {
  useEffect(() => {
    // LCP - Largest Contentful Paint
    onLCP((metric) => {
      const value = metric.value
      const rating = value <= 2500 ? '✅ Good' : value <= 4000 ? '⚠️ Needs Improvement' : '❌ Poor'
      console.log(`%c[LCP] ${rating}`, 'font-weight: bold; font-size: 14px; color: ' + (value <= 2500 ? '#22c55e' : value <= 4000 ? '#f59e0b' : '#ef4444'))
      console.log(`  Value: ${value.toFixed(0)}ms (Target: ≤2500ms)`)
      console.log(`  Element:`, metric.entries[metric.entries.length - 1]?.element)
      console.log('---')
    })

    // INP - Interaction to Next Paint (replaces FID)
    onINP((metric) => {
      const value = metric.value
      const rating = value <= 200 ? '✅ Good' : value <= 500 ? '⚠️ Needs Improvement' : '❌ Poor'
      console.log(`%c[INP] ${rating}`, 'font-weight: bold; font-size: 14px; color: ' + (value <= 200 ? '#22c55e' : value <= 500 ? '#f59e0b' : '#ef4444'))
      console.log(`  Value: ${value.toFixed(0)}ms (Target: ≤200ms)`)
      console.log('---')
    })

    // CLS - Cumulative Layout Shift
    onCLS((metric) => {
      const value = metric.value
      const rating = value <= 0.1 ? '✅ Good' : value <= 0.25 ? '⚠️ Needs Improvement' : '❌ Poor'
      console.log(`%c[CLS] ${rating}`, 'font-weight: bold; font-size: 14px; color: ' + (value <= 0.1 ? '#22c55e' : value <= 0.25 ? '#f59e0b' : '#ef4444'))
      console.log(`  Value: ${value.toFixed(3)} (Target: ≤0.1)`)
      console.log('---')
    })

    // FCP - First Contentful Paint
    onFCP((metric) => {
      const value = metric.value
      const rating = value <= 1800 ? '✅ Good' : value <= 3000 ? '⚠️ Needs Improvement' : '❌ Poor'
      console.log(`%c[FCP] ${rating}`, 'font-weight: bold; font-size: 14px; color: ' + (value <= 1800 ? '#22c55e' : value <= 3000 ? '#f59e0b' : '#ef4444'))
      console.log(`  Value: ${value.toFixed(0)}ms (Target: ≤1800ms)`)
      console.log('---')
    })

    // TTFB - Time to First Byte
    onTTFB((metric) => {
      const value = metric.value
      const rating = value <= 800 ? '✅ Good' : value <= 1800 ? '⚠️ Needs Improvement' : '❌ Poor'
      console.log(`%c[TTFB] ${rating}`, 'font-weight: bold; font-size: 14px; color: ' + (value <= 800 ? '#22c55e' : value <= 1800 ? '#f59e0b' : '#ef4444'))
      console.log(`  Value: ${value.toFixed(0)}ms (Target: ≤800ms)`)
      console.log('---')
    })

    console.log('%c🔍 Web Vitals Monitoring Active', 'font-weight: bold; font-size: 16px; color: #06b6d4; background: #0891b2; padding: 4px 8px; border-radius: 4px;')
  }, [])

  return null
}
