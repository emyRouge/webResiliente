"use client"

import { useEffect, useState } from "react"
import { showAlert } from "../common/AlertContainer"
import DeleteConfirmationModal from "../common/DeleteConfirmationModal"
import SenaForm from "./SenaForm"

const SenasPage = () => {
  const [senas, setSenas] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSena, setSelectedSena] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState(false) // true = view only, false = edit

  useEffect(() => {
    fetchSenas()
  }, [])

  const fetchSenas = async () => {
    setLoading(true)
    try {
      const response = await fetch("http://localhost:8080/senas")
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const data = await response.json()
      setSenas(data.datos || [])
    } catch (error) {
      console.error("Error al obtener señas:", error)
      showAlert(`Error al cargar señas: ${error.message}`, "danger")
    } finally {
      setLoading(false)
    }
  }

  const handleEditSena = (sena) => {
    setSelectedSena(sena)
    setViewMode(false)
    setIsModalOpen(true)
  }

  const handleNewSena = () => {
    setSelectedSena(null)
    setViewMode(false)
    setIsModalOpen(true)
  }

  const handleDeleteClick = (sena) => {
    setSelectedSena(sena)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteSena = async () => {
    try {
      // If it's a Wasabi URL, delete the file first
      if (selectedSena.video && selectedSena.video.startsWith("http")) {
        const fileName = selectedSena.video.split("/").pop()

        await fetch("http://localhost:8080/api/delete-from-wasabi", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fileName: fileName,
          }),
        })
      }

      const response = await fetch(`http://localhost:8080/senas/${selectedSena.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      // Update the list
      fetchSenas()
      showAlert("Seña eliminada exitosamente", "success")
    } catch (error) {
      console.error("Error al eliminar seña:", error)
      showAlert(`Error al eliminar seña: ${error.message}`, "danger")
      throw error
    }
  }

  const handleSaveSena = async (senaData) => {
    try {
      let url = "http://localhost:8080/senas"
      let method = "POST"

      if (selectedSena?.id) {
        url += `/${selectedSena.id}`
        method = "PUT"
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(senaData),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      // Update the list
      fetchSenas()

      // Show success message
      const message = selectedSena?.id ? "Seña actualizada exitosamente" : "Seña creada exitosamente"
      showAlert(message, "success")

      // Close the modal
      setIsModalOpen(false)
    } catch (error) {
      console.error("Error al guardar seña:", error)
      showAlert(`Error al guardar seña: ${error.message}`, "danger")
      throw error
    }
  }

  // Helper function to get proxied file URL
  const getProxiedFileUrl = (wasabiUrl) => {
    const fileName = wasabiUrl.split("/").pop()
    return `http://localhost:8080/api/files/cafe2/${fileName}`
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Gestión de Señas</h1>
        <button className="btn btn-primary" onClick={handleNewSena}>
          <i className="fas fa-plus btn-icon"></i> Nueva Seña
        </button>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Lista de Señas</h2>
          <button className="btn btn-primary" onClick={fetchSenas}>
            <i className="fas fa-sync-alt btn-icon"></i> Actualizar
          </button>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Video</th>
                  <th>Nombre</th>
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
                        <p>Cargando señas...</p>
                      </div>
                    </td>
                  </tr>
                ) : senas.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center">
                      <div style={{ padding: "2rem", textAlign: "center" }}>
                        <i className="fas fa-sign-language fa-2x" style={{ color: "#ccc", marginBottom: "1rem" }}></i>
                        <p>No hay señas disponibles</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  senas.map((sena) => (
                    <tr key={sena.id}>
                      <td>
                        {sena.video ? (
                          sena.video.startsWith("http") ? (
                            sena.video.includes(".mp4") || sena.video.includes("video") ? (
                              <video
                                src={getProxiedFileUrl(sena.video)}
                                controls
                                style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "8px" }}
                              />
                            ) : (
                              <img
                                src={getProxiedFileUrl(sena.video) || "/placeholder.svg"}
                                alt={sena.nombre}
                                className="product-image"
                                style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "8px" }}
                              />
                            )
                          ) : (
                            <img
                              src={`data:image/jpeg;base64,${sena.video}`}
                              alt={sena.nombre}
                              className="product-image"
                            />
                          )
                        ) : (
                          <div
                            style={{
                              width: "60px",
                              height: "60px",
                              backgroundColor: "#f0f0f0",
                              borderRadius: "8px",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <i className="fas fa-video" style={{ color: "#ccc" }}></i>
                          </div>
                        )}
                      </td>
                      <td>{sena.nombre}</td>
                      <td>
                        {sena.status ? (
                          <span className="badge badge-success">Activo</span>
                        ) : (
                          <span className="badge badge-danger">Inactivo</span>
                        )}
                      </td>
                      <td>
                        <div className="table-actions">
                          <button className="btn btn-sm btn-warning" onClick={() => handleEditSena(sena)}>
                            <i className="fas fa-edit"></i>
                          </button>
                          <button className="btn btn-sm btn-danger" onClick={() => handleDeleteClick(sena)}>
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
        <SenaForm
          sena={selectedSena}
          viewOnly={viewMode}
          onSave={handleSaveSena}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteSena}
        message="¿Estás seguro de que deseas eliminar esta seña? Esta acción no se puede deshacer."
      />
    </>
  )
}

export default SenasPage
