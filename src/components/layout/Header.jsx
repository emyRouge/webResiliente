"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import "./Header.css"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const isActive = (path) => {
    return location.pathname === path ? "active" : ""
  }

  return (
    <header>
      <div className="container">
        <div className="logo">
          <h1>Resiliente</h1>
          <p>Cafetería Inclusiva</p>
        </div>
        <nav className={isMenuOpen ? "active" : ""}>
          <ul>
            <li>
              <Link to="/" className={isActive("/")} onClick={closeMenu}>
                Inicio
              </Link>
            </li>
            <li>
              <Link to="/productos" className={isActive("/productos")} onClick={closeMenu}>
                Productos
              </Link>
            </li>
            <li>
              <Link to="/publicaciones" className={isActive("/publicaciones")} onClick={closeMenu}>
                Blog
              </Link>
            </li>
            <li>
              <Link to="/talleres" className={isActive("/talleres")} onClick={closeMenu}>
                Talleres
              </Link>
            </li>
          </ul>
        </nav>
        <div className="menu-toggle" onClick={toggleMenu}>
          <i className="fas fa-bars"></i>
        </div>
      </div>
    </header>
  )
}

export default Header
