import React from "react"

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="footer-content grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="footer-logo">
            <h2 className="text-xl font-bold mb-2">Café Inclusivo</h2>
            <p className="text-gray-300">
              Un espacio donde todos son bienvenidos. Café de calidad con propósito social.
            </p>
          </div>
          
          <div className="footer-links">
            <h3 className="text-lg font-semibold mb-4">Enlaces</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-white">Inicio</a></li>
              <li><a href="/productos" className="text-gray-300 hover:text-white">Productos</a></li>
              <li><a href="/publicaciones" className="text-gray-300 hover:text-white">Blog</a></li>
              <li><a href="/talleres" className="text-gray-300 hover:text-white">Talleres</a></li>
            </ul>
          </div>
          
          <div className="footer-newsletter">
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <form className="flex flex-col">
              <input 
                type="email" 
                placeholder="Tu email" 
                className="px-3 py-2 rounded mb-2 text-gray-800"
              />
              <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white">
                Suscribirse
              </button>
            </form>
          </div>
        </div>
        
        <div className="footer-bottom text-center pt-4 border-t border-gray-600">
          <p>&copy; 2024 Café Inclusivo. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer