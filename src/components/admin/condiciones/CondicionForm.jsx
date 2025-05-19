"use client"

import { useEffect, useState } from "react"

const CondicionForm = ({ condicion, viewOnly, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    status: true,
  })

  useEffect(() => {
    if (condicion) {
      setFormData({
        nombre: condicion.nombre || "",
        descripcion: condicion.descripcion || "",
        status: condicion.status !== undefined ? condicion.status : true,
      })
    }
  }, [condicion])

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

  const handleSubmit = (e) => {
    e.preventDefault()
    if (viewOnly) return

    onSave(formData)
  }

  return (
    <div className="modal-overlay open">
      <div className="modal" style={{ maxWidth: "600px" }}>
        <div className="modal-header">
          <h2 className="modal-title">
            {viewOnly ? "Ver Condición" : condicion ? "Editar Condición" : "Nueva Condición"}
          </h2>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
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
                disabled={viewOnly}
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
                disabled={viewOnly}
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
              {condicion ? "Actualizar Condición" : "Guardar Condición"}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default CondicionForm
