import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import { Suspense, lazy } from "react"
import { ApiProvider } from "./context/ApiContext"
import Layout from "./components/layout/Layout"
import LoadingSpinner from "./components/ui/LoadingSpinner"
import AdminPages from "./pages/AdminPages"

// Import styles
import "./styles/admin.css"

// Lazy loading de páginas para mejor rendimiento
const HomePage = lazy(() => import("./pages/HomePage"))
const ProductsPage = lazy(() => import("./pages/ProductsPage"))
const BlogPage = lazy(() => import("./pages/BlogPage"))
const WorkshopsPage = lazy(() => import("./pages/WorkshopsPage"))

function App() {
  return (
    <ApiProvider>
      <Router>
        <Suspense fallback={<LoadingSpinner />}>
          <div>
            {/* Link to Admin Panel */}
            <Link to="/admin">Admin Panel</Link>

            <Routes>
              {/* Admin routes */}
              <Route path="/admin/*" element={<AdminPages />} />

              {/* Public routes */}
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="/productos" element={<ProductsPage />} />
                <Route path="/publicaciones" element={<BlogPage />} />
                <Route path="/talleres" element={<WorkshopsPage />} />
              </Route>
            </Routes>
          </div>
        </Suspense>
      </Router>
    </ApiProvider>
  )
}

export default App
