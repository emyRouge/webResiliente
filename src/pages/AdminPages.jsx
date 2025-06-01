import React, { Suspense, lazy } from "react"
import { Route, Routes } from "react-router-dom"
import AdminLayout from "../components/layout/AdminLayout"
import LoadingSpinner from "../components/ui/LoadingSpinner"

// Lazy loading de páginas
const CandidatosPage = lazy(() => import("../components/admin/candidatos/CandidatosPage"))
const CondicionesPage = lazy(() => import("../components/admin/condiciones/CondicionesPage"))
const MeserosPage = lazy(() => import("../components/admin/meseros/MeserosPage"))
const ProductosPage = lazy(() => import("../components/admin/productos/ProductosPage"))
const ProductosTiendaPage = lazy(() => import("../components/admin/productos-tienda/ProductosTiendaPage"))
const PublicacionesPage = lazy(() => import("../components/admin/publicaciones/PublicacionesPage"))
const SenasPage = lazy(() => import("../components/admin/senas/SenasPage"))
const UsuariosPage = lazy(() => import("../components/admin/usuarios/UsuariosPage"))
const TalleresPage = lazy(() => import("../components/admin/talleres/TalleresPage"))

// Dashboard simple
const Dashboard = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-blue-500 text-white">
            <i className="fas fa-mug-hot text-xl"></i>
          </div>
          <div className="ml-4">
            <h2 className="text-sm font-medium text-gray-600">Productos</h2>
            <p className="text-2xl font-bold text-gray-900">24</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-500 text-white">
            <i className="fas fa-users text-xl"></i>
          </div>
          <div className="ml-4">
            <h2 className="text-sm font-medium text-gray-600">Usuarios</h2>
            <p className="text-2xl font-bold text-gray-900">156</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-yellow-500 text-white">
            <i className="fas fa-newspaper text-xl"></i>
          </div>
          <div className="ml-4">
            <h2 className="text-sm font-medium text-gray-600">Publicaciones</h2>
            <p className="text-2xl font-bold text-gray-900">42</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-purple-500 text-white">
            <i className="fas fa-chalkboard-teacher text-xl"></i>
          </div>
          <div className="ml-4">
            <h2 className="text-sm font-medium text-gray-600">Talleres</h2>
            <p className="text-2xl font-bold text-gray-900">8</p>
          </div>
        </div>
      </div>
    </div>
  </div>
)

const AdminPages = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />

        <Route path="productos" element={
          <Suspense fallback={<LoadingSpinner />}>
            <ProductosPage />
          </Suspense>
        }/>

        <Route path="senas" element={
          <Suspense fallback={<LoadingSpinner />}>
            <SenasPage />
          </Suspense>
        }/>

        <Route path="meseros" element={
          <Suspense fallback={<LoadingSpinner />}>
            <MeserosPage />
          </Suspense>
        }/>

        <Route path="productos-tienda" element={
          <Suspense fallback={<LoadingSpinner />}>
            <ProductosTiendaPage />
          </Suspense>
        }/>

        <Route path="publicaciones" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PublicacionesPage />
          </Suspense>
        }/>

        <Route path="candidatos" element={
          <Suspense fallback={<LoadingSpinner />}>
            <CandidatosPage />
          </Suspense>
        }/>

        <Route path="condiciones" element={
          <Suspense fallback={<LoadingSpinner />}>
            <CondicionesPage />
          </Suspense>
        }/>

        <Route path="usuarios" element={
          <Suspense fallback={<LoadingSpinner />}>
            <UsuariosPage />
          </Suspense>
        }/>

        <Route path="talleres" element={
          <Suspense fallback={<LoadingSpinner />}>
            <TalleresPage />
          </Suspense>
        }/>

      </Route>
    </Routes>
  )
}

export default AdminPages
