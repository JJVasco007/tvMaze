import { useEffect, useMemo, useState } from 'react'
import Tarjeta from '../tarjeta'
import './style.css'

function detalleSerie(serie) {
  const anio = serie.premiered ? serie.premiered.slice(0, 4) : ''
  const puntaje = serie.rating?.average ? `★ ${serie.rating.average}` : ''
  return [anio, puntaje].filter(Boolean).join(' · ')
}

// Cada página de TVmaze trae hasta 250 series.
async function obtenerPagina(numero) {
  const respuesta = await fetch(`https://api.tvmaze.com/shows?page=${numero}`)
  if (!respuesta.ok) {
    const error = new Error(`Error ${respuesta.status}`)
    error.status = respuesta.status
    throw error
  }
  return respuesta.json()
}

const ORDENES = [
  { valor: 'defecto', texto: 'Orden original' },
  { valor: 'rating', texto: 'Mejor calificadas' },
  { valor: 'nombre', texto: 'Nombre (A-Z)' },
  { valor: 'reciente', texto: 'Más recientes' },
]

function Inicio() {
  const [series, setSeries] = useState([])
  const [pagina, setPagina] = useState(0)
  const [hayMas, setHayMas] = useState(true)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [genero, setGenero] = useState('Todos')
  const [estado, setEstado] = useState('Todos')
  const [orden, setOrden] = useState('defecto')

  useEffect(() => {
    let activo = true
    obtenerPagina(pagina)
      .then((datos) => {
        if (!activo) return
        setSeries((anteriores) => (pagina === 0 ? datos : [...anteriores, ...datos]))
        setHayMas(datos.length > 0)
        setError('')
      })
      .catch((fallo) => {
        if (!activo) return
        if (fallo.status === 404) setHayMas(false)
        else setError('No se pudieron cargar las series. Intenta de nuevo.')
      })
      .finally(() => {
        if (activo) setCargando(false)
      })
    return () => {
      activo = false
    }
  }, [pagina])

  const generos = useMemo(
    () => ['Todos', ...[...new Set(series.flatMap((serie) => serie.genres))].sort()],
    [series],
  )

  const estados = useMemo(
    () => ['Todos', ...new Set(series.map((serie) => serie.status))],
    [series],
  )

  const resultados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase()
    const lista = series.filter(
      (serie) =>
        (genero === 'Todos' || serie.genres.includes(genero)) &&
        (estado === 'Todos' || serie.status === estado) &&
        (texto.length < 2 || serie.name.toLowerCase().includes(texto)),
    )

    if (orden === 'rating') {
      lista.sort((a, b) => (b.rating?.average ?? 0) - (a.rating?.average ?? 0))
    } else if (orden === 'nombre') {
      lista.sort((a, b) => a.name.localeCompare(b.name))
    } else if (orden === 'reciente') {
      lista.sort((a, b) => (b.premiered ?? '').localeCompare(a.premiered ?? ''))
    }
    return lista
  }, [series, busqueda, genero, estado, orden])

  if (error && series.length === 0) {
    return <p className="mensaje">{error}</p>
  }

  if (cargando && series.length === 0) {
    return <p className="mensaje">Cargando series...</p>
  }

  return (
    <main className="pagina inicio">
      <h1>Series</h1>
      <p className="texto-suave">
        {resultados.length} de {series.length} series
      </p>

      <div className="c-filtro" role="group" aria-label="Filtrar por género">
        {generos.map((unGenero) => (
          <button
            type="button"
            key={unGenero}
            className={unGenero === genero ? 'activo' : ''}
            aria-pressed={unGenero === genero}
            onClick={() => setGenero(unGenero)}
          >
            {unGenero}
          </button>
        ))}
      </div>

      <div className="c-controles">
        <input
          type="search"
          placeholder="Buscar serie"
          value={busqueda}
          onChange={(evento) => setBusqueda(evento.target.value)}
          className="c-buscador"
          aria-label="Buscar serie"
        />
        <select
          value={estado}
          onChange={(evento) => setEstado(evento.target.value)}
          aria-label="Filtrar por estado"
        >
          {estados.map((unEstado) => (
            <option key={unEstado} value={unEstado}>
              {unEstado === 'Todos' ? 'Todos los estados' : unEstado}
            </option>
          ))}
        </select>
        <select
          value={orden}
          onChange={(evento) => setOrden(evento.target.value)}
          aria-label="Ordenar series"
        >
          {ORDENES.map((unOrden) => (
            <option key={unOrden.valor} value={unOrden.valor}>
              {unOrden.texto}
            </option>
          ))}
        </select>
      </div>

      {resultados.length === 0 ? (
        <p className="mensaje">No se encontraron series con esos filtros.</p>
      ) : (
        <div className="series-grid">
          {resultados.map((serie) => (
            <Tarjeta
              key={serie.id}
              id={serie.id}
              nombre={serie.name}
              imagen={serie.image?.medium}
              detalle={detalleSerie(serie)}
            />
          ))}
        </div>
      )}

      {error && <p className="mensaje">{error}</p>}

      {hayMas && (
        <button
          type="button"
          className="boton-mas"
          disabled={cargando}
          onClick={() => {
            setCargando(true)
            setPagina((actual) => actual + 1)
          }}
        >
          {cargando ? 'Cargando...' : 'Cargar más series'}
        </button>
      )}
    </main>
  )
}

export default Inicio
