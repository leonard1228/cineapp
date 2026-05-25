# 🎭 CineApp

App de cine construida con React + Vite + Supabase.

## Páginas
- `/` — Login
- `/home` — Cartelera con filtro por género y días
- `/pelicula/:id` — Detalle: sinopsis, horarios, sala recomendada, reservar
- `/dulceria` — Menú con carrito
- `/perfil` — Perfil y reservas del usuario

---

## Desarrollo local
```bash
cp .env.example .env
# Edita .env con tus keys de Supabase
npm install
npm run dev
```

---

## Deploy en Render

### 1. Subir a GitHub
```bash
git init
git add .
git commit -m "CineApp inicial"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/cineapp.git
git push -u origin main
```

### 2. En render.com → New → Static Site
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`

### 3. Variables de entorno
```
VITE_SUPABASE_URL = https://TU_PROYECTO.supabase.co
VITE_SUPABASE_ANON_KEY = TU_ANON_KEY
```

### 4. Redirects/Rewrites (React Router)
- Source: `/*`  Destination: `/index.html`  Type: Rewrite

### 5. Keys de Supabase
supabase.com → tu proyecto → Settings → API
