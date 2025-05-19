"use client"

import { Link } from "react-router-dom"
import "./Footer.css"

const Footer = () => {
  const handleSubmit = (e) => {
    e.preventDefault()
    alert("¡Gracias por suscribirte a nuestro boletín!")
    e.target.reset()
  }

  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="footer-logo">
            <h2>Resiliente</h2>
            <p>Cafetería Inclusiva</p>
          </div>
          <div className="footer-links">
            <h3>Enlaces rápidos</h3>
            <ul>
              <li>
                <Link to="/">Inicio</Link>
              </li>
              <li>
                <Link to="/productos">Productos</Link>
              </li>
              <li>
                <Link to="/publicaciones">Blog</Link>
              </li>
              <li>
                <Link to="/talleres">Talleres</Link>
              </li>
            </ul>
          </div>
          <div className="footer-newsletter">
            <h3>Suscríbete a nuestro boletín</h3>
            <form onSubmit={handleSubmit}>
              <input type="email" placeholder="Tu correo electrónico" required />
              <button type="submit" className="btn btn-primary">
                Suscribirse
              </button>
            </form>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Cafetería Inclusiva Resiliente. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
