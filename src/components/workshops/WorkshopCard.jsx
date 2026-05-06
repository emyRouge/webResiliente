import { useApi } from "../../context/ApiContext"
import "./WorkshopCard.css"

const WorkshopCard = ({ workshop, onViewDetails }) => {
  const { getFileUrl } = useApi()
  const startDate = new Date(workshop.fechaInicio)
  const endDate = new Date(workshop.fechaFin)

  let imageSrc = `https://picsum.photos/seed/workshop-${workshop.id}/400/300`
  if (workshop.imagen) {
    if (workshop.imagen.startsWith("http")) {
      imageSrc = getFileUrl(workshop.imagen)
    } else {
      imageSrc = `data:image/jpeg;base64,${workshop.imagen}`
    }
  }

  const formatDate = (date) =>
    date.toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" })

  const isSameDay =
    startDate.toDateString() === endDate.toDateString()

  return (
    <div className="workshop-card">
      <div className="workshop-image">
        <img src={imageSrc} alt={workshop.nombre} loading="lazy" />
      </div>
      <div className="workshop-info">
        <div className="workshop-date">
          <i className="fas fa-calendar-alt"></i>
          {isSameDay
            ? formatDate(startDate)
            : `${formatDate(startDate)} – ${formatDate(endDate)}`}
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
