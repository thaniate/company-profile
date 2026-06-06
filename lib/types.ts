export interface HeroSection {
  id: string
  headline: string
  subheadline: string
  cta_text: string
  cta_url: string
  image_url: string | null
  updated_at: string
}

export interface AboutSection {
  id: string
  title: string
  description: string
  image_url: string | null
  updated_at: string
}

export interface Service {
  id: string
  title: string
  description: string
  icon: string
  order_index: number
  created_at: string
}

export interface PortfolioItem {
  id: string
  title: string
  description: string
  image_url: string | null
  tags: string[]
  slug: string
  order_index: number
  created_at: string
}

export interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  content: string
  avatar_url: string | null
  order_index: number
  created_at: string
}

export interface ContactSubmission {
  id: string
  name: string
  email: string
  phone: string | null
  message: string
  is_read: boolean
  created_at: string
}
