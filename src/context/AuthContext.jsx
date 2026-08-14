import { createContext, useEffect, useMemo, useState } from 'react'
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [sessionError, setSessionError] = useState(null)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return undefined
    }

    let active = true
    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return
      if (error) setSessionError(error.message)
      setUser(data.session?.user || null)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) setUser(session?.user || null)
    })

    return () => {
      active = false
      listener.subscription.unsubscribe()
    }
  }, [])

  const signIn = async ({ email, password }) => {
    if (!supabase) return { error: new Error('Supabase 인증 설정이 없습니다.') }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    return { data, error }
  }

  const signUp = async ({ email, password, displayName }) => {
    if (!supabase) return { error: new Error('Supabase 인증 설정이 없습니다.') }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName } },
    })
    return { data, error }
  }

  const signOut = async () => {
    if (!supabase) return { error: new Error('Supabase 인증 설정이 없습니다.') }
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const value = useMemo(() => ({
    user,
    loading,
    sessionError,
    authAvailable: isSupabaseConfigured,
    signIn,
    signUp,
    signOut,
  }), [loading, sessionError, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
