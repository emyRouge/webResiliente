import { Link } from "react-router-dom"
import "./Hero.css"

const Hero = () => {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <div className="hero-badge">
            <i className="fas fa-coffee"></i>
            Café con propósito social
          </div>
          <h2>Bienvenidos a <span>Resiliente</span></h2>
          <p>Un espacio inclusivo donde el café une a la comunidad.<br />Calidad, calidez y diversidad en cada taza.</p>
          <div className="hero-buttons">
            <Link to="/productos" className="btn btn-primary">
              Nuestros Productos
            </Link>
            <Link to="/talleres" className="btn btn-secondary">
              Descubre Talleres
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
