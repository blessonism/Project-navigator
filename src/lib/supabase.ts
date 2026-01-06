import { createClient } from '@supabase/supabase-js'

// Supabase 配置
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// 检查是否为有效的 Supabase 配置（排除占位符值）
const isValidConfig = (url?: string, key?: string) => {
  if (!url || !key) return false
  if (url.includes('your_supabase') || key.includes('your_supabase')) return false
  if (url === '' || key === '') return false
  return true
}

const hasValidConfig = isValidConfig(supabaseUrl, supabaseAnonKey)

if (!hasValidConfig) {
  console.warn('Supabase 配置缺失或无效，将使用 localStorage 作为后备存储')
}

// 创建 Supabase 客户端（仅在配置有效时）
export const supabase = hasValidConfig
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : createClient('https://placeholder.supabase.co', 'placeholder-key')

// 检查 Supabase 连接状态
export const isSupabaseConfigured = () => {
  return hasValidConfig
}

// 项目数据类型定义（与 App.tsx 中的类型保持一致）
export interface SupabaseProject {
  id: string
  title: string
  description: string
  live_url: string
  github_url?: string
  tags: string[]
  category: string
  image?: string
  status: 'live' | 'development' | 'archived'
  detailed_description?: string
  screenshots?: string[]
  tech_stack?: any[]
  features?: string[]
  challenges?: any[]
  timeline?: any[]
  start_date?: string
  duration?: string
  created_at?: string
  updated_at?: string
}