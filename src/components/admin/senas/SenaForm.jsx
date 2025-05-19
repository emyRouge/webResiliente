"use client"

import { useEffect, useState } from "react"
import FileUploader from "../common/FileUploader"

const SenaForm = ({ sena, viewOnly, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    video: "",
    status: true,
  })

  useEffect(() => {
    if (sena) {
      setFormData({
        nombre: sena.nombre || "",
        video: sena.video || "",
        status: sena.status !== undefined ? sena.status : true,
      })
    }
  }, [sena])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleRadioChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      status: e.target.value === "true",
    }))
  }

  const handleFileUploaded = (fileUrl) => {
    setFormData((prev) => ({
      ...prev,
      video: fileUrl,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (viewOnly) return

    onSave(formData)
  }

  // Helper function to get proxied file URL
  const getProxiedFileUrl = (wasabiUrl) => {
    if (!wasabiUrl) return null
    if (!wasabiUrl.startsWith("http")) return `data:image/jpeg;base64,${wasabiUrl}`

    const fileName = wasabiUrl.split("/").pop()
    return `http://localhost:8080/api/files/cafe2/${fileName}`
  }

  return (
    <div className="modal-overlay open">
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">{viewOnly ? "Ver Seña" : sena ? "Editar Seña" : "Nueva Seña"}</h2>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <form id="senaForm" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nombre" className="form-label">
                Nombre *
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                className="form-control"
                value={formData.nombre}
                onChange={handleChange}
                disabled={viewOnly}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Video de la Seña *</label>
              {viewOnly ? (
                <div className="file-preview">
                  {formData.video &&
                    (formData.video.includes(".mp4") || formData.video.includes("video") ? (
                      <video
                        src={getProxiedFileUrl(formData.video)}
                        controls
                        style={{ maxWidth: "100%", maxHeight: "200px" }}
                      />
                    ) : (
                      <img
                        src={getProxiedFileUrl(formData.video) || "/placeholder.svg"}
                        alt={formData.nombre}
                        style={{ maxWidth: "100%", maxHeight: "200px" }}
                      />
                    ))}
                </div>
              ) : (
                <FileUploader
                  onFileUploaded={handleFileUploaded}
                  acceptTypes="image/*,video/*"
                  previewType={formData.video && formData.video.includes(".mp4") ? "video" : "image"}
                />
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Estado</label>
              <div>
                <label style={{ marginRight: "1rem" }}>
                  <input
                    type="radio"
                    name="status"
                    value="true"
                    checked={formData.status === true}
                    onChange={handleRadioChange}
                    disabled={viewOnly}
                  />{" "}
                  Activo
                </label>
                <label>
                  <input
                    type="radio"
                    name="status"
                    value="false"
                    checked={formData.status === false}
                    onChange={handleRadioChange}
                    disabled={viewOnly}
                  />{" "}
                  Inactivo
                </label>
              </div>
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <button className="btn btn-danger" onClick={onClose}>
            Cancelar
          </button>
          {!viewOnly && (
            <button className="btn btn-success" onClick={handleSubmit}>
              {sena ? "Actualizar Seña" : "Guardar Seña"}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default SenaForm
