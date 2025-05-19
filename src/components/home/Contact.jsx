import "./Contact.css"

const Contact = () => {
  return (
    <section className="contact">
      <div className="container">
        <div className="contact-content">
          <div className="contact-info">
            <h2>Visítanos</h2>
            <p>
              <i className="fas fa-map-marker-alt"></i> Av. Principal 123, Ciudad
            </p>
            <p>
              <i className="fas fa-phone"></i> +123 456 7890
            </p>
            <p>
              <i className="fas fa-envelope"></i> info@resiliente.com
            </p>
            <div className="social-media">
              <a href="#" className="social-icon">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-twitter"></i>
              </a>
            </div>
          </div>
          <div className="contact-hours">
            <h2>Horario</h2>
            <p>Lunes a Viernes: 8:00 AM - 8:00 PM</p>
            <p>Sábados y Domingos: 9:00 AM - 6:00 PM</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
