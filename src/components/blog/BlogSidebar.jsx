"use client"

import { useState } from "react"
import "./BlogSidebar.css"

const BlogSidebar = ({ recentPosts, onPostClick, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("")

  const handleSearch = (e) => {
    e.preventDefault()
    onSearch(searchTerm)
  }

  // Formatear fecha
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  }

  return (
    <aside className="blog-sidebar">
      <div className="sidebar-widget">
        <h3>Buscar</h3>
        <div className="search-widget">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Buscar en el blog..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit">
              <i className="fas fa-search"></i>
            </button>
          </form>
        </div>
      </div>
      <div className="sidebar-widget">
        <h3>Publicaciones recientes</h3>
        <ul className="recent-posts">
          {recentPosts.map((post) => (
            <li key={post.id}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  onPostClick(post.id)
                }}
              >
                {post.titulo}
              </a>
              <div className="post-date">{formatDate(post.fechaPublicacion)}</div>
            </li>
          ))}
        </ul>
      </div>
      <div className="sidebar-widget">
        <h3>Síguenos</h3>
        <div className="social-media">
          <a href="#" className="social-icon">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="#" className="social-icon">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="#" className="social-icon">
            <i className="fab fa-twitter"></i>
          </a>
        </div>
      </div>
    </aside>
  )
}

export default BlogSidebar
