const KEY = 'b4-2-items'
function load() {
  const raw = localStorage.getItem(KEY)
  if (raw) try { return JSON.parse(raw) } catch {}
  const seed = [
    { id: '1', title: 'React 학습 노트', content: 'useState와 useEffect의 핵심 개념을 정리했습니다.', category: '학습', created_at: new Date(Date.now()-86400000*3).toISOString() },
    { id: '2', title: 'Vite로 빠른 개발 환경 만들기', content: 'Vite는 번들링 없이 ESM을 사용해 매우 빠른 HMR을 제공합니다.', category: '도구', created_at: new Date(Date.now()-86400000*2).toISOString() },
    { id: '3', title: 'Supabase 입문', content: 'Supabase는 오픈소스 Firebase 대안으로 PostgreSQL 기반의 BaaS입니다.', category: '백엔드', created_at: new Date(Date.now()-86400000).toISOString() },
  ]
  localStorage.setItem(KEY, JSON.stringify(seed))
  return seed
}
function save(items) { localStorage.setItem(KEY, JSON.stringify(items)) }
function delay(ms=300) { return new Promise(r => setTimeout(r, ms)) }

export const localDB = {
  async selectAll() { await delay(); return load() },
  async selectById(id) { await delay(); return load().find(i => String(i.id) === String(id)) || null },
  async insert(data) {
    await delay()
    const items = load()
    const newItem = { id: crypto.randomUUID(), ...data, created_at: new Date().toISOString() }
    items.unshift(newItem); save(items); return newItem
  },
  async update(id, data) {
    await delay()
    const items = load()
    const idx = items.findIndex(i => String(i.id) === String(id))
    if (idx === -1) throw new Error('항목을 찾을 수 없습니다')
    items[idx] = { ...items[idx], ...data }; save(items); return items[idx]
  },
  async remove(id) {
    await delay()
    const items = load()
    const filtered = items.filter(i => String(i.id) !== String(id))
    if (filtered.length === items.length) throw new Error('항목을 찾을 수 없습니다')
    save(filtered); return true
  },
}
