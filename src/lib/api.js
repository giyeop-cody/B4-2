import { supabase, isSupabaseConfigured, isLocalMode } from './supabaseClient'
import { localDB } from './localDB'

const TABLE = 'items'

function requireDataSource() {
  if (isSupabaseConfigured) return 'supabase'
  if (isLocalMode) return 'local'
  throw new Error('Supabase 설정이 없습니다. 배포 환경변수를 확인하세요.')
}

export const db = {
  async selectAll() {
    if (requireDataSource() === 'supabase') {
      const { data, error } = await supabase.from(TABLE).select('*').order('created_at', { ascending: false })
      if (error) throw error
      return data
    }
    return localDB.selectAll()
  },

  async selectById(id) {
    if (requireDataSource() === 'supabase') {
      const { data, error } = await supabase.from(TABLE).select('*').eq('id', id).maybeSingle()
      if (error) throw error
      return data
    }
    return localDB.selectById(id)
  },

  async insert(data) {
    if (requireDataSource() === 'supabase') {
      const { data: row, error } = await supabase.from(TABLE).insert(data).select().single()
      if (error) throw error
      return row
    }
    return localDB.insert(data)
  },

  async update(id, data) {
    if (requireDataSource() === 'supabase') {
      const { data: row, error } = await supabase.from(TABLE).update(data).eq('id', id).select().maybeSingle()
      if (error) throw error
      if (!row) throw new Error('항목을 찾을 수 없습니다')
      return row
    }
    return localDB.update(id, data)
  },

  async remove(id) {
    if (requireDataSource() === 'supabase') {
      const { data: row, error } = await supabase.from(TABLE).delete().eq('id', id).select('id').maybeSingle()
      if (error) throw error
      if (!row) throw new Error('항목을 찾을 수 없습니다')
      return true
    }
    return localDB.remove(id)
  },
}
