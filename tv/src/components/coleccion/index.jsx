import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './style.css'

const CLAVE = 'misSeries'

function leerCapturadas() {
  try {
    const guardadas = JSON.parse(localStorage.getItem(CLAVE) || '[]')
    return Array.isArray(guardadas) ? [...new Set(guardadas.map(Number))] : []
  } catch {
    return []
  }
}

function Coleccion() {
  const [catalogo, setCatalogo] = useState([])
  const [error, setError] = useState('')
  const [capturadas, setCapturadas] = useState(leerCapturadas)
  const [nuevas, setNuevas] = useState([])

  useEffect(() => {
    let activo = true
    fetch('https://api.tvmaze.com/shows?page=0')
      .then((respuesta) => {
        if (!respuesta.ok) throw new Error(`Error ${respuesta.status}`)
        return respuesta.json()
      })
      .then((datos) => {
        if (activo) setCatalogo(datos)
      })
      .catch(() => {
        if (activo) setError('No se pudo cargar el catálogo.')
      })
    return () => {
      activo = false
    }
  }, [])

  const total = catalogo.length

  const conseguirAleatorias = () => {
    const sorteadas = Array.from(
      { length: 4 },
      () => catalogo[Math.floor(Math.random() * total)],
    )
    const vistas = new Set(capturadas)
    const resultados = sorteadas.map((serie) => {
      const repetida = vistas.has(serie.id)
      vistas.add(serie.id)
      return { serie, repetida }
    })
    const actualizadas = [...vistas]

    setCapturadas(actualizadas)
    setNuevas(resultados)
    localStorage.setItem(CLAVE, JSON.stringify(actualizadas))
  }

  if (error) return <p className="mensaje">{error}</p>
  if (total === 0) return <p className="mensaje">Cargando colección...</p>

  return (
    <main className="coleccion">
      <h1 className="coleccion-titulo">Colección</h1>
      <p className="coleccion-contador">
        {capturadas.length} <span>/ {total}</span>
      </p>
      <button
        type="button"
        className="coleccion-boton"
        onClick={conseguirAleatorias}
        disabled={capturadas.length >= total}
      >
        4 nuevas series
      </button>

      {nuevas.length > 0 && <h2 className="coleccion-subtitulo">Tus nuevas series</h2>}
      <section className="coleccion-nuevas">
        {nuevas.map(({ serie, repetida }, indice) => (
          <Link
            key={`${serie.id}-${indice}`}
            to={`/serie/${serie.id}`}
            className={repetida ? 'coleccion-nueva repetida' : 'coleccion-nueva'}
          >
            {serie.image?.medium && <img src={serie.image.medium} alt="" />}
            <p>{serie.name}</p>
            {repetida && <small>Repetida</small>}
          </Link>
        ))}
      </section>

      <section className="coleccion-album">
        {catalogo.map((serie) => {
          const capturada = capturadas.includes(serie.id)
          return capturada ? (
            <Link
              key={serie.id}
              to={`/serie/${serie.id}`}
              className="coleccion-serie capturada"
              title={serie.name}
            >
              {serie.image?.medium ? (
                <img src={serie.image.medium} alt={serie.name} loading="lazy" />
              ) : (
                <span>{serie.id}</span>
              )}
            </Link>
          ) : (
            <div key={serie.id} className="coleccion-serie">
              <span>{serie.id}</span>
            </div>
          )
        })}
      </section>
    </main>
  )
}

export default Coleccion
