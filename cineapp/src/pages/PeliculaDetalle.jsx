import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const FORMATO_INFO = {
  '2D': { icon: '📽️', desc: 'Experiencia clásica de cine. Excelente relación calidad-precio.' },
  '3D': { icon: '🥽', desc: 'Inmersión visual con profundidad. Se requieren gafas 3D.' },
  'IMAX': { icon: '🎯', desc: 'Pantalla gigante y sonido envolvente premium.' },
  '2D 4DX': { icon: '💺', desc: 'Efectos físicos sincronizados: viento, agua, movimiento.' },
  '3D 4DX': { icon: '🌪️', desc: 'La experiencia más inmersiva: 3D + efectos 4D completos.' },
  'default': { icon: '🎬', desc: 'Formato de proyección disponible.' },
}

const DIAS_SEMANA = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

export default function PeliculaDetalle() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [pelicula, setPelicula] = useState(null)
  const [loading, setLoading] = useState(true)
  const [diaSeleccionado, setDiaSeleccionado] = useState(0)
  const [reservado, setReservado] = useState(false)

  useEffect(() => {
    async function fetchPelicula() {
      const { data } = await supabase.from('peliculas').select('*').eq('id', id).single()
      setPelicula(data)
      setLoading(false)
    }
    fetchPelicula()
  }, [id])

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', color: 'var(--muted)' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🎬</div>
        Cargando...
      </div>
    </div>
  )

  if (!pelicula) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <p>Película no encontrada</p>
        <button onClick={() => navigate('/home')} style={{ marginTop: 16, padding: '10px 20px', background: 'var(--gold)', color: '#0a0a0f', borderRadius: 8, fontWeight: 600 }}>Volver</button>
      </div>
    </div>
  )

  const formatoInfo = FORMATO_INFO[pelicula.formato] || FORMATO_INFO['default']

  async function handleReserva() {
    const usuario = JSON.parse(sessionStorage.getItem('usuario') || '{}')
    if (!usuario.id) return

    await supabase.from('reservas').insert({
      id_usuario: usuario.id,
      id_pelicula: pelicula.id,
    })
    setReservado(true)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: 40 }}>
      {/* Back button */}
      <button onClick={() => navigate('/home')} style={{
        position: 'fixed', top: 16, left: 16, zIndex: 200,
        background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(8px)',
        border: '1px solid var(--border)', borderRadius: '50%',
        width: 40, height: 40, fontSize: 18, color: 'var(--text)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>←</button>

      {/* Hero image */}
      <div style={{ position: 'relative', height: '55vh', overflow: 'hidden' }}>
        <img
          src={pelicula.imagen}
          alt={pelicula.titulo}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
          onError={e => { e.target.src = 'https://placehold.co/600x900/12121a/7a7a8c?text=🎬' }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(10,10,15,0.1) 0%, rgba(10,10,15,0.98) 100%)',
        }} />

        {/* Formato badge on hero */}
        <div style={{
          position: 'absolute', bottom: 20, right: 20,
          background: 'var(--gold)', color: '#0a0a0f',
          borderRadius: 8, padding: '6px 14px',
          fontSize: 13, fontWeight: 700,
        }}>
          {formatoInfo.icon} {pelicula.formato}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '24px 20px', marginTop: -20, position: 'relative' }}>
        {/* Género tag */}
        <div style={{ marginBottom: 10 }}>
          <span style={{
            fontSize: 11, fontWeight: 600, letterSpacing: '0.08em',
            textTransform: 'uppercase', color: 'var(--gold)',
            background: 'rgba(232,184,75,0.1)', padding: '4px 10px',
            borderRadius: 20, border: '1px solid rgba(232,184,75,0.2)',
          }}>{pelicula.genero}</span>
        </div>

        <h1 style={{ fontSize: 30, fontWeight: 700, marginBottom: 12, lineHeight: 1.2 }}>{pelicula.titulo}</h1>

        {/* Quick info chips */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
          {[
            { icon: '⏱️', label: pelicula.duracion },
            { icon: '📍', label: pelicula.centro_comercial },
            { icon: '🕐', label: pelicula.horario },
          ].map(item => (
            <div key={item.label} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'var(--card)', borderRadius: 20,
              padding: '6px 12px', border: '1px solid var(--border)',
              fontSize: 13,
            }}>
              <span>{item.icon}</span>
              <span style={{ color: 'var(--muted)' }}>{item.label}</span>
            </div>
          ))}
        </div>

        {/* Sinopsis */}
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, marginBottom: 10, fontWeight: 600 }}>Sinopsis</h2>
          <p style={{ color: 'var(--muted)', lineHeight: 1.65, fontSize: 14 }}>{pelicula.sinopsis}</p>
        </div>

        {/* Disponibilidad */}
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, marginBottom: 12, fontWeight: 600 }}>Días disponibles</h2>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
            {DIAS_SEMANA.map((dia, i) => (
              <button key={dia} onClick={() => setDiaSeleccionado(i)} style={{
                flexShrink: 0, padding: '8px 16px', borderRadius: 10,
                background: diaSeleccionado === i ? 'var(--gold)' : 'var(--card)',
                color: diaSeleccionado === i ? '#0a0a0f' : 'var(--muted)',
                border: '1px solid var(--border)',
                fontSize: 13, fontWeight: diaSeleccionado === i ? 600 : 400,
                transition: 'all 0.2s',
              }}>
                {dia}
              </button>
            ))}
          </div>
          <div style={{
            marginTop: 12, padding: '14px 16px',
            background: 'var(--card)', borderRadius: 12, border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 2 }}>{DIAS_SEMANA[diaSeleccionado]}</p>
              <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--gold)' }}>{pelicula.horario}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 2 }}>Sala</p>
              <p style={{ fontSize: 14, fontWeight: 600 }}>{pelicula.formato}</p>
            </div>
          </div>
        </div>

        {/* Sala recomendada */}
        <div style={{
          background: 'var(--bg3)', borderRadius: 14, padding: '18px 16px',
          border: '1px solid var(--border)', marginBottom: 28,
        }}>
          <h2 style={{ fontSize: 14, marginBottom: 10, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Sala recomendada
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 36 }}>{formatoInfo.icon}</span>
            <div>
              <p style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>{pelicula.formato}</p>
              <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.4 }}>{formatoInfo.desc}</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handleReserva}
          disabled={reservado}
          style={{
            width: '100%', padding: '16px',
            background: reservado ? 'var(--bg3)' : 'var(--gold)',
            color: reservado ? 'var(--gold)' : '#0a0a0f',
            borderRadius: 12, fontSize: 16, fontWeight: 700,
            border: reservado ? '2px solid var(--gold)' : 'none',
            transition: 'all 0.3s',
          }}
        >
          {reservado ? '✓ Reservado' : 'Reservar entrada'}
        </button>
      </div>
    </div>
  )
}
