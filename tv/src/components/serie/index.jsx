import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './style.css'

function quitarHtml(html) {
  return html
    ? new DOMParser().parseFromString(html, 'text/html').body.textContent || ''
    : ''
}

function detalleSerie(serie) {
  const anio = serie.premiered ? serie.premiered.slice(0, 4) : ''
  const puntaje = serie.rating?.average ? `★ ${serie.rating.average}` : ''
  return [anio, puntaje].filter(Boolean).join(' · ')
}

async function obtenerSerie(id) {
  const respuesta = await fetch(`https://api.tvmaze.com/shows/${id}`)
  if (!respuesta.ok) throw new Error(`Error ${respuesta.status}`)
  return respuesta.json()
}

function leerFavoritos() {
  try {
    const guardados = JSON.parse(localStorage.getItem('favoritosSeries') || '[]')
    return Array.isArray(guardados) ? guardados : []
  } catch {
    return []
  }
}

function guardarFavoritos(lista) {
  localStorage.setItem('favoritosSeries', JSON.stringify(lista))
}

function DetalleSerie({ id }) {
  const navigate = useNavigate()
  const [serie, setSerie] = useState(null)
  const [error, setError] = useState('')
  const [favoritos, setFavoritos] = useState(leerFavoritos)

  useEffect(() => {
    let activo = true
    obtenerSerie(id)
      .then((datos) => {
        if (activo) setSerie(datos)
      })
      .catch(() => {
        if (activo) setError('No se pudo cargar la serie.')
      })
    return () => {
      activo = false
    }
  }, [id])

  if (error) return <p className="mensaje">{error}</p>
  if (!serie) return <p className="mensaje">Cargando...</p>

  const esFavorito = favoritos.some((favorito) => favorito.id === serie.id)

  const alternarFavorito = () => {
    const nuevos = esFavorito
      ? favoritos.filter((favorito) => favorito.id !== serie.id)
      : [
          ...favoritos,
          {
            id: serie.id,
            nombre: serie.name,
            imagen: serie.image?.medium ?? null,
            detalle: detalleSerie(serie),
          },
        ]
    setFavoritos(nuevos)
    guardarFavoritos(nuevos)
  }

  const canal = serie.network?.name ?? serie.webChannel?.name
  const duracion = serie.averageRuntime ?? serie.runtime
  const dias = (serie.schedule?.days ?? []).join(', ')
  const resumen = quitarHtml(serie.summary)

  const datos = [
    ['Estado', serie.status],
    ['Estreno', serie.premiered],
    ['Finalizó', serie.ended],
    ['Idioma', serie.language],
    ['Canal', canal],
    ['Duración', duracion ? `${duracion} min` : null],
    ['Emisión', dias],
  ].filter(([, valor]) => valor)

  return (
    <main className="pagina serie">
      <button type="button" className="boton-volver" onClick={() => navigate(-1)}>
        Volver
      </button>

      <article className="serie-ficha">
        {serie.image?.medium ? (
          <img src={serie.image.medium} alt={`Póster de ${serie.name}`} className="serie-poster" />
        ) : (
          <div className="tarjeta-vacia serie-poster">Sin imagen</div>
        )}

        <div className="serie-info">
          <h1>{serie.name}</h1>

          {serie.rating?.average && (
            <p className="serie-puntaje">★ {serie.rating.average} / 10</p>
          )}

          {serie.genres.length > 0 && (
            <ul className="serie-generos">
              {serie.genres.map((genero) => (
                <li key={genero}>{genero}</li>
              ))}
            </ul>
          )}

          <button
            type="button"
            className="boton-favorito"
            onClick={alternarFavorito}
            aria-pressed={esFavorito}
          >
            <span aria-hidden="true">{esFavorito ? '❤️' : '🤍'}</span>{' '}
            {esFavorito ? 'Quitar de favoritos' : 'Añadir a favoritos'}
          </button>
        </div>
      </article>

      {resumen && <p className="serie-resumen">{resumen}</p>}

      <dl className="serie-datos">
        {datos.map(([etiqueta, valor]) => (
          <div key={etiqueta}>
            <dt>{etiqueta}</dt>
            <dd>{valor}</dd>
          </div>
        ))}
      </dl>
    </main>
  )
}

function Serie() {
  const { id } = useParams()
  return <DetalleSerie key={id} id={id} />
}

export default Serie
