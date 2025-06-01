"use client"

import { useState, useEffect } from "react"
import { useApi } from "../../../context/ApiContext"

const CondicionForm = ({ condicion, onSave, onCancel }) => {
  const { createCondicion, updateCondicion } = useApi()
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    tipo: "",
    caracteristicas: "",
    status: true,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (condicion) {
      setFormData({
        nombre: condicion.nombre || "",
        descripcion: condicion.descripcion || "",
        tipo: condicion.tipo || "",
        caracteristicas: condicion.caracteristicas || "",
        status: condicion.status !== undefined ? condicion.status : true,
      })
    }
  }, [condicion])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      let response
      if (condicion) {
        response = await updateCondicion(condicion.id, formData)
      } else {
        response = await createCondicion(formData)
      }

      if (response.success) {
        onSave(response.data)
      } else {
        setError(response.message || "Error al guardar la condición")
      }
    } catch (err) {
      setError("Error de conexión al servidor")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="form-group">
        <label className="form-label">Nombre *</label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
          className="form-control"
          placeholder="Nombre de la condición"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Tipo</label>
        <select name="tipo" value={formData.tipo} onChange={handleChange} className="form-control">
          <option value="">Seleccionar tipo</option>
          <option value="fisica">Física</option>
          <option value="cognitiva">Cognitiva</option>
          <option value="sensorial">Sensorial</option>
          <option value="multiple">Múltiple</option>
          <option value="otra">Otra</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Descripción *</label>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          required
          rows="3"
          className="form-control"
          placeholder="Descripción de la condición"
        ></textarea>
      </div>

      <div className="form-group">
        <label className="form-label">Características</label>
        <textarea
          name="caracteristicas"
          value={formData.caracteristicas}
          onChange={handleChange}
          rows="3"
          className="form-control"
          placeholder="Características específicas de la condición"
        ></textarea>
      </div>

      <div className="form-group">
        <label className="form-label">Estado</label>
        <div className="mt-2">
          <label className="inline-flex items-center mr-4">
            <input
              type="radio"
              name="status"
              checked={formData.status === true}
              onChange={() => setFormData({ ...formData, status: true })}
              className="form-radio"
            />
            <span className="ml-2">Activo</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="status"
              checked={formData.status === false}
              onChange={() => setFormData({ ...formData, status: false })}
              className="form-radio"
            />
            <span className="ml-2">Inactivo</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <button type="button" onClick={onCancel} className="btn btn-secondary" disabled={loading}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </form>
  )
}

export default CondicionForm
