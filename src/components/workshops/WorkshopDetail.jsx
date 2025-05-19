"use client"

import { useApi } from "../../context/ApiContext"
import "./WorkshopDetail.css"

const WorkshopDetail = ({ workshop, onRegister }) => {
  const { getProxiedFileUrl } = useApi()
  const startDate = new Date(workshop.fechaInicio)
  const endDate = new Date(workshop.fechaFin)

  // Determinar la fuente de la imagen
  let imageSrc = "https://placehold.co/600x400?text=Taller"
  if (workshop.imagen) {
    if (workshop.imagen.startsWith("http")) {
      // Es una URL de Wasabi - usar proxy
      imageSrc = getProxiedFileUrl(workshop.imagen)
    } else {
      // Es base64 (compatibilidad con datos existentes)
      imageSrc = `data:image/jpeg;base64,${workshop.imagen}`
    }
  }

  // Formatear fecha
  const formatDate = (date) => {
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  }

  // Formatear hora
  const formatTime = (date) => {
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="detail-content">
      <div className="detail-header">
        <h2>{workshop.nombre}</h2>
        <div className="detail-meta">
          <span>
            <i className="fas fa-calendar"></i> {formatDate(startDate)} - {formatDate(endDate)}
          </span>
          <span>
            <i className="fas fa-clock"></i> {formatTime(startDate)} - {formatTime(endDate)}
          </span>
        </div>
      </div>
      <div className="detail-image">
        <img src={imageSrc || "/placeholder.svg"} alt={workshop.nombre} />
      </div>
      <div className="detail-description">
        <h3>Descripción</h3>
        <p>{workshop.descripcion}</p>
      </div>
      <div className="detail-actions">
        <button className="btn btn-primary" onClick={onRegister}>
          Inscribirse
        </button>
      </div>
    </div>
  )
}

export default WorkshopDetail
