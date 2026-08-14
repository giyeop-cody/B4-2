export function resolveDataSource({ url, key, allowLocalDB }) {
  if (url && key) return 'supabase'
  if (allowLocalDB === 'true') return 'local'
  return 'missing'
}
