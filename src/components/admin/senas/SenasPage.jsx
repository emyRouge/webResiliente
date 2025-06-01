"use client"

import { useState, useEffect } from "react"
import { useApi } from "../../../context/ApiContext"
import AlertContainer from "../common/AlertContainer"
import DeleteConfirmationModal from "../common/DeleteConfirmationModal"
import FormModal from "../common/FormModal"
import SenaForm from "./SenaForm"

const SenasPage = () => {
  const [senas, setSenas] = useState([])
  const [selectedSena, setSelectedSena] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(false)
  const { getSenas, deleteSena } = useApi()

  useEffect(() => {
    loadSenas()
  }, [])

  const loadSenas = async () => {
    setLoading(true)
    try {
      const response = await getSenas()
      if (response?.success) {
        setSenas(response.data || [])
      } else {
        addAlert(response?.message || "Error al cargar las señas.", "danger")
      }
    } catch (error) {
      addAlert("Error al conectar con el servidor", "danger")
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (sena = null) => {
    setSelectedSena(sena)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedSena(null)
  }

  const handleDelete = (sena) => {
    setSelectedSena(sena)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (selectedSena) {
      const response = await deleteSena(selectedSena.id)
      setIsDeleteModalOpen(false)
      if (response?.success) {
        addAlert("Seña eliminada correctamente.", "success")
        loadSenas()
      } else {
        addAlert(response?.message || "Error al eliminar la seña.", "danger")
      }
    }
  }

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setSelectedSena(null)
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
          <i className="fas fa-hands mr-3"></i>
          Señas
        </h1>
        <button onClick={() => handleOpenModal()} className="btn btn-primary">
          <i className="fas fa-plus"></i>
          Nueva Seña
        </button>
      </div>

      <AlertContainer alerts={alerts} />

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <i className="fas fa-list mr-2"></i>
            Lista de Señas ({senas.length})
          </h2>
        </div>
        <div className="card-body p-0">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p className="loading-text">Cargando señas...</p>
            </div>
          ) : senas.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-hands"></i>
              <h3>No hay señas disponibles</h3>
              <p>Comienza agregando tu primera seña</p>
              <button onClick={() => handleOpenModal()} className="btn btn-primary">
                <i className="fas fa-plus mr-2"></i>
                Crear Primera Seña
              </button>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Video</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {senas.map((sena) => (
                    <tr key={sena.id}>
                      <td>{sena.id}</td>
                      <td>{sena.nombre}</td>
                      <td>
                        {sena.video && (
                          <a
                            href={sena.video}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            <i className="fas fa-play-circle mr-1"></i>
                            Ver video
                          </a>
                        )}
                      </td>
                      <td>
                        <span className={`badge ${sena.status ? "badge-success" : "badge-danger"}`}>
                          {sena.status ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button onClick={() => handleOpenModal(sena)} className="action-btn edit" title="Editar seña">
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            onClick={() => handleDelete(sena)}
                            className="action-btn delete"
                            title="Eliminar seña"
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

      <FormModal isOpen={isModalOpen} onClose={handleCloseModal} title={selectedSena ? "Editar Seña" : "Nueva Seña"}>
        <SenaForm
          sena={selectedSena}
          onSave={() => {
            handleCloseModal()
            loadSenas()
          }}
          onCancel={handleCloseModal}
        />
      </FormModal>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={confirmDelete}
        title="Confirmar Eliminación"
        message={`¿Estás seguro de que deseas eliminar la seña "${selectedSena?.nombre}"? Esta acción no se puede deshacer.`}
        itemName={selectedSena?.nombre}
      />
    </div>
  )
}

export default SenasPage
