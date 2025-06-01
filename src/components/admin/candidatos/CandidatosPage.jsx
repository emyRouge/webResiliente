"use client"

import { useState, useEffect } from "react"
import { useApi } from "../../../context/ApiContext"
import AlertContainer from "../common/AlertContainer"
import DeleteConfirmationModal from "../common/DeleteConfirmationModal"
import FormModal from "../common/FormModal"
import CandidatoForm from "./CandidatoForm"

const CandidatosPage = () => {
  const [candidatos, setCandidatos] = useState([])
  const [selectedCandidato, setSelectedCandidato] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(false)
  const { getCandidatos, deleteCandidato } = useApi()

  useEffect(() => {
    loadCandidatos()
  }, [])

  const loadCandidatos = async () => {
    setLoading(true)
    try {
      const response = await getCandidatos()
      if (response?.success) {
        setCandidatos(response.data || [])
      } else {
        addAlert(response?.message || "Error al cargar los candidatos.", "danger")
      }
    } catch (error) {
      addAlert("Error al conectar con el servidor", "danger")
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (candidato = null) => {
    setSelectedCandidato(candidato)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedCandidato(null)
  }

  const handleDelete = (candidato) => {
    setSelectedCandidato(candidato)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (selectedCandidato) {
      const response = await deleteCandidato(selectedCandidato.id)
      setIsDeleteModalOpen(false)
      if (response?.success) {
        addAlert("Candidato eliminado correctamente.", "success")
        loadCandidatos()
      } else {
        addAlert(response?.message || "Error al eliminar el candidato.", "danger")
      }
    }
  }

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setSelectedCandidato(null)
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
          <i className="fas fa-user-tie mr-3"></i>
          Candidatos
        </h1>
        <button onClick={() => handleOpenModal()} className="btn btn-primary">
          <i className="fas fa-plus"></i>
          Nuevo Candidato
        </button>
      </div>

      <AlertContainer alerts={alerts} />

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <i className="fas fa-list mr-2"></i>
            Lista de Candidatos ({candidatos.length})
          </h2>
        </div>
        <div className="card-body p-0">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p className="loading-text">Cargando candidatos...</p>
            </div>
          ) : candidatos.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-user-tie"></i>
              <h3>No hay candidatos disponibles</h3>
              <p>Comienza agregando tu primer candidato</p>
              <button onClick={() => handleOpenModal()} className="btn btn-primary">
                <i className="fas fa-plus mr-2"></i>
                Crear Primer Candidato
              </button>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Teléfono</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {candidatos.map((candidato) => (
                    <tr key={candidato.id}>
                      <td>{candidato.id}</td>
                      <td>{candidato.nombre}</td>
                      <td>{candidato.email}</td>
                      <td>{candidato.telefono}</td>
                      <td>
                        <span className={`badge ${candidato.status ? "badge-success" : "badge-danger"}`}>
                          {candidato.status ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button
                            onClick={() => handleOpenModal(candidato)}
                            className="action-btn edit"
                            title="Editar candidato"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            onClick={() => handleDelete(candidato)}
                            className="action-btn delete"
                            title="Eliminar candidato"
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
        title={selectedCandidato ? "Editar Candidato" : "Nuevo Candidato"}
      >
        <CandidatoForm
          candidato={selectedCandidato}
          onSave={(data) => {
            if (data) {
              addAlert("Candidato guardado correctamente.", "success")
            }
            handleCloseModal()
            loadCandidatos()
          }}
          onCancel={handleCloseModal}
        />
      </FormModal>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={confirmDelete}
        title="Confirmar Eliminación"
        message={`¿Estás seguro de que deseas eliminar el candidato "${selectedCandidato?.nombre}"? Esta acción no se puede deshacer.`}
        itemName={selectedCandidato?.nombre}
      />
    </div>
  )
}

export default CandidatosPage
