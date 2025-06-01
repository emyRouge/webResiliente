"use client"

import { useState, useEffect } from "react"
import { useApi } from "../../../context/ApiContext"
import AlertContainer from "../common/AlertContainer"
import DeleteConfirmationModal from "../common/DeleteConfirmationModal"
import FormModal from "../common/FormModal"
import TallerForm from "./TallerForm"

const TalleresPage = () => {
  const [talleres, setTalleres] = useState([])
  const [selectedTaller, setSelectedTaller] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(false)
  const { getWorkshops, deleteWorkshop } = useApi()

  useEffect(() => {
    loadTalleres()
  }, [])

  const loadTalleres = async () => {
    setLoading(true)
    try {
      const response = await getWorkshops()
      if (response?.success) {
        setTalleres(response.data || [])
      } else {
        addAlert(response?.message || "Error al cargar los talleres.", "danger")
      }
    } catch (error) {
      addAlert("Error al conectar con el servidor", "danger")
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (taller = null) => {
    setSelectedTaller(taller)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedTaller(null)
  }

  const handleDelete = (taller) => {
    setSelectedTaller(taller)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (selectedTaller) {
      const response = await deleteWorkshop(selectedTaller.id)
      setIsDeleteModalOpen(false)
      if (response?.success) {
        addAlert("Taller eliminado correctamente.", "success")
        loadTalleres()
      } else {
        addAlert(response?.message || "Error al eliminar el taller.", "danger")
      }
    }
  }

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setSelectedTaller(null)
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
          <i className="fas fa-chalkboard-teacher mr-3"></i>
          Talleres
        </h1>
        <button onClick={() => handleOpenModal()} className="btn btn-primary">
          <i className="fas fa-plus"></i>
          Nuevo Taller
        </button>
      </div>

      <AlertContainer alerts={alerts} />

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <i className="fas fa-list mr-2"></i>
            Lista de Talleres ({talleres.length})
          </h2>
        </div>
        <div className="card-body p-0">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p className="loading-text">Cargando talleres...</p>
            </div>
          ) : talleres.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-chalkboard-teacher"></i>
              <h3>No hay talleres disponibles</h3>
              <p>Comienza agregando tu primer taller</p>
              <button onClick={() => handleOpenModal()} className="btn btn-primary">
                <i className="fas fa-plus mr-2"></i>
                Crear Primer Taller
              </button>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Imagen</th>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Fecha Inicio</th>
                    <th>Fecha Fin</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {talleres.map((taller) => (
                    <tr key={taller.id}>
                      <td>{taller.id}</td>
                      <td>
                        {taller.imagen ? (
                          <img
                            src={taller.imagen || "/placeholder.svg"}
                            alt={taller.nombre}
                            className="image-preview"
                            style={{ width: "50px", height: "50px", objectFit: "cover" }}
                          />
                        ) : (
                          <div className="image-placeholder">
                            <i className="fas fa-image"></i>
                          </div>
                        )}
                      </td>
                      <td>{taller.nombre}</td>
                      <td>{taller.descripcion?.substring(0, 100)}...</td>
                      <td>{taller.fechaInicio}</td>
                      <td>{taller.fechaFin}</td>
                      <td>
                        <span className={`badge ${taller.status ? "badge-success" : "badge-danger"}`}>
                          {taller.status ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button
                            onClick={() => handleOpenModal(taller)}
                            className="action-btn edit"
                            title="Editar taller"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            onClick={() => handleDelete(taller)}
                            className="action-btn delete"
                            title="Eliminar taller"
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
        title={selectedTaller ? "Editar Taller" : "Nuevo Taller"}
        size="lg"
      >
        <TallerForm
          taller={selectedTaller}
          onSave={(data) => {
            if (data) {
              addAlert("Taller guardado correctamente.", "success")
            }
            handleCloseModal()
            loadTalleres()
          }}
          onCancel={handleCloseModal}
        />
      </FormModal>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={confirmDelete}
        title="Confirmar Eliminación"
        message={`¿Estás seguro de que deseas eliminar el taller "${selectedTaller?.nombre}"? Esta acción no se puede deshacer.`}
        itemName={selectedTaller?.nombre}
      />
    </div>
  )
}

export default TalleresPage
