const CATEGORIES = ['전체', '일반', '학습', '도구', '백엔드']

export default function CategoryFilter({ value, onChange, counts = {} }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
      <label htmlFor="category-filter" style={{ fontSize: 14, fontWeight: 600 }}>카테고리</label>
      <select
        id="category-filter"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        style={{ padding: '7px 10px', border: '1px solid #d1d5db', borderRadius: 6, background: '#fff' }}
      >
        {CATEGORIES.map((category) => (
          <option key={category} value={category}>
            {category} ({counts[category] || 0})
          </option>
        ))}
      </select>
    </div>
  )
}
