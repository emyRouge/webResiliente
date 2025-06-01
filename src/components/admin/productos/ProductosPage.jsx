"use client"

import { useState, useEffect } from "react"
import { useApi } from "../../../context/ApiContext"
import AlertContainer from "../common/AlertContainer"
import DeleteConfirmationModal from "../common/DeleteConfirmationModal"
import ProductoForm from "./ProductoForm"
import FormModal from "../common/FormModal"

const ProductosPage = () => {
  const { getProducts, createProduct, updateProduct, deleteProduct } = useApi()
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedProducto, setSelectedProducto] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [alerts, setAlerts] = useState([])
  const [modalMode, setModalMode] = useState("create")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  useEffect(() => {
    fetchProductos()
  }, [])

  const fetchProductos = async () => {
    setLoading(true)
    try {
      const result = await getProducts()
      if (result.success) {
        setProductos(result.data || [])
      } else {
        addAlert(result.message, "danger")
      }
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
      const result = await deleteProduct(selectedProducto.id)
      if (result.success) {
        setProductos(productos.filter((p) => p.id !== selectedProducto.id))
        addAlert("Producto eliminado exitosamente", "success")
      } else {
        addAlert(result.message, "danger")
      }
    } catch (error) {
      console.error("Error deleting producto:", error)
      addAlert(`Error al eliminar producto: ${error.message}`, "danger")
    } finally {
      setIsDeleteModalOpen(false)
    }
  }

  const handleSaveProducto = async (productoData) => {
    if (!productoData) {
      setIsModalOpen(false)
      return
    }

    try {
      let result
      if (modalMode === "create") {
        result = await createProduct(productoData)
      } else {
        result = await updateProduct(selectedProducto.id, productoData)
      }

      if (result.success) {
        fetchProductos()
        setIsModalOpen(false)
        addAlert(
          modalMode === "create" ? "Producto creado exitosamente" : "Producto actualizado exitosamente",
          "success",
        )
      } else {
        addAlert(result.message, "danger")
      }
    } catch (error) {
      console.error("Error saving producto:", error)
      addAlert(`Error al guardar producto: ${error.message}`, "danger")
    }
  }

  const addAlert = (message, type) => {
    const id = Date.now()
    setAlerts((prevAlerts) => [...prevAlerts, { id, message, type }])
    setTimeout(() => {
      setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id))
    }, 5000)
  }

  const formatPrice = (price) => {
    return `$${Number.parseFloat(price).toFixed(2)}`
  }

  // Filtrar productos
  const filteredProductos = productos.filter((producto) => {
    const matchesSearch =
      producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (producto.categoria && producto.categoria.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && producto.status) ||
      (filterStatus === "inactive" && !producto.status)

    return matchesSearch && matchesStatus
  })

  return (
    <div className="admin-page">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">
          <i className="fas fa-mug-hot mr-3"></i>
          Gestión de Productos
        </h1>
        <button onClick={handleCreateProducto} className="btn btn-primary">
          <i className="fas fa-plus"></i>
          Nuevo Producto
        </button>
      </div>

      <AlertContainer alerts={alerts} />

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label">Buscar productos</label>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Buscar por nombre, código o categoría..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button className="btn btn-secondary">
                    <i className="fas fa-search"></i>
                  </button>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-group">
                <label className="form-label">Estado</label>
                <select className="form-control" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                  <option value="all">Todos</option>
                  <option value="active">Activos</option>
                  <option value="inactive">Inactivos</option>
                </select>
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-group">
                <label className="form-label">&nbsp;</label>
                <button onClick={fetchProductos} className="btn btn-secondary w-100">
                  <i className="fas fa-sync-alt"></i>
                  Actualizar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <i className="fas fa-list mr-2"></i>
            Lista de Productos ({filteredProductos.length})
          </h2>
        </div>
        <div className="card-body p-0">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p className="loading-text">Cargando productos...</p>
            </div>
          ) : filteredProductos.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-box-open"></i>
              <h3>No hay productos disponibles</h3>
              <p>
                {searchTerm || filterStatus !== "all"
                  ? "No se encontraron productos con los filtros aplicados"
                  : "Comienza agregando tu primer producto"}
              </p>
              {!searchTerm && filterStatus === "all" && (
                <button onClick={handleCreateProducto} className="btn btn-primary">
                  <i className="fas fa-plus mr-2"></i>
                  Crear Primer Producto
                </button>
              )}
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Imagen</th>
                    <th>Información</th>
                    <th>Precio</th>
                    <th>Categoría</th>
                    <th>Seña</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProductos.map((producto) => (
                    <tr key={producto.id}>
                      <td>
                        {producto.foto ? (
                          <img
                            src={
                              producto.foto.startsWith("http")
                                ? producto.foto
                                : `data:image/jpeg;base64,${producto.foto}`
                            }
                            alt={producto.nombre}
                            className="image-preview"
                          />
                        ) : (
                          <div className="image-placeholder">
                            <i className="fas fa-image"></i>
                          </div>
                        )}
                      </td>
                      <td>
                        <div>
                          <div className="font-weight-bold">{producto.nombre}</div>
                          <div className="text-muted small">Código: {producto.codigo}</div>
                          <div className="text-muted small description-preview">{producto.descripcion}</div>
                        </div>
                      </td>
                      <td>
                        <span className="font-weight-bold text-success">{formatPrice(producto.precio)}</span>
                      </td>
                      <td>
                        <span className="badge badge-info">{producto.categoria || "Sin categoría"}</span>
                      </td>
                      <td>
                        {producto.sena ? (
                          <div className="sena-link">
                            <span className="sena-name">{producto.sena.nombre}</span>
                            {producto.sena.video && (
                              <a
                                href={producto.sena.video}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="video-link"
                                title="Ver video de la seña"
                              >
                                <i className="fas fa-play-circle"></i>
                              </a>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted">Sin seña</span>
                        )}
                      </td>
                      <td>
                        {producto.status ? (
                          <span className="badge badge-success">
                            <i className="fas fa-check mr-1"></i>
                            Activo
                          </span>
                        ) : (
                          <span className="badge badge-danger">
                            <i className="fas fa-times mr-1"></i>
                            Inactivo
                          </span>
                        )}
                      </td>
                      <td>
                        <div className="table-actions">
                          <button
                            onClick={() => handleViewProducto(producto)}
                            className="action-btn view"
                            title="Ver producto"
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          <button
                            onClick={() => handleEditProducto(producto)}
                            className="action-btn edit"
                            title="Editar producto"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            onClick={() => handleDeleteProducto(producto)}
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

      {/* Modals */}
      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === "create" ? "Nuevo Producto" : modalMode === "edit" ? "Editar Producto" : "Ver Producto"}
        size="lg"
      >
        <ProductoForm producto={selectedProducto} onSave={handleSaveProducto} readOnly={modalMode === "view"} />
      </FormModal>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmar Eliminación"
        message={`¿Estás seguro de que deseas eliminar el producto "${selectedProducto?.nombre}"? Esta acción no se puede deshacer.`}
        itemName={selectedProducto?.nombre}
      />
    </div>
  )
}

export default ProductosPage
