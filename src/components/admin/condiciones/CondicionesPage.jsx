"use client"

import { useEffect, useState } from "react"
import { showAlert } from "../common/AlertContainer"
import DeleteConfirmationModal from "../common/DeleteConfirmationModal"
import CondicionForm from "./CondicionForm"

const CondicionesPage = () => {
  const [condiciones, setCondiciones] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCondicion, setSelectedCondicion] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState(false) // true = view only, false = edit
  const [statusFilter, setStatusFilter] = useState("")

  useEffect(() => {
    fetchCondiciones()
  }, [])

  const fetchCondiciones = async (status = "") => {
    setLoading(true)
    try {
      let url = "http://localhost:8080/condiciones"

      if (status !== "") {
        url = `http://localhost:8080/condiciones/estado/${status}`
      }

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const data = await response.json()
      setCondiciones(data.datos || [])
    } catch (error) {
      console.error("Error al obtener condiciones:", error)
      showAlert(`Error al cargar condiciones: ${error.message}`, "danger")
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (e) => {
    const status = e.target.value
    setStatusFilter(status)
    fetchCondiciones(status)
  }

  const handleViewCondicion = (condicion) => {
    setSelectedCondicion(condicion)
    setViewMode(true)
    setIsModalOpen(true)
  }

  const handleEditCondicion = (condicion) => {
    setSelectedCondicion(condicion)
    setViewMode(false)
    setIsModalOpen(true)
  }

  const handleNewCondicion = () => {
    setSelectedCondicion(null)
    setViewMode(false)
    setIsModalOpen(true)
  }

  const handleDeleteClick = (condicion) => {
    setSelectedCondicion(condicion)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteCondicion = async () => {
    try {
      const response = await fetch(`http://localhost:8080/condiciones/${selectedCondicion.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      // Update the list
      fetchCondiciones(statusFilter)
      showAlert("Condición eliminada exitosamente", "success")
    } catch (error) {
      console.error("Error al eliminar condición:", error)
      showAlert(`Error al eliminar condición: ${error.message}`, "danger")
      throw error
    }
  }

  const handleSaveCondicion = async (condicionData) => {
    try {
      let url = "http://localhost:8080/condiciones"
      let method = "POST"

      if (selectedCondicion?.id) {
        url += `/${selectedCondicion.id}`
        method = "PUT"
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(condicionData),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      // Update the list
      fetchCondiciones(statusFilter)

      // Show success message
      const message = selectedCondicion?.id ? "Condición actualizada exitosamente" : "Condición creada exitosamente"
      showAlert(message, "success")

      // Close the modal
      setIsModalOpen(false)
    } catch (error) {
      console.error("Error al guardar condición:", error)
      showAlert(`Error al guardar condición: ${error.message}`, "danger")
      throw error
    }
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Gestión de Condiciones</h1>
        <button className="btn btn-primary" onClick={handleNewCondicion}>
          <i className="fas fa-plus btn-icon"></i> Nueva Condición
        </button>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Lista de Condiciones</h2>
          <div className="card-actions">
            <select
              id="statusFilter"
              className="form-control"
              style={{ width: "200px", marginRight: "10px" }}
              value={statusFilter}
              onChange={handleFilterChange}
            >
              <option value="">Todos los estados</option>
              <option value="true">Activas</option>
              <option value="false">Inactivas</option>
            </select>
            <button
              className="btn btn-primary"
              onClick={() => {
                setStatusFilter("")
                fetchCondiciones()
              }}
            >
              <i className="fas fa-sync-alt btn-icon"></i> Actualizar
            </button>
          </div>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="text-center">
                      <div style={{ padding: "2rem", textAlign: "center" }}>
                        <i className="fas fa-spinner fa-spin fa-2x"></i>
                        <p>Cargando condiciones...</p>
                      </div>
                    </td>
                  </tr>
                ) : condiciones.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center">
                      <div style={{ padding: "2rem", textAlign: "center" }}>
                        <i className="fas fa-wheelchair fa-2x" style={{ color: "#ccc", marginBottom: "1rem" }}></i>
                        <p>No hay condiciones disponibles</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  condiciones.map((condicion) => (
                    <tr key={condicion.id}>
                      <td>{condicion.nombre}</td>
                      <td>
                        <div className="description-preview">
                          {condicion.descripcion || <span className="text-muted">Sin descripción</span>}
                        </div>
                      </td>
                      <td>
                        {condicion.status ? (
                          <span className="badge badge-success">Activo</span>
                        ) : (
                          <span className="badge badge-danger">Inactivo</span>
                        )}
                      </td>
                      <td>
                        <div className="table-actions">
                          <button className="btn btn-sm btn-info" onClick={() => handleViewCondicion(condicion)}>
                            <i className="fas fa-eye"></i>
                          </button>
                          <button className="btn btn-sm btn-warning" onClick={() => handleEditCondicion(condicion)}>
                            <i className="fas fa-edit"></i>
                          </button>
                          <button className="btn btn-sm btn-danger" onClick={() => handleDeleteClick(condicion)}>
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
        <CondicionForm
          condicion={selectedCondicion}
          viewOnly={viewMode}
          onSave={handleSaveCondicion}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteCondicion}
        message={
          <>
            <p>¿Estás seguro de que deseas eliminar esta condición? Esta acción no se puede deshacer.</p>
            <p className="text-danger">
              <strong>Nota:</strong> Eliminar una condición puede afectar a los meseros asociados a ella.
            </p>
          </>
        }
      />
    </>
  )
}

export default CondicionesPage
