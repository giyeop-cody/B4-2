import { HashRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ItemListPage from './pages/ItemListPage'
import ItemDetailPage from './pages/ItemDetailPage'
import ItemNewPage from './pages/ItemNewPage'
import ItemEditPage from './pages/ItemEditPage'
import NotFoundPage from './pages/NotFoundPage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import ProtectedRoute from './components/ProtectedRoute'

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
          <Route path="login" element={<LoginPage />} />
          <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
