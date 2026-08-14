export function buildAuthRedirectURL(configuredURL, browserOrigin) {
  const candidate = configuredURL?.trim() || browserOrigin?.trim()
  if (!candidate) throw new Error('인증 이메일이 돌아올 앱 주소가 없습니다.')

  const url = new URL(candidate)
  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error('인증 이메일 리다이렉트는 http 또는 https 주소여야 합니다.')
  }

  // Supabase가 인증 토큰을 URL hash에 붙일 수 있으므로 HashRouter 경로는 넣지 않는다.
  return url.origin
}
