import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'

const DIAS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

export default function Home() {
  const [peliculas, setPeliculas] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState('Todos')
  const navigate = useNavigate()
  const usuario = JSON.parse(sessionStorage.getItem('usuario') || '{}')

  useEffect(() => {
    async function fetchPeliculas() {
      const { data } = await supabase.from('peliculas').select('*')
      setPeliculas(data || [])
      setLoading(false)
    }
    fetchPeliculas()
  }, [])

  const generos = ['Todos', ...new Set(peliculas.map(p => p.genero))]
  const filtradas = filtro === 'Todos' ? peliculas : peliculas.filter(p => p.genero === filtro)

  return (
    <div style={{ paddingTop: 60, paddingBottom: 80, minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />

      <div style={{ padding: '28px 20px 12px' }}>
        <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 4 }}>
          Bienvenido, <span style={{ color: 'var(--gold)' }}>{usuario.nombre || 'Invitado'}</span>
        </p>
        <h1 style={{ fontSize: 28, fontWeight: 700 }}>Cartelera</h1>
      </div>

      {/* Días selector */}
      <div style={{ overflowX: 'auto', padding: '0 20px 16px' }}>
        <div style={{ display: 'flex', gap: 8, width: 'max-content' }}>
          {DIAS.map((d, i) => {
            const today = new Date().getDay()
            const isToday = i === (today === 0 ? 6 : today - 1)
            return (
              <div key={d} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                padding: '8px 14px', borderRadius: 10,
                background: isToday ? 'var(--gold)' : 'var(--card)',
                border: '1px solid var(--border)',
                cursor: 'pointer', minWidth: 52,
              }}>
                <span style={{ fontSize: 11, color: isToday ? '#0a0a0f' : 'var(--muted)', fontWeight: 500 }}>{d}</span>
                <span style={{ fontSize: 16, fontWeight: 700, color: isToday ? '#0a0a0f' : 'var(--text)' }}>
                  {new Date(Date.now() + i * 86400000 - (new Date().getDay() === 0 ? 6 : new Date().getDay() - 1) * 86400000).getDate()}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Filtros género */}
      <div style={{ overflowX: 'auto', padding: '0 20px 20px' }}>
        <div style={{ display: 'flex', gap: 8, width: 'max-content' }}>
          {generos.map(g => (
            <button key={g} onClick={() => setFiltro(g)} style={{
              padding: '6px 16px', borderRadius: 20, fontSize: 13,
              background: filtro === g ? 'var(--gold)' : 'var(--card)',
              color: filtro === g ? '#0a0a0f' : 'var(--muted)',
              border: '1px solid var(--border)', fontWeight: filtro === g ? 600 : 400,
              transition: 'all 0.2s',
            }}>{g}</button>
          ))}
        </div>
      </div>

      {/* Grid de películas */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--muted)' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🎬</div>
          Cargando cartelera...
        </div>
      ) : (
        <div style={{ padding: '0 20px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
          {filtradas.map(pelicula => (
            <div key={pelicula.id}
              onClick={() => navigate(`/pelicula/${pelicula.id}`)}
              style={{
                background: 'var(--card)', borderRadius: 14,
                border: '1px solid var(--border)', overflow: 'hidden',
                cursor: 'pointer', transition: 'transform 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ position: 'relative' }}>
                <img
                  src={pelicula.imagen}
                  alt={pelicula.titulo}
                  style={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover', display: 'block' }}
                  onError={e => { e.target.src = 'https://placehold.co/300x450/12121a/7a7a8c?text=🎬' }}
                />
                <div style={{
                  position: 'absolute', top: 8, right: 8,
                  background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(4px)',
                  borderRadius: 6, padding: '3px 8px',
                  fontSize: 11, fontWeight: 600, color: 'var(--gold)',
                  border: '1px solid rgba(232,184,75,0.3)',
                }}>
                  {pelicula.formato}
                </div>
              </div>
              <div style={{ padding: '12px 12px 14px' }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 4, lineHeight: 1.3 }}>{pelicula.titulo}</h3>
                <p style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}>{pelicula.genero}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 10, color: 'var(--muted)' }}>🕐</span>
                  <span style={{ fontSize: 11, color: 'var(--muted)' }}>{pelicula.duracion}</span>
                </div>
                <div style={{
                  marginTop: 8, padding: '6px 10px',
                  background: 'rgba(232,184,75,0.08)', borderRadius: 6,
                  fontSize: 12, color: 'var(--gold)', fontWeight: 500, textAlign: 'center',
                }}>
                  {pelicula.horario}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
