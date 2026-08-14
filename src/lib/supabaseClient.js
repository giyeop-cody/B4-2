import { createClient } from '@supabase/supabase-js'
import { resolveDataSource } from './dataSource'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

export const dataSource = resolveDataSource({
  url,
  key,
  allowLocalDB: import.meta.env.VITE_ALLOW_LOCAL_DB,
})

export const isSupabaseConfigured = dataSource === 'supabase'
export const isLocalMode = dataSource === 'local'
export const supabase = isSupabaseConfigured ? createClient(url, key) : null
