import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import PeliculaDetalle from './pages/PeliculaDetalle'
import Dulceria from './pages/Dulceria'
import Perfil from './pages/Perfil'

function ProtectedRoute({ children }) {
  const usuario = sessionStorage.getItem('usuario')
  if (!usuario) return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/pelicula/:id" element={<ProtectedRoute><PeliculaDetalle /></ProtectedRoute>} />
        <Route path="/dulceria" element={<ProtectedRoute><Dulceria /></ProtectedRoute>} />
        <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
