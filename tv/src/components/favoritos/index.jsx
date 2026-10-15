import { Link } from 'react-router-dom'
import Tarjeta from '../tarjeta'
import './style.css'

function leerFavoritos() {
  try {
    const guardados = JSON.parse(localStorage.getItem('favoritosSeries') || '[]')
    return Array.isArray(guardados) ? guardados : []
  } catch {
    return []
  }
}

function Favoritos() {
  const favoritos = leerFavoritos()

  return (
    <main className="pagina">
      <h1>Favoritos</h1>

      {favoritos.length === 0 ? (
        <p className="mensaje">
          Aún no tienes series favoritas. Abre una serie desde <Link to="/">Inicio</Link> y
          pulsa el corazón.
        </p>
      ) : (
        <div className="series-grid">
          {favoritos.map((favorito) => (
            <Tarjeta
              key={favorito.id}
              id={favorito.id}
              nombre={favorito.nombre}
              imagen={favorito.imagen}
              detalle={favorito.detalle}
            />
          ))}
        </div>
      )}
    </main>
  )
}

export default Favoritos
