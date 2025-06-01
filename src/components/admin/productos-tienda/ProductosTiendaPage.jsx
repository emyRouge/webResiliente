"use client"

import { useState, useEffect } from "react"
import { useApi } from "../../../context/ApiContext"
import AlertContainer from "../common/AlertContainer"
import DeleteConfirmationModal from "../common/DeleteConfirmationModal"
import FormModal from "../common/FormModal"
import ProductoTiendaForm from "./ProductoTiendaForm"

const ProductosTiendaPage = () => {
  const [productosTienda, setProductosTienda] = useState([])
  const [selectedProductoTienda, setSelectedProductoTienda] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [alerts, setAlerts] = useState([])
  const { getProductosTienda, deleteProductoTienda } = useApi()

  useEffect(() => {
    loadProductosTienda()
  }, [])

  const loadProductosTienda = async () => {
    try {
      const response = await getProductosTienda()
      if (response?.success) {
        setProductosTienda(response.data)
      } else {
        addAlert(response?.message || "Error al cargar los productos de la tienda.", "danger")
      }
    } catch (error) {
      addAlert("Error al conectar con el servidor", "danger")
    }
  }

  const handleOpenModal = (productoTienda = null) => {
    setSelectedProductoTienda(productoTienda)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedProductoTienda(null)
  }

  const handleDelete = (productoTienda) => {
    setSelectedProductoTienda(productoTienda)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (selectedProductoTienda) {
      const response = await deleteProductoTienda(selectedProductoTienda.id)
      setIsDeleteModalOpen(false)
      if (response?.success) {
        addAlert("Producto de la tienda eliminado correctamente.", "success")
        loadProductosTienda()
      } else {
        addAlert(response?.message || "Error al eliminar el producto de la tienda.", "danger")
      }
    }
  }

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setSelectedProductoTienda(null)
  }

  const addAlert = (message, type) => {
    const id = Date.now()
    setAlerts((prevAlerts) => [...prevAlerts, { id, message, type }])
    setTimeout(() => {
      setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id))
    }, 5000)
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1 className="page-title">
          <i className="fas fa-shopping-bag mr-3"></i>
          Productos Tienda
        </h1>
        <button onClick={() => handleOpenModal()} className="btn btn-primary">
          <i className="fas fa-plus"></i>
          Nuevo Producto Tienda
        </button>
      </div>

      <AlertContainer alerts={alerts} />

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <i className="fas fa-list mr-2"></i>
            Lista de Productos Tienda ({productosTienda.length})
          </h2>
        </div>
        <div className="card-body p-0">
          {productosTienda.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-box-open"></i>
              <h3>No hay productos de tienda disponibles</h3>
              <p>Comienza agregando tu primer producto de tienda</p>
              <button onClick={() => handleOpenModal()} className="btn btn-primary">
                <i className="fas fa-plus mr-2"></i>
                Crear Primer Producto de Tienda
              </button>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Precio</th>
                    <th>Categoría</th>
                    <th>Imagen</th>
                    <th>Descuento</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productosTienda.map((productoTienda) => (
                    <tr key={productoTienda.id}>
                      <td>{productoTienda.id}</td>
                      <td>{productoTienda.nombre}</td>
                      <td>{productoTienda.descripcion}</td>
                      <td>${productoTienda.precio}</td>
                      <td>{productoTienda.categoria}</td>
                      <td>
                        {productoTienda.imagen && (
                          <img
                            src={productoTienda.imagen || "/placeholder.svg"}
                            alt={productoTienda.nombre}
                            className="image-preview"
                            style={{ width: "50px", height: "50px", objectFit: "cover" }}
                          />
                        )}
                      </td>
                      <td>{productoTienda.descuento}%</td>
                      <td>
                        <span className={`badge ${productoTienda.status ? "badge-success" : "badge-danger"}`}>
                          {productoTienda.status ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button
                            onClick={() => handleOpenModal(productoTienda)}
                            className="action-btn edit"
                            title="Editar producto"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            onClick={() => handleDelete(productoTienda)}
                            className="action-btn delete"
                            title="Eliminar producto"
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
        onClose={handleCloseModal}
        title={selectedProductoTienda ? "Editar Producto Tienda" : "Nuevo Producto Tienda"}
      >
        <ProductoTiendaForm
          productoTienda={selectedProductoTienda}
          onSave={(data) => {
            handleCloseModal()
            loadProductosTienda()
          }}
          onCancel={handleCloseModal}
        />
      </FormModal>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={confirmDelete}
        title="Confirmar Eliminación"
        message={`¿Estás seguro de que deseas eliminar el producto "${selectedProductoTienda?.nombre}"? Esta acción no se puede deshacer.`}
        itemName={selectedProductoTienda?.nombre}
      />
    </div>
  )
}

export default ProductosTiendaPage
