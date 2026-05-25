import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'

export default function Perfil() {
  const navigate = useNavigate()
  const usuario = JSON.parse(sessionStorage.getItem('usuario') || '{}')
  const [reservas, setReservas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchReservas() {
      if (!usuario.id) { setLoading(false); return }
      const { data } = await supabase
        .from('reservas')
        .select('*, peliculas(*)')
        .eq('id_usuario', usuario.id)
      setReservas(data || [])
      setLoading(false)
    }
    fetchReservas()
  }, [])

  function cerrarSesion() {
    sessionStorage.removeItem('usuario')
    navigate('/')
  }

  const iniciales = usuario.nombre
    ? usuario.nombre.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  return (
    <div style={{ paddingTop: 60, paddingBottom: 80, minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />

      {/* Avatar header */}
      <div style={{
        padding: '32px 20px 28px',
        display: 'flex', alignItems: 'center', gap: 20,
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--gold), #c97b30)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 26, fontWeight: 700, color: '#0a0a0f',
          flexShrink: 0,
        }}>{iniciales}</div>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>{usuario.nombre || 'Usuario'}</h1>
          <p style={{ color: 'var(--muted)', fontSize: 13 }}>{usuario.correo || ''}</p>
          <div style={{
            marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(232,184,75,0.1)', border: '1px solid rgba(232,184,75,0.2)',
            borderRadius: 20, padding: '3px 12px',
          }}>
            <span style={{ fontSize: 10 }}>⭐</span>
            <span style={{ fontSize: 12, color: 'var(--gold)', fontWeight: 500 }}>Cinéfilo</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '20px 20px 0' }}>
        {[
          { label: 'Reservas', value: reservas.length, icon: '🎟️' },
          { label: 'Películas vistas', value: reservas.length, icon: '🎬' },
        ].map(stat => (
          <div key={stat.label} style={{
            background: 'var(--card)', borderRadius: 12, padding: '16px',
            border: '1px solid var(--border)', textAlign: 'center',
          }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>{stat.icon}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--gold)' }}>{stat.value}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Mis reservas */}
      <div style={{ padding: '24px 20px 0' }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 14 }}>Mis reservas</h2>

        {loading ? (
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>Cargando...</p>
        ) : reservas.length === 0 ? (
          <div style={{
            background: 'var(--card)', borderRadius: 12, padding: '28px',
            border: '1px solid var(--border)', textAlign: 'center',
          }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>🎫</div>
            <p style={{ color: 'var(--muted)', fontSize: 14 }}>Aún no tienes reservas.</p>
            <button onClick={() => navigate('/home')} style={{
              marginTop: 14, padding: '8px 20px',
              background: 'var(--gold)', color: '#0a0a0f',
              borderRadius: 8, fontSize: 13, fontWeight: 600,
            }}>Ver cartelera</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {reservas.map(r => (
              <div key={r.id}
                onClick={() => navigate(`/pelicula/${r.id_pelicula}`)}
                style={{
                  background: 'var(--card)', borderRadius: 12,
                  border: '1px solid var(--border)', overflow: 'hidden',
                  display: 'flex', cursor: 'pointer',
                }}
              >
                <img
                  src={r.peliculas?.imagen}
                  alt={r.peliculas?.titulo}
                  style={{ width: 70, height: 90, objectFit: 'cover', flexShrink: 0 }}
                  onError={e => { e.target.src = 'https://placehold.co/70x90/12121a/7a7a8c?text=🎬' }}
                />
                <div style={{ padding: '12px 14px', flex: 1 }}>
                  <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{r.peliculas?.titulo}</p>
                  <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>{r.peliculas?.genero}</p>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 11, color: 'var(--gold)', background: 'rgba(232,184,75,0.1)', padding: '2px 8px', borderRadius: 10 }}>
                      {r.peliculas?.horario}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--muted)', background: 'var(--bg2)', padding: '2px 8px', borderRadius: 10 }}>
                      {r.peliculas?.formato}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cerrar sesión */}
      <div style={{ padding: '28px 20px 0' }}>
        <button onClick={cerrarSesion} style={{
          width: '100%', padding: '14px',
          background: 'transparent', color: '#e84b4b',
          border: '1px solid rgba(232,75,75,0.3)', borderRadius: 10,
          fontSize: 14, fontWeight: 600,
        }}>
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}
