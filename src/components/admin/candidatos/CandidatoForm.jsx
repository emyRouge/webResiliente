"use client"

import { useEffect, useState } from "react"

const CandidatoForm = ({ candidato, viewOnly, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    curriculum: "",
    status: true,
  })

  useEffect(() => {
    if (candidato) {
      setFormData({
        nombre: candidato.nombre || "",
        email: candidato.email || "",
        telefono: candidato.telefono || "",
        curriculum: candidato.curriculum || "",
        status: candidato.status !== undefined ? candidato.status : true,
      })
    }
  }, [candidato])

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
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">
            {viewOnly ? "Ver Candidato" : candidato ? "Editar Candidato" : "Nuevo Candidato"}
          </h2>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
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
                disabled={viewOnly}
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
                disabled={viewOnly}
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
                disabled={viewOnly}
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
                disabled={viewOnly}
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
              {candidato ? "Actualizar Candidato" : "Guardar Candidato"}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default CandidatoForm
