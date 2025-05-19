"use client"

import { useEffect, useState } from "react"
import { showAlert } from "../common/AlertContainer"
import DeleteConfirmationModal from "../common/DeleteConfirmationModal"
import CandidatoForm from "./CandidatoForm"

const CandidatosPage = () => {
  const [candidatos, setCandidatos] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCandidato, setSelectedCandidato] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState(false) // true = view only, false = edit

  useEffect(() => {
    fetchCandidatos()
  }, [])

  const fetchCandidatos = async () => {
    setLoading(true)
    try {
      const response = await fetch("http://localhost:8080/candidatos")
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const data = await response.json()
      setCandidatos(data.datos || [])
    } catch (error) {
      console.error("Error al obtener candidatos:", error)
      showAlert(`Error al cargar candidatos: ${error.message}`, "danger")
    } finally {
      setLoading(false)
    }
  }

  const handleViewCandidato = (candidato) => {
    setSelectedCandidato(candidato)
    setViewMode(true)
    setIsModalOpen(true)
  }

  const handleEditCandidato = (candidato) => {
    setSelectedCandidato(candidato)
    setViewMode(false)
    setIsModalOpen(true)
  }

  const handleNewCandidato = () => {
    setSelectedCandidato(null)
    setViewMode(false)
    setIsModalOpen(true)
  }

  const handleDeleteClick = (candidato) => {
    setSelectedCandidato(candidato)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteCandidato = async () => {
    try {
      const response = await fetch(`http://localhost:8080/candidatos/${selectedCandidato.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      // Update the list
      fetchCandidatos()
      showAlert("Candidato eliminado exitosamente", "success")
    } catch (error) {
      console.error("Error al eliminar candidato:", error)
      showAlert(`Error al eliminar candidato: ${error.message}`, "danger")
      throw error
    }
  }

  const handleSaveCandidato = async (candidatoData) => {
    try {
      let url = "http://localhost:8080/candidatos"
      let method = "POST"

      if (selectedCandidato?.id) {
        url += `/${selectedCandidato.id}`
        method = "PUT"
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(candidatoData),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      // Update the list
      fetchCandidatos()

      // Show success message
      const message = selectedCandidato?.id ? "Candidato actualizado exitosamente" : "Candidato creado exitosamente"
      showAlert(message, "success")

      // Close the modal
      setIsModalOpen(false)
    } catch (error) {
      console.error("Error al guardar candidato:", error)
      showAlert(`Error al guardar candidato: ${error.message}`, "danger")
      throw error
    }
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Gestión de Candidatos</h1>
        <button className="btn btn-primary" onClick={handleNewCandidato}>
          <i className="fas fa-plus btn-icon"></i> Nuevo Candidato
        </button>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Lista de Candidatos</h2>
          <button className="btn btn-primary" onClick={fetchCandidatos}>
            <i className="fas fa-sync-alt btn-icon"></i> Actualizar
          </button>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Fecha de Envío</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center">
                      <div style={{ padding: "2rem", textAlign: "center" }}>
                        <i className="fas fa-spinner fa-spin fa-2x"></i>
                        <p>Cargando candidatos...</p>
                      </div>
                    </td>
                  </tr>
                ) : candidatos.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center">
                      <div style={{ padding: "2rem", textAlign: "center" }}>
                        <i className="fas fa-user-plus fa-2x" style={{ color: "#ccc", marginBottom: "1rem" }}></i>
                        <p>No hay candidatos disponibles</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  candidatos.map((candidato) => (
                    <tr key={candidato.id}>
                      <td>{candidato.nombre}</td>
                      <td>{candidato.email}</td>
                      <td>{candidato.telefono || "N/A"}</td>
                      <td>
                        {candidato.fechaEnvio
                          ? new Date(candidato.fechaEnvio).toLocaleDateString("es-ES", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "N/A"}
                      </td>
                      <td>
                        {candidato.status ? (
                          <span className="badge badge-success">Activo</span>
                        ) : (
                          <span className="badge badge-danger">Inactivo</span>
                        )}
                      </td>
                      <td>
                        <div className="table-actions">
                          <button className="btn btn-sm btn-info" onClick={() => handleViewCandidato(candidato)}>
                            <i className="fas fa-eye"></i>
                          </button>
                          <button className="btn btn-sm btn-warning" onClick={() => handleEditCandidato(candidato)}>
                            <i className="fas fa-edit"></i>
                          </button>
                          <button className="btn btn-sm btn-danger" onClick={() => handleDeleteClick(candidato)}>
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Form Modal */}
      {isModalOpen && (
        <CandidatoForm
          candidato={selectedCandidato}
          viewOnly={viewMode}
          onSave={handleSaveCandidato}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteCandidato}
        message="¿Estás seguro de que deseas eliminar este candidato? Esta acción no se puede deshacer."
      />
    </>
  )
}

export default CandidatosPage
