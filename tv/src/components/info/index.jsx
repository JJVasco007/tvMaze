import imagenInfo from '../../assets/series.png'
function Info() {
  return (
    <main className="pagina info">
      <h1>Información de la aplicación</h1>

      <img
        src={imagenInfo}
        alt="Infografía informativa de la aplicación de series"
        className="imagen-info"
      />
    </main>
  )
}

export default Info