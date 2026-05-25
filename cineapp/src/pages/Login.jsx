import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Login() {
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('correo', correo.trim())
      .eq('contraseña', contrasena)
      .single()

    setLoading(false)

    if (error || !data) {
      setError('Correo o contraseña incorrectos.')
      return
    }

    // Store user in sessionStorage
    sessionStorage.setItem('usuario', JSON.stringify(data))
    navigate('/home')
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'absolute', top: -120, right: -120,
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(232,184,75,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: -80, left: -80,
        width: 300, height: 300, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(232,75,75,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div style={{ fontSize: 52, marginBottom: 12 }}>🎭</div>
        <h1 style={{
          fontSize: 36, fontWeight: 700,
          color: 'var(--gold)',
          letterSpacing: '-0.01em',
          marginBottom: 6,
        }}>CineApp</h1>
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>Tu experiencia de cine, elevada</p>
      </div>

      {/* Card */}
      <div style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 20,
        padding: '36px 32px',
        width: '100%',
        maxWidth: 400,
      }}>
        <h2 style={{ fontSize: 22, marginBottom: 24, fontWeight: 600 }}>Iniciar sesión</h2>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: 'var(--muted)', marginBottom: 6, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Correo
            </label>
            <input
              type="email"
              value={correo}
              onChange={e => setCorreo(e.target.value)}
              placeholder="tu@correo.com"
              required
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, color: 'var(--muted)', marginBottom: 6, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Contraseña
            </label>
            <input
              type="password"
              value={contrasena}
              onChange={e => setContrasena(e.target.value)}
              placeholder="••••••••"
              required
              style={inputStyle}
            />
          </div>

          {error && (
            <div style={{
              background: 'rgba(232,75,75,0.1)',
              border: '1px solid rgba(232,75,75,0.3)',
              borderRadius: 8, padding: '10px 14px',
              color: '#e84b4b', fontSize: 13,
            }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={btnStyle}>
            {loading ? 'Verificando...' : 'Entrar →'}
          </button>
        </form>

        <p style={{ marginTop: 20, fontSize: 12, color: 'var(--muted)', textAlign: 'center' }}>
          Usuario de prueba: <span style={{ color: 'var(--gold)' }}>leo@gmail.com</span> / 1234
        </p>
      </div>
    </div>
  )
}

const inputStyle = {
  width: '100%', padding: '12px 14px',
  background: 'var(--bg2)', border: '1px solid var(--border)',
  borderRadius: 10, color: 'var(--text)', fontSize: 15,
  outline: 'none', transition: 'border-color 0.2s',
}

const btnStyle = {
  width: '100%', padding: '14px',
  background: 'var(--gold)', color: '#0a0a0f',
  borderRadius: 10, fontSize: 15, fontWeight: 600,
  letterSpacing: '0.02em', marginTop: 4,
  transition: 'opacity 0.2s',
}
