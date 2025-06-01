import React from "react"
import { Link, Outlet, useLocation } from "react-router-dom"
import AlertContainer from "../admin/common/AlertContainer"

const AdminLayout = () => {
  const location = useLocation()

  // Helper to check if a path is active
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`)
  }

  return (
    <div className="admin-layout">
      <div className="sidebar">
        <div className="sidebar-header">
          <h1>Café Inclusivo</h1>
          <p>Panel de Administración</p>
        </div>

        <ul className="sidebar-menu">
          <li>
            <Link to="/admin" className={isActive("/admin") && !location.pathname.includes("/admin/") ? "active" : ""}>
              <i className="fas fa-tachometer-alt"></i> Dashboard
            </Link>
          </li>

          <div className="sidebar-category">CAFETERÍA</div>
          <li>
            <Link to="/admin/productos" className={isActive("/admin/productos") ? "active" : ""}>
              <i className="fas fa-mug-hot"></i> Productos
            </Link>
          </li>
          <li>
            <Link to="/admin/senas" className={isActive("/admin/senas") ? "active" : ""}>
              <i className="fas fa-sign-language"></i> Señas
            </Link>
          </li>
         

          <div className="sidebar-category">TIENDA</div>
          <li>
            <Link to="/admin/productos-tienda" className={isActive("/admin/productos-tienda") ? "active" : ""}>
              <i className="fas fa-shopping-bag"></i> Productos Tienda
            </Link>
          </li>

          <div className="sidebar-category">PERSONAL</div>
          <li>
            <Link to="/admin/usuarios" className={isActive("/admin/usuarios") ? "active" : ""}>
              <i className="fas fa-users"></i> Usuarios
            </Link>
          </li>
          <li>
            <Link to="/admin/meseros" className={isActive("/admin/meseros") ? "active" : ""}>
              <i className="fas fa-user-tie"></i> Meseros
            </Link>
          </li>
          <li>
            <Link to="/admin/condiciones" className={isActive("/admin/condiciones") ? "active" : ""}>
              <i className="fas fa-wheelchair"></i> Condiciones
            </Link>
          </li>
          <li>
            <Link to="/admin/candidatos" className={isActive("/admin/candidatos") ? "active" : ""}>
              <i className="fas fa-user-plus"></i> Candidatos
            </Link>
          </li>

          <div className="sidebar-category">CONTENIDO</div>
          <li>
            <Link to="/admin/publicaciones" className={isActive("/admin/publicaciones") ? "active" : ""}>
              <i className="fas fa-newspaper"></i> Publicaciones
            </Link>
          </li>
          <li>
            <Link to="/admin/talleres" className={isActive("/admin/talleres") ? "active" : ""}>
              <i className="fas fa-chalkboard-teacher"></i> Talleres
            </Link>
          </li>

          <div className="sidebar-category">SISTEMA</div>
          <li>
            <Link to="/" className={isActive("/") ? "active" : ""}>
              <i className="fas fa-store"></i> Ver Tienda
            </Link>
          </li>
        </ul>
      </div>

      <div className="main-content">
        <AlertContainer />
        <Outlet />
      </div>
    </div>
  )
}

export default AdminLayout