"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import LoginModal from "../auth/LoginModal"

const Header = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              Resiliente
            </Link>
          </div>

          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="text-gray-700 hover:text-blue-600">
              Inicio
            </Link>
            <Link to="/productos" className="text-gray-700 hover:text-blue-600">
              Productos
            </Link>
            <Link to="/publicaciones" className="text-gray-700 hover:text-blue-600">
              Blog
            </Link>
            <Link to="/talleres" className="text-gray-700 hover:text-blue-600">
              Talleres
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Solo para empleados
            </button>
          </div>
        </div>
      </div>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </header>
  )
}

export default Header
