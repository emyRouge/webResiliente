"use client"

import { useState, useEffect } from "react"
import { useApi } from "../../../context/ApiContext"
import AlertContainer from "../common/AlertContainer"
import DeleteConfirmationModal from "../common/DeleteConfirmationModal"
import FormModal from "../common/FormModal"
import MeseroForm from "./MeseroForm"

const MeserosPage = () => {
  const [meseros, setMeseros] = useState([])
  const [selectedMesero, setSelectedMesero] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(false)
  const { getMeseros, deleteMesero } = useApi()

  useEffect(() => {
    loadMeseros()
  }, [])

  const loadMeseros = async () => {
    setLoading(true)
    try {
      const response = await getMeseros()
      if (response?.success) {
        setMeseros(response.data || [])
      } else {
        addAlert(response?.message || "Error al cargar los meseros.", "danger")
      }
    } catch (error) {
      addAlert("Error al conectar con el servidor", "danger")
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (mesero = null) => {
    setSelectedMesero(mesero)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedMesero(null)
  }

  const handleDelete = (mesero) => {
    setSelectedMesero(mesero)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (selectedMesero) {
      const response = await deleteMesero(selectedMesero.id)
      setIsDeleteModalOpen(false)
      if (response?.success) {
        addAlert("Mesero eliminado correctamente.", "success")
        loadMeseros()
      } else {
        addAlert(response?.message || "Error al eliminar el mesero.", "danger")
      }
    }
  }

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setSelectedMesero(null)
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
          <i className="fas fa-user mr-3"></i>
          Meseros
        </h1>
        <button onClick={() => handleOpenModal()} className="btn btn-primary">
          <i className="fas fa-plus"></i>
          Nuevo Mesero
        </button>
      </div>

      <AlertContainer alerts={alerts} />

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <i className="fas fa-list mr-2"></i>
            Lista de Meseros ({meseros.length})
          </h2>
        </div>
        <div className="card-body p-0">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p className="loading-text">Cargando meseros...</p>
            </div>
          ) : meseros.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-user"></i>
              <h3>No hay meseros disponibles</h3>
              <p>Comienza agregando tu primer mesero</p>
              <button onClick={() => handleOpenModal()} className="btn btn-primary">
                <i className="fas fa-plus mr-2"></i>
                Crear Primer Mesero
              </button>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Foto</th>
                    <th>Nombre</th>
                    <th>Edad</th>
                    <th>Presentación</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {meseros.map((mesero) => (
                    <tr key={mesero.id}>
                      <td>{mesero.id}</td>
                      <td>
                        {mesero.foto ? (
                          <img
                            src={mesero.foto || "/placeholder.svg"}
                            alt={mesero.nombre}
                            className="image-preview"
                            style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "50%" }}
                          />
                        ) : (
                          <div className="image-placeholder">
                            <i className="fas fa-user"></i>
                          </div>
                        )}
                      </td>
                      <td>{mesero.nombre}</td>
                      <td>{mesero.edad}</td>
                      <td>{mesero.presentacion}</td>
                      <td>
                        <span className={`badge ${mesero.status ? "badge-success" : "badge-danger"}`}>
                          {mesero.status ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button
                            onClick={() => handleOpenModal(mesero)}
                            className="action-btn edit"
                            title="Editar mesero"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            onClick={() => handleDelete(mesero)}
                            className="action-btn delete"
                            title="Eliminar mesero"
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
        title={selectedMesero ? "Editar Mesero" : "Nuevo Mesero"}
      >
        <MeseroForm
          mesero={selectedMesero}
          onSave={() => {
            handleCloseModal()
            loadMeseros()
          }}
          onCancel={handleCloseModal}
        />
      </FormModal>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={confirmDelete}
        title="Confirmar Eliminación"
        message={`¿Estás seguro de que deseas eliminar el mesero "${selectedMesero?.nombre}"? Esta acción no se puede deshacer.`}
        itemName={selectedMesero?.nombre}
      />
    </div>
  )
}

export default MeserosPage
