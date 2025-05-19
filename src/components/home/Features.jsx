import "./Features.css"

const Features = () => {
  const features = [
    {
      icon: "coffee",
      title: "Café de Especialidad",
      description: "Seleccionamos los mejores granos para ofrecerte una experiencia única.",
    },
    {
      icon: "users",
      title: "Espacio Inclusivo",
      description: "Creamos un ambiente donde todos son bienvenidos sin distinción.",
    },
    {
      icon: "hands-helping",
      title: "Impacto Social",
      description: "Cada compra contribuye a nuestros programas de inclusión laboral.",
    },
  ]

  return (
    <section className="features">
      <div className="container">
        <h2 className="section-title">¿Por qué elegirnos?</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div className="feature-card" key={index}>
              <div className="feature-icon">
                <i className={`fas fa-${feature.icon}`}></i>
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
