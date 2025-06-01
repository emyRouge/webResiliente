"use client"

import { useState, useEffect } from "react"
import { useApi } from "../../../context/ApiContext"
import AlertContainer from "../common/AlertContainer"
import DeleteConfirmationModal from "../common/DeleteConfirmationModal"
import FormModal from "../common/FormModal"
import CondicionForm from "./CondicionForm"

const CondicionesPage = () => {
  const [condiciones, setCondiciones] = useState([])
  const [selectedCondicion, setSelectedCondicion] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(false)
  const { getCondiciones, deleteCondicion } = useApi()

  useEffect(() => {
    loadCondiciones()
  }, [])

  const loadCondiciones = async () => {
    setLoading(true)
    try {
      const response = await getCondiciones()
      if (response?.success) {
        setCondiciones(response.data || [])
      } else {
        addAlert(response?.message || "Error al cargar las condiciones.", "danger")
      }
    } catch (error) {
      addAlert("Error al conectar con el servidor", "danger")
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (condicion = null) => {
    setSelectedCondicion(condicion)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedCondicion(null)
  }

  const handleDelete = (condicion) => {
    setSelectedCondicion(condicion)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (selectedCondicion) {
      const response = await deleteCondicion(selectedCondicion.id)
      setIsDeleteModalOpen(false)
      if (response?.success) {
        addAlert("Condición eliminada correctamente.", "success")
        loadCondiciones()
      } else {
        addAlert(response?.message || "Error al eliminar la condición.", "danger")
      }
    }
  }

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setSelectedCondicion(null)
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
          <i className="fas fa-list-check mr-3"></i>
          Condiciones
        </h1>
        <button onClick={() => handleOpenModal()} className="btn btn-primary">
          <i className="fas fa-plus"></i>
          Nueva Condición
        </button>
      </div>

      <AlertContainer alerts={alerts} />

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <i className="fas fa-list mr-2"></i>
            Lista de Condiciones ({condiciones.length})
          </h2>
        </div>
        <div className="card-body p-0">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p className="loading-text">Cargando condiciones...</p>
            </div>
          ) : condiciones.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-list-check"></i>
              <h3>No hay condiciones disponibles</h3>
              <p>Comienza agregando tu primera condición</p>
              <button onClick={() => handleOpenModal()} className="btn btn-primary">
                <i className="fas fa-plus mr-2"></i>
                Crear Primera Condición
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
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {condiciones.map((condicion) => (
                    <tr key={condicion.id}>
                      <td>{condicion.id}</td>
                      <td>{condicion.nombre}</td>
                      <td>{condicion.descripcion}</td>
                      <td>
                        <span className={`badge ${condicion.status ? "badge-success" : "badge-danger"}`}>
                          {condicion.status ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button
                            onClick={() => handleOpenModal(condicion)}
                            className="action-btn edit"
                            title="Editar condición"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            onClick={() => handleDelete(condicion)}
                            className="action-btn delete"
                            title="Eliminar condición"
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
        title={selectedCondicion ? "Editar Condición" : "Nueva Condición"}
      >
        <CondicionForm
          condicion={selectedCondicion}
          onSave={(data) => {
            if (data) {
              addAlert("Condición guardada correctamente.", "success")
            }
            handleCloseModal()
            loadCondiciones()
          }}
          onCancel={handleCloseModal}
        />
      </FormModal>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={confirmDelete}
        title="Confirmar Eliminación"
        message={`¿Estás seguro de que deseas eliminar la condición "${selectedCondicion?.nombre}"? Esta acción no se puede deshacer.`}
        itemName={selectedCondicion?.nombre}
      />
    </div>
  )
}

export default CondicionesPage
