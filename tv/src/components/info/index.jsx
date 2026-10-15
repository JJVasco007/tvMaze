import './style.css'

function Info() {
  return (
    <main className="pagina info">
      <h1>Info</h1>
      <p>
        Esta aplicación muestra series de televisión y te deja filtrarlas por género, estado y
        puntaje. Puedes guardar tus favoritas y conseguir series nuevas en la colección.
      </p>
      <p>
        Los datos vienen de{' '}
        <a href="https://www.tvmaze.com/api" target="_blank" rel="noreferrer">
          la API de TVmaze
        </a>
        .
      </p>
    </main>
  )
}

export default Info
