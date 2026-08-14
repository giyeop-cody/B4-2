import { dataSource } from '../lib/supabaseClient'

const BADGES = {
  supabase: { label: 'Supabase 원격', color: '#166534', background: '#dcfce7' },
  local: { label: 'LocalStorage 학습', color: '#92400e', background: '#fef3c7' },
  missing: { label: '데이터 설정 필요', color: '#991b1b', background: '#fee2e2' },
}

export default function DataSourceBadge({ source = dataSource }) {
  const badge = BADGES[source] || BADGES.missing

  return (
    <span
      title="현재 데이터를 저장하는 위치"
      style={{
        padding: '4px 8px',
        borderRadius: 999,
        color: badge.color,
        background: badge.background,
        fontSize: 12,
        fontWeight: 600,
        whiteSpace: 'nowrap',
      }}
    >
      {badge.label}
    </span>
  )
}
