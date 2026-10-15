import { Link } from 'react-router-dom'
import './style.css'

function Tarjeta({ id, nombre, imagen, detalle }) {
  return (
    <Link to={`/serie/${id}`} className="tarjeta">
      {imagen ? (
        <img src={imagen} alt="" loading="lazy" />
      ) : (
        <div className="tarjeta-vacia">Sin imagen</div>
      )}
      <p className="tarjeta-nombre">{nombre}</p>
      {detalle && <p className="tarjeta-detalle">{detalle}</p>}
    </Link>
  )
}

export default Tarjeta
