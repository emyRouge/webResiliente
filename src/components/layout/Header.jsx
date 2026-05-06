import { useState, useEffect } from "react"
import { NavLink } from "react-router-dom"
import LoginModal from "../auth/LoginModal"
import "./Header.css"

const Header = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const closeMenu = () => setMenuOpen(false)

  const navClass = ({ isActive }) => isActive ? "nav-link active" : "nav-link"

  return (
    <>
      <header className={`site-header${scrolled ? " scrolled" : ""}`}>
        <div className="container">
          <div className="header-inner">
            <NavLink to="/" className="header-logo" onClick={closeMenu}>
              <span className="logo-main">Resiliente</span>
              <span className="logo-sub">Café Inclusivo</span>
            </NavLink>

            <nav className={`header-nav${menuOpen ? " open" : ""}`}>
              <NavLink to="/" end className={navClass} onClick={closeMenu}>Inicio</NavLink>
              <NavLink to="/productos" className={navClass} onClick={closeMenu}>Productos</NavLink>
              <NavLink to="/publicaciones" className={navClass} onClick={closeMenu}>Blog</NavLink>
              <NavLink to="/talleres" className={navClass} onClick={closeMenu}>Talleres</NavLink>
              <button
                className="btn-empleados mobile-only"
                onClick={() => { closeMenu(); setIsLoginModalOpen(true) }}
              >
                Solo para empleados
              </button>
            </nav>

            <div className="header-actions">
              <button
                className="btn-empleados desktop-only"
                onClick={() => setIsLoginModalOpen(true)}
              >
                Solo para empleados
              </button>
              <button
                className={`menu-toggle${menuOpen ? " open" : ""}`}
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              >
                <span></span>
                <span></span>
                <span></span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {menuOpen && <div className="menu-overlay" onClick={closeMenu} />}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  )
}

export default Header
