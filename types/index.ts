// ============================================
// Database Types (matches Supabase schema)
// ============================================

export interface Account {
  id: string
  username: string
  category: string | null
  followers_count: number
  tweets_count: number
  account_created_at: string | null
  description: string | null
  image_url: string | null
  price: number
  status: 'available' | 'sold' | 'pending'
  created_at: string
  updated_at: string
}

export interface PurchaseRequest {
  id: string
  twitter_username: string
  desired_price: number
  contact_email: string | null
  contact_twitter: string | null
  contact_instagram: string | null
  message: string | null
  has_image_tweet: boolean
  status: 'pending' | 'reviewing' | 'approved' | 'rejected'
  created_at: string
}

export interface Admin {
  id: string
  email: string
  password_hash: string
  name: string | null
  created_at: string
  last_login_at: string | null
}
