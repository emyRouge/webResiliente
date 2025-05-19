"use client"

import { useApi } from "../../context/ApiContext"
import "./PostCard.css"

const PostCard = ({ post, onViewDetails }) => {
  const { getProxiedFileUrl } = useApi()
  const publishDate = new Date(post.fechaPublicacion)

  // Determinar la fuente de la imagen
  let imageSrc = "https://placehold.co/800x400?text=Blog"
  if (post.imagen) {
    if (post.imagen.startsWith("http")) {
      // Es una URL de Wasabi - usar proxy
      imageSrc = getProxiedFileUrl(post.imagen)
    } else {
      // Es base64 (compatibilidad con datos existentes)
      imageSrc = `data:image/jpeg;base64,${post.imagen}`
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
    <article className="post-card">
      <div className="post-image">
        <img src={imageSrc || "/placeholder.svg"} alt={post.titulo} />
      </div>
      <div className="post-info">
        <div className="post-date">{formatDate(publishDate)}</div>
        <h2 className="post-title">{post.titulo}</h2>
        <div className="post-excerpt">{post.contenido.substring(0, 150)}...</div>
        <div className="post-actions">
          <button className="btn btn-secondary" onClick={() => onViewDetails(post.id)}>
            Leer más
          </button>
        </div>
      </div>
    </article>
  )
}

export default PostCard
