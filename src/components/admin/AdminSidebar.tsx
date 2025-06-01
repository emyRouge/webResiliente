import React, { useState, useEffect } from "react"
import { Home, Users, ShoppingBag, Newspaper, ListChecks, ChevronLeft, ChevronRight, Menu } from 'lucide-react'
import { useLocation, Link } from 'react-router-dom'

// Icono personalizado para Señas
const HandsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"></path>
    <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"></path>
    <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"></path>
    <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"></path>
  </svg>
)

// Icono personalizado para Talleres
const ChalkboardTeacherIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="14" x="3" y="3" rx="2"></rect>
    <path d="M12 17v4"></path>
    <path d="M8 21h8"></path>
  </svg>
)

const navigationItems = [
  {
    href: "/admin/dashboard",
    label: "Dashboard",
    icon: Home,
  },
  {
    href: "/admin/productos",
    label: "Productos",
    icon: ShoppingBag,
  },
  {
    href: "/admin/senas",
    label: "Señas",
    icon: HandsIcon,
  },
  {
    href: "/admin/meseros",
    label: "Meseros",
    icon: Users,
  },
  {
    href: "/admin/productos-tienda",
    label: "Productos Tienda",
    icon: ShoppingBag,
  },
  {
    href: "/admin/usuarios",
    label: "Usuarios",
    icon: Users,
  },
  {
    href: "/admin/condiciones",
    label: "Condiciones",
    icon: ListChecks,
  },
  {
    href: "/admin/talleres",
    label: "Talleres",
    icon: ChalkboardTeacherIcon,
  },
  {
    href: "/admin/publicaciones",
    label: "Publicaciones",
    icon: Newspaper,
  },
]

export function AdminSidebar() {
  const location = useLocation()
  const pathname = location.pathname
  const [isExpanded, setIsExpanded] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  // Detectar si es dispositivo móvil
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setIsExpanded(false)
      }
    }
    
    checkIfMobile()
    window.addEventListener('resize', checkIfMobile)
    
    return () => {
      window.removeEventListener('resize', checkIfMobile)
    }
  }, [])

  // Función para alternar el estado del sidebar
  const toggleSidebar = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen)
    } else {
      setIsExpanded(!isExpanded)
    }
  }

  // Cerrar sidebar en móvil al hacer clic en un enlace
  const handleLinkClick = () => {
    if (isMobile) {
      setMobileOpen(false)
    }
  }

  return (
    <>
      {/* Botón de hamburguesa para móvil */}
      {isMobile && (
        <button 
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md"
          aria-label="Abrir menú"
        >
          <Menu size={24} />
        </button>
      )}

      {/* Overlay para móvil */}
      {isMobile && mobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`
          ${isMobile 
            ? `fixed inset-y-0 left-0 z-50 transform ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`
            : `relative transform ${isExpanded ? 'w-64' : 'w-20'}`
          }
          bg-white border-r border-gray-200 h-full transition-all duration-300 ease-in-out
        `}
      >
        {/* Botón para expandir/contraer en desktop */}
        {!isMobile && (
          <button
            onClick={toggleSidebar}
            className="absolute -right-3 top-10 bg-white border border-gray-200 rounded-full p-1 shadow-md z-10"
            aria-label={isExpanded ? 'Contraer sidebar' : 'Expandir sidebar'}
          >
            {isExpanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        )}

        <div className="p-4">
          <div className="mb-6">
            <h3 className={`text-sm font-medium text-gray-500 mb-2 ${!isExpanded && !isMobile ? 'text-center' : ''}`}>
              {isExpanded || isMobile ? 'Administración' : 'Admin'}
            </h3>
            <div>
              <ul className="space-y-1">
                {navigationItems.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.href}
                      className={`
                        flex items-center gap-2 p-2 rounded-md hover:bg-gray-100
                        ${pathname === item.href ? "font-medium bg-gray-100" : "text-gray-600"}
                        ${!isExpanded && !isMobile ? 'justify-center' : ''}
                      `}
                      onClick={handleLinkClick}
                    >
                      {React.createElement(item.icon, { className: "h-5 w-5" })}
                      {(isExpanded || isMobile) && <span>{item.label}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        <div className={`border-t border-gray-200 p-4 ${!isExpanded && !isMobile ? 'text-center' : ''}`}>
          <p className="text-gray-500 text-xs">
            {isExpanded || isMobile ? 'Café Inclusivo © 2024' : '© 2024'}
          </p>
        </div>
      </div>
    </>
  )
}

export default AdminSidebar