"use client"

import { useState, useEffect } from "react"
import AlertContainer from "../common/AlertContainer"
import DeleteConfirmationModal from "../common/DeleteConfirmationModal"
import FormModal from "../common/FormModal"
import ProductoTiendaForm from "./ProductoTiendaForm"

const ProductosTiendaPage = () => {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedProducto, setSelectedProducto] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [alerts, setAlerts] = useState([])
  const [modalMode, setModalMode] = useState("create") // "create", "edit", "view"
  const [searchTerm, setSearchTerm] = useState("")
  const [categoriaFilter, setCategoriaFilter] = useState("")

  useEffect(() => {
    fetchProductos()
  }, [])

  const fetchProductos = async (search = "", categoria = "") => {
    setLoading(true)
    try {
      let url = "http://localhost:8080/productos-tienda"

      if (search) {
        url = `http://localhost:8080/productos-tienda/buscar?nombre=${encodeURIComponent(search)}`
      } else if (categoria) {
        url = `http://localhost:8080/productos-tienda/categoria/${encodeURIComponent(categoria)}`
      }

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }
      const data = await response.json()
      setProductos(data.datos || [])
    } catch (error) {
      console.error("Error fetching productos:", error)
      addAlert(`Error al cargar productos: ${error.message}`, "danger")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProducto = () => {
    setSelectedProducto(null)
    setModalMode("create")
    setIsModalOpen(true)
  }

  const handleEditProducto = (producto) => {
    setSelectedProducto(producto)
    setModalMode("edit")
    setIsModalOpen(true)
  }

  const handleViewProducto = (producto) => {
    setSelectedProducto(producto)
    setModalMode("view")
    setIsModalOpen(true)
  }

  const handleDeleteProducto = (producto) => {
    setSelectedProducto(producto)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8080/productos-tienda/${selectedProducto.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      setProductos(productos.filter((p) => p.id !== selectedProducto.id))
      addAlert("Producto eliminado exitosamente", "success")
    } catch (error) {
      console.error("Error deleting producto:", error)
      addAlert(`Error al eliminar producto: ${error.message}`, "danger")
    } finally {
      setIsDeleteModalOpen(false)
    }
  }

  const handleSaveProducto = async (productoData) => {
    try {
      let url = "http://localhost:8080/productos-tienda"
      let method = "POST"

      if (modalMode === "edit") {
        url += `/${selectedProducto.id}`
        method = "PUT"
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productoData),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      fetchProductos(searchTerm, categoriaFilter)
      setIsModalOpen(false)
      addAlert(modalMode === "create" ? "Producto creado exitosamente" : "Producto actualizado exitosamente", "success")
    } catch (error) {
      console.error("Error saving producto:", error)
      addAlert(`Error al guardar producto: ${error.message}`, "danger")
    }
  }

  const handleSearch = () => {
    setCategoriaFilter("")
    fetchProductos(searchTerm, "")
  }

  const handleCategoriaChange = (e) => {
    const categoria = e.target.value
    setCategoriaFilter(categoria)
    setSearchTerm("")
    fetchProductos("", categoria)
  }

  const handleRefresh = () => {
    setSearchTerm("")
    setCategoriaFilter("")
    fetchProductos()
  }

  const addAlert = (message, type) => {
    const id = Date.now()
    setAlerts((prevAlerts) => [...prevAlerts, { id, message, type }])
    setTimeout(() => {
      setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id))
    }, 5000)
  }

  const formatPrice = (price, discount = 0) => {
    const finalPrice = price - (price * discount) / 100
    return `$${Number.parseFloat(finalPrice).toFixed(2)}`
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Productos Tienda</h1>
        <button onClick={handleCreateProducto} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
          <i className="fas fa-plus mr-2"></i> Nuevo Producto
        </button>
      </div>

      <AlertContainer alerts={alerts} />

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Lista de Productos</h2>
          <div className="flex items-center space-x-2">
            <div className="flex">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar productos..."
                className="rounded-l border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
              <button onClick={handleSearch} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-r">
                <i className="fas fa-search"></i>
              </button>
            </div>
            <select
              value={categoriaFilter}
              onChange={handleCategoriaChange}
              className="rounded border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Todas las categorías</option>
              <option value="ropa">Ropa</option>
              <option value="accesorios">Accesorios</option>
              <option value="decoracion">Decoración</option>
              <option value="libros">Libros</option>
              <option value="otros">Otros</option>
            </select>
            <button onClick={handleRefresh} className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded">
              <i className="fas fa-sync-alt mr-2"></i> Actualizar
            </button>
          </div>
        </div>
        <div className="p-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4">Cargando productos...</p>
            </div>
          ) : productos.length === 0 ? (
            <div className="text-center py-8">
              <i className="fas fa-shopping-bag text-4xl text-gray-300 mb-4"></i>
              <p>No hay productos disponibles</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Imagen
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoría
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Precio
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {productos.map((producto) => (
                    <tr key={producto.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {producto.imagen ? (
                          <img
                            src={
                              producto.imagen.startsWith("http")
                                ? producto.imagen
                                : `data:image/jpeg;base64,${producto.imagen}`
                            }
                            alt={producto.nombre}
                            className="h-12 w-12 object-cover rounded"
                          />
                        ) : (
                          <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center">
                            <i className="fas fa-image text-gray-400"></i>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{producto.nombre}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{producto.categoria || "Sin categoría"}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {producto.descuento && producto.descuento > 0 ? (
                          <div>
                            <span className="font-bold text-green-600">
                              {formatPrice(producto.precio, producto.descuento)}
                            </span>
                            <br />
                            <span className="text-sm line-through text-gray-500">
                              ${Number.parseFloat(producto.precio).toFixed(2)}
                            </span>
                            <span className="text-sm text-red-500 ml-1">(-{producto.descuento}%)</span>
                          </div>
                        ) : (
                          <span className="font-bold">${Number.parseFloat(producto.precio).toFixed(2)}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {producto.status ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Activo
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Inactivo
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewProducto(producto)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          <button
                            onClick={() => handleEditProducto(producto)}
                            className="text-yellow-600 hover:text-yellow-900"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            onClick={() => handleDeleteProducto(producto)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === "create" ? "Nuevo Producto" : modalMode === "edit" ? "Editar Producto" : "Ver Producto"}
      >
        <ProductoTiendaForm producto={selectedProducto} onSave={handleSaveProducto} readOnly={modalMode === "view"} />
      </FormModal>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmar Eliminación"
        message="¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer."
      />
    </div>
  )
}

export default ProductosTiendaPage
