import { Routes, Route } from "react-router-dom"
import AdminLayout from "../components/layout/AdminLayout"
import Dashboard from "../components/admin/Dashboard"
import CandidatosPage from "../components/admin/candidatos/CandidatosPage"
import CondicionesPage from "../components/admin/condiciones/CondicionesPage"
import SenasPage from "../components/admin/senas/SenasPage"
import ProductosPage from "../components/admin/productos/ProductosPage"
import MeserosPage from "../components/admin/meseros/MeserosPage"
import PublicacionesPage from "../components/admin/publicaciones/PublicacionesPage"
import ProductosTiendaPage from "../components/admin/productos-tienda/ProductosTiendaPage"

const AdminPages = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="candidatos" element={<CandidatosPage />} />
        <Route path="condiciones" element={<CondicionesPage />} />
        <Route path="senas" element={<SenasPage />} />
        <Route path="productos" element={<ProductosPage />} />
        <Route path="meseros" element={<MeserosPage />} />
        <Route path="publicaciones" element={<PublicacionesPage />} />
        <Route path="productos-tienda" element={<ProductosTiendaPage />} />
      </Route>
    </Routes>
  )
}

export default AdminPages
