import { Link } from "react-router-dom"
import "./Footer.css"

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo-wrap">
              <span className="footer-logo-main">Resiliente</span>
              <span className="footer-logo-sub">Café Inclusivo</span>
            </div>
            <p className="footer-desc">
              Un espacio donde todos son bienvenidos. Café de especialidad con propósito social.
            </p>
            <div className="footer-social">
              <a href="#" className="social-btn" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="social-btn" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="social-btn" aria-label="Twitter/X">
                <i className="fab fa-twitter"></i>
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h3 className="footer-heading">Navegación</h3>
            <ul className="footer-links">
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/productos">Productos</Link></li>
              <li><Link to="/publicaciones">Blog</Link></li>
              <li><Link to="/talleres">Talleres</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h3 className="footer-heading">Contacto</h3>
            <ul className="footer-contact-list">
              <li>
                <i className="fas fa-map-marker-alt"></i>
                <span>Av. Principal 123, Ciudad</span>
              </li>
              <li>
                <i className="fas fa-phone"></i>
                <span>+123 456 7890</span>
              </li>
              <li>
                <i className="fas fa-envelope"></i>
                <span>info@resiliente.com</span>
              </li>
              <li>
                <i className="fas fa-clock"></i>
                <span>Lun–Vie 8:00–20:00<br />Sáb–Dom 9:00–18:00</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Café Resiliente. Todos los derechos reservados.</p>
          <p className="footer-tagline-bottom">Inclusión · Comunidad · Calidad</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
