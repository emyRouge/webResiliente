"use client"

import { useApi } from "../../context/ApiContext"
import "./WorkshopCard.css"

const WorkshopCard = ({ workshop, onViewDetails }) => {
  const { getProxiedFileUrl } = useApi()
  const startDate = new Date(workshop.fechaInicio)
  const endDate = new Date(workshop.fechaFin)

  // Determinar la fuente de la imagen
  let imageSrc = "https://placehold.co/300x200?text=Taller"
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

  return (
    <div className="workshop-card">
      <div className="workshop-image">
        <img src={imageSrc || "/placeholder.svg"} alt={workshop.nombre} />
      </div>
      <div className="workshop-info">
        <div className="workshop-date">
          {formatDate(startDate)} - {formatDate(endDate)}
        </div>
        <h3 className="workshop-title">{workshop.nombre}</h3>
        <p className="workshop-description">{workshop.descripcion.substring(0, 100)}...</p>
        <div className="workshop-actions">
          <button className="btn btn-primary" onClick={() => onViewDetails(workshop.id)}>
            Ver detalles
          </button>
        </div>
      </div>
    </div>
  )
}

export default WorkshopCard
