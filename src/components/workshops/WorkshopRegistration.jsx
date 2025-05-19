"use client"

import { useState } from "react"
import "./WorkshopRegistration.css"

const WorkshopRegistration = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    interest: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Aquí podrías enviar los datos a un endpoint de backend
    alert("¡Gracias por tu interés! Te contactaremos pronto con más información sobre nuestros talleres.")
    setFormData({
      name: "",
      email: "",
      interest: "",
    })
  }

  return (
    <section className="workshop-registration">
      <div className="container">
        <div className="registration-content">
          <div className="registration-text">
            <h2>¿Interesado en nuestros talleres?</h2>
            <p>Regístrate para recibir información sobre nuevos talleres y eventos especiales.</p>
          </div>
          <div className="registration-form">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Nombre completo"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Correo electrónico"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <select id="interest" name="interest" value={formData.interest} onChange={handleChange} required>
                  <option value="">Selecciona tu área de interés</option>
                  <option value="barismo">Barismo</option>
                  <option value="pasteleria">Pastelería</option>
                  <option value="arte">Arte y manualidades</option>
                  <option value="inclusion">Inclusión y accesibilidad</option>
                  <option value="otros">Otros</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary">
                Registrarme
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WorkshopRegistration
