import { BrowserRouter as Router, Route, Routes, Navigate, NavLink } from 'react-router-dom'

import Inicio from './components/inicio'
import Top from './components/top'
import Favoritos from './components/favoritos'
import Info from './components/info'
import Coleccion from './components/coleccion'
import Usuario from './components/usuario'
import Serie from './components/serie'
import './App.css'

function App() {
  return (
    <Router>
      <nav className="c-menu">
        <NavLink to="/" end>Inicio</NavLink>
        <NavLink to="/top">Top</NavLink>
        <NavLink to="/coleccion">Colección</NavLink>
        <NavLink to="/favoritos">Favoritos</NavLink>
        <NavLink to="/info">Info</NavLink>
        <NavLink to="/usuario">Usuario</NavLink>
      </nav>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/top" element={<Top />} />
        <Route path="/favoritos" element={<Favoritos />} />
        <Route path="/coleccion" element={<Coleccion />} />
        <Route path="/info" element={<Info />} />
        <Route path="/usuario" element={<Usuario />} />
        <Route path="/serie/:id" element={<Serie />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
