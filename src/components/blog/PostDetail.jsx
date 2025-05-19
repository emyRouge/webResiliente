import { useApi } from "../../context/ApiContext"
import "./PostDetail.css"

const PostDetail = ({ post }) => {
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
    <article className="post-full">
      <header className="post-header">
        <h1>{post.titulo}</h1>
        <div className="post-meta">
          <span className="post-date">
            <i className="fas fa-calendar"></i> {formatDate(publishDate)}
          </span>
        </div>
      </header>
      <div className="post-featured-image">
        <img src={imageSrc || "/placeholder.svg"} alt={post.titulo} />
      </div>
      <div className="post-content">{post.contenido}</div>
      <div className="post-footer">
        <div className="post-share">
          <span>Compartir:</span>
          <a href="#" className="social-icon">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="#" className="social-icon">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="#" className="social-icon">
            <i className="fab fa-whatsapp"></i>
          </a>
        </div>
      </div>
    </article>
  )
}

export default PostDetail
