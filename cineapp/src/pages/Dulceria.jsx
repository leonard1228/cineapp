import Navbar from '../components/Navbar'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const MENU = [
  {
    categoria: 'Combos Estrella ⭐',
    items: [
      { id: 1, nombre: 'Combo Dúo', desc: '2 crispetas medianas + 2 bebidas', precio: 35000, emoji: '🍿🥤' },
      { id: 2, nombre: 'Combo Familiar', desc: '1 crispeta grande + 4 bebidas + nachos', precio: 68000, emoji: '👨‍👩‍👧‍👦' },
      { id: 3, nombre: 'Combo Solo', desc: '1 crispeta mediana + 1 bebida', precio: 22000, emoji: '🎬' },
    ]
  },
  {
    categoria: 'Crispetas 🍿',
    items: [
      { id: 4, nombre: 'Crispetas Pequeñas', desc: 'Saladas o dulces', precio: 9000, emoji: '🍿' },
      { id: 5, nombre: 'Crispetas Medianas', desc: 'Saladas o dulces', precio: 13000, emoji: '🍿' },
      { id: 6, nombre: 'Crispetas Grandes', desc: 'Saladas o dulces', precio: 18000, emoji: '🍿' },
      { id: 7, nombre: 'Crispetas Jumbo', desc: 'La más grande + sabor extra', precio: 24000, emoji: '🍿' },
    ]
  },
  {
    categoria: 'Bebidas 🥤',
    items: [
      { id: 8, nombre: 'Gaseosa Mediana', desc: 'Coca-Cola, Sprite o Fanta', precio: 7000, emoji: '🥤' },
      { id: 9, nombre: 'Gaseosa Grande', desc: 'Coca-Cola, Sprite o Fanta', precio: 9500, emoji: '🥤' },
      { id: 10, nombre: 'Agua', desc: '500ml', precio: 4500, emoji: '💧' },
      { id: 11, nombre: 'Malteada', desc: 'Chocolate, vainilla o fresa', precio: 14000, emoji: '🥛' },
    ]
  },
  {
    categoria: 'Snacks 🧀',
    items: [
      { id: 12, nombre: 'Nachos con Queso', desc: 'Porción grande con salsa cheddar', precio: 12000, emoji: '🧀' },
      { id: 13, nombre: 'Hot Dog', desc: 'Clásico con mostaza y kétchup', precio: 9000, emoji: '🌭' },
      { id: 14, nombre: 'Chocolatinas', desc: 'Variety pack de dulces', precio: 6000, emoji: '🍫' },
      { id: 15, nombre: 'Gomas', desc: 'Bolsa familiar', precio: 5500, emoji: '🐻' },
    ]
  },
]

const TODOS = MENU.flatMap(c => c.items)

export default function Dulceria() {
  const [carrito, setCarrito] = useState({})
  const [verCarrito, setVerCarrito] = useState(false)
  const [paso, setPaso] = useState(1) // 1=carrito, 2=datos, 3=confirmacion
  const [metodo, setMetodo] = useState('')
  const [nombre, setNombre] = useState('')
  const [pagado, setPagado] = useState(false)
  const navigate = useNavigate()

  function agregar(item) {
    setCarrito(prev => ({ ...prev, [item.id]: (prev[item.id] || 0) + 1 }))
  }
  function quitar(item) {
    setCarrito(prev => {
      const n = { ...prev }
      if (n[item.id] > 1) n[item.id]--
      else delete n[item.id]
      return n
    })
  }

  const itemsCarrito = TODOS.filter(i => carrito[i.id])
  const totalItems = Object.values(carrito).reduce((a, b) => a + b, 0)
  const totalPrecio = itemsCarrito.reduce((acc, i) => acc + i.precio * carrito[i.id], 0)

  function handlePagar() {
    if (!nombre.trim() || !metodo) return
    setPagado(true)
    setPaso(3)
  }

  function resetear() {
    setCarrito({})
    setVerCarrito(false)
    setPaso(1)
    setMetodo('')
    setNombre('')
    setPagado(false)
  }

  // ---- MODAL CARRITO ----
  if (verCarrito) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: 40 }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '20px 20px 0', marginBottom: 24,
      }}>
        <button onClick={() => { if (paso === 1) setVerCarrito(false); else setPaso(p => p - 1) }}
          style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '50%', width: 38, height: 38, fontSize: 18, color: 'var(--text)', cursor: 'pointer' }}>
          ←
        </button>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>
          {paso === 1 ? 'Tu pedido' : paso === 2 ? 'Datos de pago' : '¡Listo!'}
        </h1>
      </div>

      {/* Paso indicador */}
      {paso < 3 && (
        <div style={{ display: 'flex', gap: 6, padding: '0 20px', marginBottom: 24 }}>
          {[1, 2].map(p => (
            <div key={p} style={{
              flex: 1, height: 4, borderRadius: 2,
              background: paso >= p ? 'var(--gold)' : 'var(--border)',
              transition: 'background 0.3s',
            }} />
          ))}
        </div>
      )}

      {/* PASO 1: Resumen carrito */}
      {paso === 1 && (
        <div style={{ padding: '0 20px' }}>
          {itemsCarrito.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🛒</div>
              <p>Tu carrito está vacío</p>
              <button onClick={() => setVerCarrito(false)} style={{
                marginTop: 16, padding: '10px 24px', background: 'var(--gold)',
                color: '#0a0a0f', borderRadius: 8, fontWeight: 600, fontSize: 14,
              }}>Ver menú</button>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                {itemsCarrito.map(item => (
                  <div key={item.id} style={{
                    background: 'var(--card)', borderRadius: 12,
                    border: '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                  }}>
                    <span style={{ fontSize: 28 }}>{item.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 600, fontSize: 14 }}>{item.nombre}</p>
                      <p style={{ fontSize: 12, color: 'var(--gold)', fontWeight: 700, marginTop: 2 }}>
                        ${(item.precio * carrito[item.id]).toLocaleString('es-CO')}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <button onClick={() => quitar(item)} style={ctrlBtn}>−</button>
                      <span style={{ fontWeight: 700, minWidth: 20, textAlign: 'center' }}>{carrito[item.id]}</span>
                      <button onClick={() => agregar(item)} style={{ ...ctrlBtn, background: 'var(--gold)', color: '#0a0a0f' }}>+</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div style={{
                background: 'var(--bg3)', borderRadius: 12, padding: '16px',
                border: '1px solid var(--border)', marginBottom: 20,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: 'var(--muted)', fontSize: 14 }}>Subtotal ({totalItems} items)</span>
                  <span style={{ fontSize: 14 }}>${totalPrecio.toLocaleString('es-CO')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: 'var(--muted)', fontSize: 14 }}>Servicio</span>
                  <span style={{ fontSize: 14 }}>$0</span>
                </div>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10, marginTop: 4, display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 700, fontSize: 16 }}>Total</span>
                  <span style={{ fontWeight: 700, fontSize: 18, color: 'var(--gold)' }}>${totalPrecio.toLocaleString('es-CO')}</span>
                </div>
              </div>

              <button onClick={() => setPaso(2)} style={{
                width: '100%', padding: '15px', background: 'var(--gold)',
                color: '#0a0a0f', borderRadius: 12, fontSize: 15, fontWeight: 700,
              }}>
                Continuar al pago →
              </button>
            </>
          )}
        </div>
      )}

      {/* PASO 2: Datos + método de pago */}
      {paso === 2 && (
        <div style={{ padding: '0 20px' }}>
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Nombre completo</label>
            <input
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              placeholder="Ej: Juan Pérez"
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: 28 }}>
            <label style={labelStyle}>Método de pago</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { id: 'efectivo', label: 'Efectivo', icon: '💵', desc: 'Paga en caja al recoger' },
                { id: 'tarjeta', label: 'Tarjeta', icon: '💳', desc: 'Débito o crédito' },
                { id: 'transferencia', label: 'Transferencia', icon: '📱', desc: 'Nequi, Daviplata, PSE' },
              ].map(m => (
                <button key={m.id} onClick={() => setMetodo(m.id)} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '14px 16px', borderRadius: 12, cursor: 'pointer',
                  background: metodo === m.id ? 'rgba(232,184,75,0.12)' : 'var(--card)',
                  border: metodo === m.id ? '2px solid var(--gold)' : '1px solid var(--border)',
                  transition: 'all 0.2s', textAlign: 'left',
                }}>
                  <span style={{ fontSize: 28 }}>{m.icon}</span>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 14, color: metodo === m.id ? 'var(--gold)' : 'var(--text)' }}>{m.label}</p>
                    <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{m.desc}</p>
                  </div>
                  {metodo === m.id && <span style={{ marginLeft: 'auto', color: 'var(--gold)', fontSize: 18 }}>✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Resumen compacto */}
          <div style={{
            background: 'var(--card)', borderRadius: 12, padding: '14px 16px',
            border: '1px solid var(--border)', marginBottom: 20,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ color: 'var(--muted)', fontSize: 14 }}>{totalItems} productos</span>
            <span style={{ fontWeight: 700, color: 'var(--gold)', fontSize: 16 }}>${totalPrecio.toLocaleString('es-CO')}</span>
          </div>

          <button
            onClick={handlePagar}
            disabled={!nombre.trim() || !metodo}
            style={{
              width: '100%', padding: '15px',
              background: (!nombre.trim() || !metodo) ? 'var(--bg3)' : 'var(--gold)',
              color: (!nombre.trim() || !metodo) ? 'var(--muted)' : '#0a0a0f',
              borderRadius: 12, fontSize: 15, fontWeight: 700,
              border: 'none', cursor: (!nombre.trim() || !metodo) ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s',
            }}>
            Confirmar pedido 🍿
          </button>
        </div>
      )}

      {/* PASO 3: Confirmación */}
      {paso === 3 && (
        <div style={{ padding: '20px 20px', textAlign: 'center' }}>
          <div style={{
            fontSize: 80, marginBottom: 20,
            animation: 'bounce 0.6s ease',
          }}>🎉</div>
          <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 10 }}>¡Reserva realizada!</h2>
          <p style={{ color: 'var(--muted)', marginBottom: 6, fontSize: 15 }}>
            Pago completado exitosamente
          </p>
          <p style={{ color: 'var(--gold)', fontWeight: 600, fontSize: 14, marginBottom: 32 }}>
            {metodo === 'efectivo' ? '💵 Paga en caja al recoger' :
             metodo === 'tarjeta' ? '💳 Cargo procesado' : '📱 Transferencia recibida'}
          </p>

          {/* Ticket */}
          <div style={{
            background: 'var(--card)', borderRadius: 16,
            border: '1px solid var(--border)', padding: '20px',
            marginBottom: 28, textAlign: 'left',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
              <span style={{ color: 'var(--muted)', fontSize: 13 }}>Cliente</span>
              <span style={{ fontWeight: 600, fontSize: 13 }}>{nombre}</span>
            </div>
            {itemsCarrito.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: 'var(--muted)' }}>{item.emoji} {item.nombre} x{carrito[item.id]}</span>
                <span style={{ fontSize: 13 }}>${(item.precio * carrito[item.id]).toLocaleString('es-CO')}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, marginTop: 8, display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 700 }}>Total pagado</span>
              <span style={{ fontWeight: 700, color: 'var(--gold)' }}>${totalPrecio.toLocaleString('es-CO')}</span>
            </div>
          </div>

          <button onClick={resetear} style={{
            width: '100%', padding: '15px', background: 'var(--gold)',
            color: '#0a0a0f', borderRadius: 12, fontSize: 15, fontWeight: 700,
          }}>
            Volver al menú
          </button>
        </div>
      )}
    </div>
  )

  // ---- MENÚ PRINCIPAL ----
  return (
    <div style={{ paddingTop: 60, paddingBottom: totalItems > 0 ? 140 : 80, minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />

      <div style={{ padding: '28px 20px 16px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Dulcería</h1>
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>Arma tu combo perfecto 🍿</p>
      </div>

      {MENU.map(categoria => (
        <div key={categoria.categoria} style={{ marginBottom: 28 }}>
          <h2 style={{
            padding: '0 20px', marginBottom: 12,
            fontSize: 13, fontWeight: 600, letterSpacing: '0.06em',
            textTransform: 'uppercase', color: 'var(--gold)',
          }}>{categoria.categoria}</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '0 20px' }}>
            {categoria.items.map(item => (
              <div key={item.id} style={{
                background: 'var(--card)', borderRadius: 12,
                border: carrito[item.id] ? '1px solid rgba(232,184,75,0.4)' : '1px solid var(--border)',
                display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px',
                transition: 'border-color 0.2s',
              }}>
                <span style={{ fontSize: 32, flexShrink: 0 }}>{item.emoji}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{item.nombre}</p>
                  <p style={{ fontSize: 12, color: 'var(--muted)' }}>{item.desc}</p>
                  <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--gold)', marginTop: 4 }}>
                    ${item.precio.toLocaleString('es-CO')}
                  </p>
                </div>

                {carrito[item.id] ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                    <button onClick={() => quitar(item)} style={ctrlBtn}>−</button>
                    <span style={{ fontSize: 15, fontWeight: 700, minWidth: 20, textAlign: 'center' }}>
                      {carrito[item.id]}
                    </span>
                    <button onClick={() => agregar(item)} style={{ ...ctrlBtn, background: 'var(--gold)', color: '#0a0a0f' }}>+</button>
                  </div>
                ) : (
                  <button onClick={() => agregar(item)} style={{
                    padding: '8px 14px', background: 'var(--bg2)',
                    border: '1px solid var(--border)', borderRadius: 8,
                    fontSize: 13, color: 'var(--text)', flexShrink: 0,
                    fontWeight: 500, cursor: 'pointer',
                  }}>
                    + Agregar
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Botón flotante carrito */}
      {totalItems > 0 && (
        <button onClick={() => { setVerCarrito(true); setPaso(1) }} style={{
          position: 'fixed', bottom: 76, left: 16, right: 16,
          background: 'var(--gold)', borderRadius: 14, padding: '14px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          boxShadow: '0 8px 32px rgba(232,184,75,0.35)',
          zIndex: 90, cursor: 'pointer', border: 'none',
          animation: 'slideUp 0.3s ease',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              background: '#0a0a0f', color: 'var(--gold)',
              borderRadius: '50%', width: 28, height: 28,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700,
            }}>{totalItems}</div>
            <span style={{ color: '#0a0a0f', fontWeight: 600, fontSize: 14 }}>
              Ver mi pedido 🛒
            </span>
          </div>
          <span style={{ color: '#0a0a0f', fontWeight: 700, fontSize: 16 }}>
            ${totalPrecio.toLocaleString('es-CO')}
          </span>
        </button>
      )}

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes bounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
      `}</style>
    </div>
  )
}

const ctrlBtn = {
  width: 28, height: 28, borderRadius: '50%',
  background: 'var(--bg2)', color: 'var(--text)',
  border: '1px solid var(--border)', fontSize: 16,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer',
}
const labelStyle = {
  display: 'block', fontSize: 12, color: 'var(--muted)',
  marginBottom: 8, letterSpacing: '0.05em', textTransform: 'uppercase',
}
const inputStyle = {
  width: '100%', padding: '12px 14px',
  background: 'var(--bg2)', border: '1px solid var(--border)',
  borderRadius: 10, color: 'var(--text)', fontSize: 15, outline: 'none',
}
