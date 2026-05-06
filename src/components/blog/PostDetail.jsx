import { useApi } from "../../context/ApiContext"
import "./PostDetail.css"

const PostDetail = ({ post }) => {
  const { getFileUrl } = useApi()
  const publishDate = new Date(post.fechaPublicacion)

  let imageSrc = `https://picsum.photos/seed/post-${post.id}/800/400`
  if (post.imagen) {
    if (post.imagen.startsWith("http")) {
      imageSrc = getFileUrl(post.imagen)
    } else {
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
