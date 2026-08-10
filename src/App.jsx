import { HashRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ItemListPage from './pages/ItemListPage'
import ItemDetailPage from './pages/ItemDetailPage'
import ItemNewPage from './pages/ItemNewPage'
import ItemEditPage from './pages/ItemEditPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<ItemListPage />} />
          <Route path="items" element={<ItemListPage />} />
          <Route path="items/new" element={<ItemNewPage />} />
          <Route path="items/:id" element={<ItemDetailPage />} />
          <Route path="items/:id/edit" element={<ItemEditPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
