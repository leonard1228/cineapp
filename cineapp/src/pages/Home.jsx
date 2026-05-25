import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { supabase } from '../lib/supabase'

const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN
console.log('TOKEN:', import.meta.env.VITE_TMDB_TOKEN)

const CENTROS = ['Viva Barranquilla', 'Buenavista', 'Portal del Prado', 'Cosmocentro']
const FORMATOS = ['2D', '3D', 'IMAX', '3D 4DX', '2D 4DX']
const HORARIOS = ['2:00 PM', '4:30 PM', '7:00 PM', '9:30 PM', '11:45 PM']
const DIAS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

function enrich(movie, index) {
  return {
    ...movie,
    formato: FORMATOS[index % FORMATOS.length],
    horario: HORARIOS[index % HORARIOS.length],
    centro_comercial: CENTROS[index % CENTROS.length],
    imagen: movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : 'https://placehold.co/300x450/12121a/7a7a8c?text=🎬',
    duracion: `${90 + (index % 8) * 10} min`,
    genero: movie.genre_ids?.[0] ? GENRE_MAP[movie.genre_ids[0]] || 'Drama' : 'Drama',
  }
}

const GENRE_MAP = {
  28: 'Acción', 12: 'Aventura', 16: 'Animación', 35: 'Comedia',
  80: 'Crimen', 99: 'Documental', 18: 'Drama', 10751: 'Familiar',
  14: 'Fantasía', 36: 'Historia', 27: 'Terror', 10402: 'Música',
  9648: 'Misterio', 10749: 'Romance', 878: 'Ciencia Ficción',
  10770: 'TV Movie', 53: 'Suspenso', 10752: 'Guerra', 37: 'Western',
}

export default function Home() {
  const [peliculas, setPeliculas] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState('Todos')
  const [diaIdx, setDiaIdx] = useState(() => {
    const d = new Date().getDay()
    return d === 0 ? 6 : d - 1
  })
  const [usandoTMDB, setUsandoTMDB] = useState(false)
  const navigate = useNavigate()
  const usuario = JSON.parse(sessionStorage.getItem('usuario') || '{}')

  useEffect(() => {
    async function fetchPeliculas() {
      // Intentar TMDB primero
      if (TMDB_TOKEN && TMDB_TOKEN !== 'TU_TMDB_TOKEN_AQUI') {
        try {
          const res = await fetch(
            'https://api.themoviedb.org/3/movie/now_playing?language=es-ES&page=1&region=CO',
            { headers: { Authorization: `Bearer ${TMDB_TOKEN}`, 'Content-Type': 'application/json' } }
          )
          if (res.ok) {
            const data = await res.json()
            const enriched = (data.results || []).slice(0, 16).map(enrich)
            setPeliculas(enriched)
            setUsandoTMDB(true)
            setLoading(false)
            return
          }
        } catch (e) { /* fallback a Supabase */ }
      }

      // Fallback: Supabase
      const { data } = await supabase.from('peliculas').select('*')
      setPeliculas((data || []).map((p, i) => ({
        ...p,
        imagen: p.imagen,
        genero: p.genero,
      })))
      setLoading(false)
    }
    fetchPeliculas()
  }, [])

  const generos = ['Todos', ...new Set(peliculas.map(p => p.genero).filter(Boolean))]
  const filtradas = filtro === 'Todos' ? peliculas : peliculas.filter(p => p.genero === filtro)

  const hoy = new Date()
  const lunesBase = new Date(hoy)
  lunesBase.setDate(hoy.getDate() - (hoy.getDay() === 0 ? 6 : hoy.getDay() - 1))

  return (
    <div style={{ paddingTop: 60, paddingBottom: 80, minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />

      <div style={{ padding: '28px 20px 12px' }}>
        <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 4 }}>
          Bienvenido, <span style={{ color: 'var(--gold)' }}>{usuario.nombre || 'Cinéfilo'}</span>
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ fontSize: 28, fontWeight: 700 }}>Cartelera</h1>
          {usandoTMDB && (
            <span style={{ fontSize: 10, color: 'var(--muted)', background: 'var(--card)', padding: '3px 8px', borderRadius: 10, border: '1px solid var(--border)' }}>
              🌐 En cartelera
            </span>
          )}
        </div>
      </div>

      {/* Días */}
      <div style={{ overflowX: 'auto', padding: '0 20px 16px' }}>
        <div style={{ display: 'flex', gap: 8, width: 'max-content' }}>
          {DIAS.map((d, i) => {
            const fecha = new Date(lunesBase)
            fecha.setDate(lunesBase.getDate() + i)
            const isHoy = i === diaIdx
            return (
              <button key={d} onClick={() => setDiaIdx(i)} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                padding: '8px 14px', borderRadius: 10, minWidth: 52,
                background: isHoy ? 'var(--gold)' : 'var(--card)',
                border: '1px solid var(--border)', cursor: 'pointer',
                transition: 'all 0.2s',
              }}>
                <span style={{ fontSize: 11, color: isHoy ? '#0a0a0f' : 'var(--muted)', fontWeight: 500 }}>{d}</span>
                <span style={{ fontSize: 16, fontWeight: 700, color: isHoy ? '#0a0a0f' : 'var(--text)' }}>
                  {fecha.getDate()}
                </span>
              </button>
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
              transition: 'all 0.2s', cursor: 'pointer',
            }}>{g}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--muted)' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🎬</div>
          Cargando cartelera...
        </div>
      ) : (
        <div style={{ padding: '0 20px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
          {filtradas.map((pelicula, i) => (
            <div key={pelicula.id || i}
              onClick={() => navigate(`/pelicula/${pelicula.id}`, { state: { pelicula, diaIdx } })}
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
                  alt={pelicula.titulo || pelicula.title}
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
                <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 4, lineHeight: 1.3 }}>
                  {pelicula.titulo || pelicula.title}
                </h3>
                <p style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}>{pelicula.genero}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 10 }}>⏱️</span>
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
