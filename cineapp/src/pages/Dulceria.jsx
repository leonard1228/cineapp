import Navbar from '../components/Navbar'
import { useState } from 'react'

const MENU = [
  {
    categoria: 'Combos Estrella',
    items: [
      { id: 1, nombre: 'Combo Dúo', desc: '2 crispetas medianas + 2 bebidas', precio: 35000, emoji: '🍿🥤' },
      { id: 2, nombre: 'Combo Familiar', desc: '1 crispeta grande + 4 bebidas + nachos', precio: 68000, emoji: '👨‍👩‍👧‍👦' },
      { id: 3, nombre: 'Combo Solo', desc: '1 crispeta mediana + 1 bebida', precio: 22000, emoji: '🎬' },
    ]
  },
  {
    categoria: 'Crispetas',
    items: [
      { id: 4, nombre: 'Crispetas Pequeñas', desc: 'Saladas o dulces', precio: 9000, emoji: '🍿' },
      { id: 5, nombre: 'Crispetas Medianas', desc: 'Saladas o dulces', precio: 13000, emoji: '🍿' },
      { id: 6, nombre: 'Crispetas Grandes', desc: 'Saladas o dulces', precio: 18000, emoji: '🍿' },
      { id: 7, nombre: 'Crispetas Jumbo', desc: 'La más grande + sabor extra', precio: 24000, emoji: '🍿' },
    ]
  },
  {
    categoria: 'Bebidas',
    items: [
      { id: 8, nombre: 'Gaseosa Mediana', desc: 'Coca-Cola, Sprite o Fanta', precio: 7000, emoji: '🥤' },
      { id: 9, nombre: 'Gaseosa Grande', desc: 'Coca-Cola, Sprite o Fanta', precio: 9500, emoji: '🥤' },
      { id: 10, nombre: 'Agua', desc: '500ml', precio: 4500, emoji: '💧' },
      { id: 11, nombre: 'Malteada', desc: 'Chocolate, vainilla o fresa', precio: 14000, emoji: '🥛' },
    ]
  },
  {
    categoria: 'Snacks',
    items: [
      { id: 12, nombre: 'Nachos con Queso', desc: 'Porción grande con salsa cheddar', precio: 12000, emoji: '🧀' },
      { id: 13, nombre: 'Hot Dog', desc: 'Clásico con mostaza y kétchup', precio: 9000, emoji: '🌭' },
      { id: 14, nombre: 'Chocolatinas', desc: 'Variety pack de dulces', precio: 6000, emoji: '🍫' },
      { id: 15, nombre: 'Gomas', desc: 'Bolsa familiar', precio: 5500, emoji: '🐻' },
    ]
  },
]

export default function Dulceria() {
  const [carrito, setCarrito] = useState({})

  function agregar(item) {
    setCarrito(prev => ({ ...prev, [item.id]: (prev[item.id] || 0) + 1 }))
  }

  function quitar(item) {
    setCarrito(prev => {
      const nuevo = { ...prev }
      if (nuevo[item.id] > 1) nuevo[item.id]--
      else delete nuevo[item.id]
      return nuevo
    })
  }

  const totalItems = Object.values(carrito).reduce((a, b) => a + b, 0)
  const totalPrecio = MENU.flatMap(c => c.items)
    .filter(i => carrito[i.id])
    .reduce((acc, i) => acc + i.precio * carrito[i.id], 0)

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
                border: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px',
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
                    fontWeight: 500,
                  }}>
                    + Agregar
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Carrito flotante */}
      {totalItems > 0 && (
        <div style={{
          position: 'fixed', bottom: 76, left: 16, right: 16,
          background: 'var(--gold)', borderRadius: 14, padding: '14px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          boxShadow: '0 8px 32px rgba(232,184,75,0.3)',
          zIndex: 90,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              background: '#0a0a0f', color: 'var(--gold)',
              borderRadius: '50%', width: 28, height: 28,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700,
            }}>{totalItems}</div>
            <span style={{ color: '#0a0a0f', fontWeight: 600, fontSize: 14 }}>
              Ver pedido
            </span>
          </div>
          <span style={{ color: '#0a0a0f', fontWeight: 700, fontSize: 16 }}>
            ${totalPrecio.toLocaleString('es-CO')}
          </span>
        </div>
      )}
    </div>
  )
}

const ctrlBtn = {
  width: 28, height: 28, borderRadius: '50%',
  background: 'var(--bg2)', color: 'var(--text)',
  border: '1px solid var(--border)',
  fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer',
}
