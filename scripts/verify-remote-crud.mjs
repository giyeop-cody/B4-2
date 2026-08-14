const url = process.env.VITE_SUPABASE_URL
const key = process.env.VITE_SUPABASE_ANON_KEY
const email = process.env.VERIFY_AUTH_EMAIL
const password = process.env.VERIFY_AUTH_PASSWORD

if (!url || !key) {
  console.error('FAIL: VITE_SUPABASE_URL과 VITE_SUPABASE_ANON_KEY가 필요합니다.')
  process.exit(1)
}
if (!email || !password) {
  console.error('FAIL: 로그인 쓰기 검사를 위해 VERIFY_AUTH_EMAIL과 VERIFY_AUTH_PASSWORD가 필요합니다.')
  process.exit(1)
}

const loginResponse = await fetch(`${url}/auth/v1/token?grant_type=password`, {
  method: 'POST',
  headers: { apikey: key, 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
})
const loginData = await loginResponse.json()
if (!loginResponse.ok || !loginData.access_token) {
  throw new Error(`로그인 실패: ${loginData.message || `HTTP ${loginResponse.status}`}`)
}

const headers = {
  apikey: key,
  Authorization: `Bearer ${loginData.access_token}`,
  'Content-Type': 'application/json',
  Prefer: 'return=representation',
}

async function request(path, options = {}) {
  const response = await fetch(`${url}${path}`, {
    ...options,
    headers: { ...headers, ...options.headers },
  })
  const text = await response.text()
  const data = text ? JSON.parse(text) : null

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${data?.message || '원격 요청 실패'}`)
  }
  return { status: response.status, data }
}

const marker = `b4-2-verification-${Date.now()}`
let createdId = null

try {
  console.log('AUTHENTICATED SESSION: PASS')
  const created = await request('/rest/v1/items', {
    method: 'POST',
    body: JSON.stringify({
      title: marker,
      content: '로그인 원격 CRUD 자동 검사 데이터',
      category: '학습',
    }),
  })
  createdId = created.data?.[0]?.id
  if (!createdId) throw new Error('CREATE 결과에 id가 없습니다.')
  console.log(`CREATE: HTTP ${created.status} PASS`)

  const read = await request(`/rest/v1/items?id=eq.${encodeURIComponent(createdId)}&select=id,title,content,category`)
  if (read.data?.[0]?.title !== marker) throw new Error('READ 결과가 생성 데이터와 다릅니다.')
  console.log(`READ: HTTP ${read.status} PASS`)

  const updated = await request(`/rest/v1/items?id=eq.${encodeURIComponent(createdId)}`, {
    method: 'PATCH',
    body: JSON.stringify({ content: '로그인 원격 CRUD 자동 검사 수정 완료' }),
  })
  if (updated.data?.[0]?.content !== '로그인 원격 CRUD 자동 검사 수정 완료') {
    throw new Error('UPDATE 결과가 수정 데이터와 다릅니다.')
  }
  console.log(`UPDATE: HTTP ${updated.status} PASS`)

  const removed = await request(`/rest/v1/items?id=eq.${encodeURIComponent(createdId)}`, { method: 'DELETE' })
  if (removed.data?.length !== 1) throw new Error('DELETE 결과에서 삭제 행을 확인하지 못했습니다.')
  createdId = null
  console.log(`DELETE: HTTP ${removed.status} PASS`)
  console.log('AUTHENTICATED REMOTE CRUD: ALL PASS')
} finally {
  if (createdId) {
    await request(`/rest/v1/items?id=eq.${encodeURIComponent(createdId)}`, {
      method: 'DELETE',
      headers: { Prefer: 'return=minimal' },
    }).catch(() => {})
  }
  await request('/auth/v1/logout', { method: 'POST', headers: { Prefer: 'return=minimal' } }).catch(() => {})
}
