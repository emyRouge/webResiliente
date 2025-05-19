"use client"

import { useState, useEffect } from "react"

const CondicionModal = ({ isOpen, onClose, condicion, mode, onSave }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    status: true,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Initialize form data when condicion changes
  useEffect(() => {
    if (condicion) {
      setFormData({
        nombre: condicion.nombre || "",
        descripcion: condicion.descripcion || "",
        status: condicion.status !== undefined ? condicion.status : true,
      })
    } else {
      // Reset form for new condicion
      setFormData({
        nombre: "",
        descripcion: "",
        status: true,
      })
    }

    setError(null)
  }, [condicion, isOpen])

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
        setError(result.error || "Error al guardar condición")
      }
    } catch (err) {
      setError(err.message || "Error al guardar condición")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  const isViewMode = mode === "view"
  const title = {
    create: "Nueva Condición",
    edit: "Editar Condición",
    view: "Ver Condición",
  }[mode]

  return (
    <div className={`modal-overlay ${isOpen ? "open" : ""}`}>
      <div className="modal" style={{ maxWidth: "600px" }}>
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

          <form id="condicionForm" onSubmit={handleSubmit}>
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
                disabled={isViewMode}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="descripcion" className="form-label">
                Descripción *
              </label>
              <textarea
                id="descripcion"
                name="descripcion"
                className="form-control"
                value={formData.descripcion}
                onChange={handleChange}
                disabled={isViewMode}
                required
              ></textarea>
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
                <>{mode === "create" ? "Guardar" : "Actualizar"} Condición</>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default CondicionModal
