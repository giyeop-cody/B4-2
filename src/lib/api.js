import { supabase, isSupabaseConfigured } from './supabaseClient'
import { localDB } from './localDB'
const TABLE = 'items'

export const db = {
  async selectAll() {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from(TABLE).select('*').order('created_at', { ascending: false })
      if (error) throw error
      return data
    }
    return localDB.selectAll()
  },
  async selectById(id) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from(TABLE).select('*').eq('id', id).single()
      if (error) throw error
      return data
    }
    return localDB.selectById(id)
  },
  async insert(data) {
    if (isSupabaseConfigured) {
      const { data: row, error } = await supabase.from(TABLE).insert(data).select().single()
      if (error) throw error
      return row
    }
    return localDB.insert(data)
  },
  async update(id, data) {
    if (isSupabaseConfigured) {
      const { data: row, error } = await supabase.from(TABLE).update(data).eq('id', id).select().single()
      if (error) throw error
      return row
    }
    return localDB.update(id, data)
  },
  async remove(id) {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from(TABLE).delete().eq('id', id)
      if (error) throw error
      return true
    }
    return localDB.remove(id)
  },
}
