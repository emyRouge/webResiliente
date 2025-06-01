import React, { Suspense, lazy } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ApiProvider } from "./context/ApiContext"
import Layout from "./components/layout/Layout"
import LoadingSpinner from "./components/ui/LoadingSpinner"

// Import styles
import "./styles/admin.css"

// Lazy loading de páginas para mejor rendimiento
const HomePage = lazy(() => import("./pages/HomePage"))
const ProductsPage = lazy(() => import("./pages/ProductsPage"))
const BlogPage = lazy(() => import("./pages/BlogPage"))
const WorkshopsPage = lazy(() => import("./pages/WorkshopsPage"))
const AdminPages = lazy(() => import("./pages/AdminPages"))

function App() {
  return (
    <ApiProvider>
      <Router>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Admin routes */}
            <Route path="/admin/*" element={<AdminPages />} />

            {/* Public routes */}
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/productos" element={<ProductsPage />} />
              <Route path="/publicaciones" element={<BlogPage />} />
              <Route path="/talleres" element={<WorkshopsPage />} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </ApiProvider>
  )
}

export default App