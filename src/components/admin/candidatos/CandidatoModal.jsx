"use client"

import { useState, useEffect } from "react"

const CandidatoModal = ({ isOpen, onClose, candidato, mode, onSave }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    curriculum: "",
    status: true,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Initialize form data when candidato changes
  useEffect(() => {
    if (candidato) {
      setFormData({
        nombre: candidato.nombre || "",
        email: candidato.email || "",
        telefono: candidato.telefono || "",
        curriculum: candidato.curriculum || "",
        status: candidato.status !== undefined ? candidato.status : true,
      })
    } else {
      // Reset form for new candidato
      setFormData({
        nombre: "",
        email: "",
        telefono: "",
        curriculum: "",
        status: true,
      })
    }

    setError(null)
  }, [candidato, isOpen])

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  // Handle radio button changes
  const handleRadioChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      status: e.target.value === "true",
    }))
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (mode === "view") {
      onClose()
      return
    }

    setLoading(true)
    setError(null)

    try {
      const result = await onSave(formData)

      if (!result.success) {
        setError(result.error || "Error al guardar candidato")
      }
    } catch (err) {
      setError(err.message || "Error al guardar candidato")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  const isViewMode = mode === "view"
  const title = {
    create: "Nuevo Candidato",
    edit: "Editar Candidato",
    view: "Ver Candidato",
  }[mode]

  return (
    <div className={`modal-overlay ${isOpen ? "open" : ""}`}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          {error && (
            <div className="alert alert-danger">
              <i className="fas fa-exclamation-circle"></i> {error}
            </div>
          )}

          <form id="candidatoForm" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nombre" className="form-label">
                Nombre Completo *
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                className="form-control"
                value={formData.nombre}
                onChange={handleChange}
                disabled={isViewMode}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                disabled={isViewMode}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="telefono" className="form-label">
                Teléfono *
              </label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                className="form-control"
                value={formData.telefono}
                onChange={handleChange}
                disabled={isViewMode}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="curriculum" className="form-label">
                Curriculum (Base64)
              </label>
              <textarea
                id="curriculum"
                name="curriculum"
                className="form-control"
                rows="3"
                value={formData.curriculum}
                onChange={handleChange}
                disabled={isViewMode}
              ></textarea>
              <small className="form-text">Sube el archivo PDF o Word convertido a Base64</small>
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
                    disabled={isViewMode}
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
                    disabled={isViewMode}
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
          {!isViewMode && (
            <button className="btn btn-success" onClick={handleSubmit} disabled={loading}>
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  <span>Guardando...</span>
                </>
              ) : (
                <>{mode === "create" ? "Guardar" : "Actualizar"} Candidato</>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default CandidatoModal
