import { useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'

const NAV = [
  { path: '/home', label: 'Cartelera', icon: '🎬' },
  { path: '/dulceria', label: 'Dulcería', icon: '🍿' },
  { path: '/perfil', label: 'Perfil', icon: '👤' },
]

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <>
      {/* Top bar */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(10,10,15,0.92)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px', height: 60,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 22 }}>🎭</span>
          <span style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 20, fontWeight: 700,
            color: 'var(--gold)',
            letterSpacing: '0.02em'
          }}>CineApp</span>
        </div>
        <div style={{ fontSize: 12, color: 'var(--muted)' }}>
          Barranquilla
        </div>
      </header>

      {/* Bottom nav */}
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(18,18,26,0.97)', backdropFilter: 'blur(12px)',
        borderTop: '1px solid var(--border)',
        display: 'flex', justifyContent: 'space-around', alignItems: 'center',
        height: 64,
      }}>
        {NAV.map(item => {
          const active = location.pathname === item.path
          return (
            <button key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                background: 'none', display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: 4, padding: '8px 20px',
                opacity: active ? 1 : 0.45,
                transition: 'opacity 0.2s',
              }}>
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              <span style={{
                fontSize: 11, fontWeight: active ? 500 : 400,
                color: active ? 'var(--gold)' : 'var(--text)',
                letterSpacing: '0.05em'
              }}>{item.label}</span>
            </button>
          )
        })}
      </nav>
    </>
  )
}
