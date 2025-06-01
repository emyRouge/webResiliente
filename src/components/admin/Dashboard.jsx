"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useApi } from "../../context/ApiContext"

const Dashboard = () => {
  const [stats, setStats] = useState({
    productCount: null,
    senaCount: null,
    meseroCount: null,
    productoTiendaCount: null,
    usuarioCount: null,
    condicionCount: null,
    tallerCount: null,
    publicacionCount: null,
  })
  const [error, setError] = useState("")
  const api = useApi()

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const [
        productResponse,
        senaResponse,
        meseroResponse,
        productoTiendaResponse,
        usuarioResponse,
        condicionResponse,
        tallerResponse,
        publicacionResponse,
      ] = await Promise.all([
        api.getProducts(),
        api.getSenas(),
        api.getMeseros(),
        api.getProductosTienda(),
        api.getUsuarios(),
        api.getCondiciones(),
        api.getWorkshops(),
        api.getPosts(),
      ])

      setStats({
        productCount: productResponse?.success ? productResponse.data.length : 0,
        senaCount: senaResponse?.success ? senaResponse.data.length : 0,
        meseroCount: meseroResponse?.success ? meseroResponse.data.length : 0,
        productoTiendaCount: productoTiendaResponse?.success ? productoTiendaResponse.data.length : 0,
        usuarioCount: usuarioResponse?.success ? usuarioResponse.data.length : 0,
        condicionCount: condicionResponse?.success ? condicionResponse.data.length : 0,
        tallerCount: tallerResponse?.success ? tallerResponse.data.length : 0,
        publicacionCount: publicacionResponse?.success ? publicacionResponse.data.length : 0,
      })
      setError("")
    } catch (e) {
      console.error("Error loading stats:", e)
      setError("Error al cargar estadísticas. Verifique la conexión con el servidor.")
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted">Panel de administración de Café Inclusivo</p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Productos</h3>
                <p className="text-3xl font-bold">{stats.productCount !== null ? stats.productCount : "..."}</p>
              </div>
              <div className="text-primary text-3xl">
                <i className="fas fa-mug-hot"></i>
              </div>
            </div>
            <div className="mt-4">
              <Link to="/admin/productos" className="text-primary hover:underline">
                Gestionar Productos
              </Link>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Señas</h3>
                <p className="text-3xl font-bold">{stats.senaCount !== null ? stats.senaCount : "..."}</p>
              </div>
              <div className="text-success text-3xl">
                <i className="fas fa-hands"></i>
              </div>
            </div>
            <div className="mt-4">
              <Link to="/admin/senas" className="text-success hover:underline">
                Gestionar Señas
              </Link>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Meseros</h3>
                <p className="text-3xl font-bold">{stats.meseroCount !== null ? stats.meseroCount : "..."}</p>
              </div>
              <div className="text-info text-3xl">
                <i className="fas fa-user"></i>
              </div>
            </div>
            <div className="mt-4">
              <Link to="/admin/meseros" className="text-info hover:underline">
                Gestionar Meseros
              </Link>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Productos Tienda</h3>
                <p className="text-3xl font-bold">
                  {stats.productoTiendaCount !== null ? stats.productoTiendaCount : "..."}
                </p>
              </div>
              <div className="text-warning text-3xl">
                <i className="fas fa-shopping-bag"></i>
              </div>
            </div>
            <div className="mt-4">
              <Link to="/admin/productos-tienda" className="text-warning hover:underline">
                Gestionar Tienda
              </Link>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Usuarios</h3>
                <p className="text-3xl font-bold">{stats.usuarioCount !== null ? stats.usuarioCount : "..."}</p>
              </div>
              <div className="text-danger text-3xl">
                <i className="fas fa-users"></i>
              </div>
            </div>
            <div className="mt-4">
              <Link to="/admin/usuarios" className="text-danger hover:underline">
                Gestionar Usuarios
              </Link>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Condiciones</h3>
                <p className="text-3xl font-bold">{stats.condicionCount !== null ? stats.condicionCount : "..."}</p>
              </div>
              <div className="text-secondary text-3xl">
                <i className="fas fa-list-check"></i>
              </div>
            </div>
            <div className="mt-4">
              <Link to="/admin/condiciones" className="text-secondary hover:underline">
                Gestionar Condiciones
              </Link>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Talleres</h3>
                <p className="text-3xl font-bold">{stats.tallerCount !== null ? stats.tallerCount : "..."}</p>
              </div>
              <div className="text-info text-3xl">
                <i className="fas fa-chalkboard-teacher"></i>
              </div>
            </div>
            <div className="mt-4">
              <Link to="/admin/talleres" className="text-info hover:underline">
                Gestionar Talleres
              </Link>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Publicaciones</h3>
                <p className="text-3xl font-bold">{stats.publicacionCount !== null ? stats.publicacionCount : "..."}</p>
              </div>
              <div className="text-primary text-3xl">
                <i className="fas fa-newspaper"></i>
              </div>
            </div>
            <div className="mt-4">
              <Link to="/admin/publicaciones" className="text-primary hover:underline">
                Gestionar Publicaciones
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
