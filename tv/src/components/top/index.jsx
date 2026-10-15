import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './style.css'

function Top() {
  const [series, setSeries] = useState([])
  const [genero, setGenero] = useState('Todos')
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function cargarSeries() {
      try {
        const paginas = await Promise.all(
          [0, 1, 2, 3].map(async (pagina) => {
            const respuesta = await fetch(
              `https://api.tvmaze.com/shows?page=${pagina}`
            )

            if (!respuesta.ok) {
              throw new Error('Error al cargar')
            }

            return respuesta.json()
          })
        )

        const ordenadas = paginas
          .flat()
          .filter((serie) => serie.rating?.average)
          .sort((a, b) => b.rating.average - a.rating.average)

        setSeries(ordenadas)
      } catch {
        setError(true)
      } finally {
        setCargando(false)
      }
    }

    cargarSeries()
  }, [])

  if (cargando) {
    return <p className="mensaje">Cargando series...</p>
  }

  if (error) {
    return <p className="mensaje">Error al cargar las series.</p>
  }

  const generos = [
    'Todos',
    ...new Set(series.flatMap((serie) => serie.genres))
  ]

  const mejores = series
    .filter((serie) =>
      genero === 'Todos' || serie.genres.includes(genero)
    )
    .slice(0, 10)

  return (
    <main className="pagina top">
      <h1>Mejores series</h1>

      <p className="texto-suave">
        Las {mejores.length} series mejor calificadas
      </p>

      <div className="top-generos">
        {generos.map((g) => (
          <button
            type="button"
            key={g}
            className={genero === g ? 'activo' : ''}
            onClick={() => setGenero(g)}
          >
            {g}
          </button>
        ))}
      </div>

      <ol className="top-lista">
        {mejores.map((serie, indice) => {
          const anio = serie.premiered?.slice(0, 4)
          const detalle = [
            anio,
            serie.genres.join(', ')
          ].filter(Boolean).join(' · ')

          return (
            <li key={serie.id}>
              <Link
                to={`/serie/${serie.id}`}
                className="top-fila"
              >
                <span className="top-posicion">
                  {indice + 1}
                </span>

                {serie.image?.medium ? (
                  <img
                    src={serie.image.medium}
                    alt={serie.name}
                    className="top-poster"
                    loading="lazy"
                  />
                ) : (
                  <div className="top-poster top-vacio" />
                )}

                <div className="top-datos">
                  <p className="top-nombre">
                    {serie.name}
                  </p>

                  {detalle && (
                    <p className="top-detalle">
                      {detalle}
                    </p>
                  )}
                </div>

                <span className="top-puntaje">
                  ★ {serie.rating.average}
                </span>
              </Link>
            </li>
          )
        })}
      </ol>
    </main>
  )
}

export default Top