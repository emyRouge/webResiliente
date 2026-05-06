import "./Contact.css"

const Contact = () => {
  return (
    <section className="contact">
      <div className="container">
        <h2 className="section-title">Visítanos</h2>
        <div className="contact-content">
          <div className="contact-card">
            <div className="contact-card-icon">
              <i className="fas fa-map-marker-alt"></i>
            </div>
            <h2>Encuéntranos</h2>
            <ul className="contact-info-list">
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
            </ul>
            <div className="social-media">
              <a href="#" className="social-icon" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="social-icon" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="social-icon" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
            </div>
          </div>

          <div className="contact-card">
            <div className="contact-card-icon">
              <i className="fas fa-clock"></i>
            </div>
            <h2>Horario</h2>
            <ul className="hours-list">
              <li>
                <span className="days">Lunes – Viernes</span>
                <span className="time">8:00 – 20:00</span>
              </li>
              <li>
                <span className="days">Sábado</span>
                <span className="time">9:00 – 18:00</span>
              </li>
              <li>
                <span className="days">Domingo</span>
                <span className="time">9:00 – 18:00</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
