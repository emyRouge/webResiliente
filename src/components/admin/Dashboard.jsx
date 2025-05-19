"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { showAlert } from "./common/AlertContainer"

const Dashboard = () => {
  const [stats, setStats] = useState({
    productCount: "Cargando...",
    senaCount: "Cargando...",
    meseroCount: "Cargando...",
    productoTiendaCount: "Cargando...",
  })

  const [currentDate, setCurrentDate] = useState("")

  useEffect(() => {
    // Set current date
    const now = new Date()
    setCurrentDate(
      now.toLocaleDateString("es-ES", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    )

    // Load stats
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      // Load product count
      const productResponse = await fetch("http://localhost:8080/productos")
      if (productResponse.ok) {
        const productData = await productResponse.json()
        setStats((prev) => ({
          ...prev,
          productCount: productData.datos ? productData.datos.length : 0,
        }))
      } else {
        setStats((prev) => ({ ...prev, productCount: "Error" }))
      }

      // Load senas count
      const senaResponse = await fetch("http://localhost:8080/senas")
      if (senaResponse.ok) {
        const senaData = await senaResponse.json()
        setStats((prev) => ({
          ...prev,
          senaCount: senaData.datos ? senaData.datos.length : 0,
        }))
      } else {
        setStats((prev) => ({ ...prev, senaCount: "Error" }))
      }

      // Load meseros count
      const meseroResponse = await fetch("http://localhost:8080/meseros")
      if (meseroResponse.ok) {
        const meseroData = await meseroResponse.json()
        setStats((prev) => ({
          ...prev,
          meseroCount: meseroData.datos ? meseroData.datos.length : 0,
        }))
      } else {
        setStats((prev) => ({ ...prev, meseroCount: "Error" }))
      }

      // Load productos tienda count
      const productoTiendaResponse = await fetch("http://localhost:8080/productos-tienda")
      if (productoTiendaResponse.ok) {
        const productoTiendaData = await productoTiendaResponse.json()
        setStats((prev) => ({
          ...prev,
          productoTiendaCount: productoTiendaData.datos ? productoTiendaData.datos.length : 0,
        }))
      } else {
        setStats((prev) => ({ ...prev, productoTiendaCount: "Error" }))
      }
    } catch (error) {
      console.error("Error al cargar estadísticas:", error)
      showAlert("Error al cargar estadísticas. Verifique la conexión con el servidor.", "danger")

      setStats({
        productCount: "Error",
        senaCount: "Error",
        meseroCount: "Error",
        productoTiendaCount: "Error",
      })
    }
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <div className="date-time">
          <i className="far fa-calendar-alt"></i>
          <span id="currentDate">{currentDate}</span>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-mug-hot"></i>
          </div>
          <div className="stat-info">
            <h3>Productos</h3>
            <p>{stats.productCount}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-sign-language"></i>
          </div>
          <div className="stat-info">
            <h3>Señas</h3>
            <p>{stats.senaCount}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-user-tie"></i>
          </div>
          <div className="stat-info">
            <h3>Meseros</h3>
            <p>{stats.meseroCount}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-shopping-bag"></i>
          </div>
          <div className="stat-info">
            <h3>Productos Tienda</h3>
            <p>{stats.productoTiendaCount}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-row">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Actividad Reciente</h2>
          </div>
          <div className="card-body">
            <div className="activity-list" id="activityList">
              <div className="activity-item">
                <div className="activity-icon">
                  <i className="fas fa-plus-circle"></i>
                </div>
                <div className="activity-details">
                  <p className="activity-text">Bienvenido al panel de administración de Café Inclusivo</p>
                  <p className="activity-time">Ahora</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Accesos Rápidos</h2>
          </div>
          <div className="card-body">
            <div className="quick-links">
              <Link to="/admin/productos" className="quick-link">
                <i className="fas fa-mug-hot"></i>
                <span>Gestionar Productos</span>
              </Link>
              <Link to="/admin/senas" className="quick-link">
                <i className="fas fa-sign-language"></i>
                <span>Gestionar Señas</span>
              </Link>
              <Link to="/admin/indicaciones" className="quick-link">
                <i className="fas fa-hands-helping"></i>
                <span>Gestionar Indicaciones</span>
              </Link>
              <Link to="/admin/meseros" className="quick-link">
                <i className="fas fa-user-tie"></i>
                <span>Gestionar Meseros</span>
              </Link>
              <Link to="/admin/productos-tienda" className="quick-link">
                <i className="fas fa-shopping-bag"></i>
                <span>Gestionar Tienda</span>
              </Link>
              <Link to="/" className="quick-link">
                <i className="fas fa-store"></i>
                <span>Ver Tienda</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard
