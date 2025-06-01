"use client"

import { useState, useEffect } from "react"
import { useApi } from "../../../context/ApiContext"
import AlertContainer from "../common/AlertContainer"
import DeleteConfirmationModal from "../common/DeleteConfirmationModal"
import FormModal from "../common/FormModal"
import PublicacionForm from "./PublicacionForm"

const PublicacionesPage = () => {
  const [publicaciones, setPublicaciones] = useState([])
  const [selectedPublicacion, setSelectedPublicacion] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(false)
  const { getPosts, deletePost } = useApi()

  useEffect(() => {
    loadPublicaciones()
  }, [])

  const loadPublicaciones = async () => {
    setLoading(true)
    try {
      const response = await getPosts()
      if (response?.success) {
        setPublicaciones(response.data || [])
      } else {
        addAlert(response?.message || "Error al cargar las publicaciones.", "danger")
      }
    } catch (error) {
      addAlert("Error al conectar con el servidor", "danger")
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (publicacion = null) => {
    setSelectedPublicacion(publicacion)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedPublicacion(null)
  }

  const handleDelete = (publicacion) => {
    setSelectedPublicacion(publicacion)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (selectedPublicacion) {
      const response = await deletePost(selectedPublicacion.id)
      setIsDeleteModalOpen(false)
      if (response?.success) {
        addAlert("Publicación eliminada correctamente.", "success")
        loadPublicaciones()
      } else {
        addAlert(response?.message || "Error al eliminar la publicación.", "danger")
      }
    }
  }

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setSelectedPublicacion(null)
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
          <i className="fas fa-newspaper mr-3"></i>
          Publicaciones
        </h1>
        <button onClick={() => handleOpenModal()} className="btn btn-primary">
          <i className="fas fa-plus"></i>
          Nueva Publicación
        </button>
      </div>

      <AlertContainer alerts={alerts} />

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <i className="fas fa-list mr-2"></i>
            Lista de Publicaciones ({publicaciones.length})
          </h2>
        </div>
        <div className="card-body p-0">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p className="loading-text">Cargando publicaciones...</p>
            </div>
          ) : publicaciones.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-newspaper"></i>
              <h3>No hay publicaciones disponibles</h3>
              <p>Comienza agregando tu primera publicación</p>
              <button onClick={() => handleOpenModal()} className="btn btn-primary">
                <i className="fas fa-plus mr-2"></i>
                Crear Primera Publicación
              </button>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Imagen</th>
                    <th>Título</th>
                    <th>Contenido</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {publicaciones.map((publicacion) => (
                    <tr key={publicacion.id}>
                      <td>{publicacion.id}</td>
                      <td>
                        {publicacion.imagen ? (
                          <img
                            src={publicacion.imagen || "/placeholder.svg"}
                            alt={publicacion.titulo}
                            className="image-preview"
                            style={{ width: "50px", height: "50px", objectFit: "cover" }}
                          />
                        ) : (
                          <div className="image-placeholder">
                            <i className="fas fa-image"></i>
                          </div>
                        )}
                      </td>
                      <td>{publicacion.titulo}</td>
                      <td>{publicacion.contenido?.substring(0, 100)}...</td>
                      <td>{publicacion.fechaPublicacion}</td>
                      <td>
                        <span className={`badge ${publicacion.status ? "badge-success" : "badge-danger"}`}>
                          {publicacion.status ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button
                            onClick={() => handleOpenModal(publicacion)}
                            className="action-btn edit"
                            title="Editar publicación"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            onClick={() => handleDelete(publicacion)}
                            className="action-btn delete"
                            title="Eliminar publicación"
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
        title={selectedPublicacion ? "Editar Publicación" : "Nueva Publicación"}
        size="lg"
      >
        <PublicacionForm
          publicacion={selectedPublicacion}
          onSave={() => {
            handleCloseModal()
            loadPublicaciones()
          }}
          onCancel={handleCloseModal}
        />
      </FormModal>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={confirmDelete}
        title="Confirmar Eliminación"
        message={`¿Estás seguro de que deseas eliminar la publicación "${selectedPublicacion?.titulo}"? Esta acción no se puede deshacer.`}
        itemName={selectedPublicacion?.titulo}
      />
    </div>
  )
}

export default PublicacionesPage
