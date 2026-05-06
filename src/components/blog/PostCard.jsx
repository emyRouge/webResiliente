import { useApi } from "../../context/ApiContext"
import "./PostCard.css"

const PostCard = ({ post, onViewDetails }) => {
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

  const formatDate = (date) =>
    date.toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" })

  return (
    <article className="post-card">
      <div className="post-image">
        <img src={imageSrc} alt={post.titulo} loading="lazy" />
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
