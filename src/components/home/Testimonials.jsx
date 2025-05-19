import "./Testimonials.css"

const Testimonials = () => {
  const testimonials = [
    {
      content:
        '"Resiliente no es solo una cafetería, es un espacio donde me siento parte de una comunidad. El café es excelente y el ambiente es inigualable."',
      author: "María González",
      role: "Cliente frecuente",
    },
    {
      content:
        '"Los talleres que ofrecen son una oportunidad increíble para aprender y conectar con personas maravillosas. Recomiendo totalmente este lugar."',
      author: "Carlos Rodríguez",
      role: "Participante de talleres",
    },
    {
      content:
        '"Como persona con discapacidad, encontrar espacios verdaderamente inclusivos es difícil. Resiliente lo ha logrado, me siento bienvenido y valorado."',
      author: "Javier Méndez",
      role: "Cliente regular",
    },
  ]

  return (
    <section className="testimonials">
      <div className="container">
        <h2 className="section-title">Lo que dicen nuestros clientes</h2>
        <div className="testimonials-slider">
          {testimonials.map((testimonial, index) => (
            <div className="testimonial" key={index}>
              <div className="testimonial-content">
                <p>{testimonial.content}</p>
              </div>
              <div className="testimonial-author">
                <h4>{testimonial.author}</h4>
                <p>{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
