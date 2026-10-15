import './style.css'

function contar(clave) {
  try {
    const guardados = JSON.parse(localStorage.getItem(clave) || '[]')
    return Array.isArray(guardados) ? guardados.length : 0
  } catch {
    return 0
  }
}

function Usuario() {
  const favoritos = contar('favoritosSeries')
  const capturadas = contar('misSeries')

  return (
    <main className="pagina usuario">
      <h1>Usuario</h1>
      <div className="usuario-cifras">
        <p>
          <strong>{favoritos}</strong>
          <span>series favoritas</span>
        </p>
        <p>
          <strong>{capturadas}</strong>
          <span>series en tu colección</span>
        </p>
      </div>
    </main>
  )
}

export default Usuario
