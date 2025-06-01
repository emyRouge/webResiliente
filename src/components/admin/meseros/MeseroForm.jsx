"use client"

import { useState, useEffect } from "react"
import { useApi } from "../../../context/ApiContext"
import FileUploader from "../common/FileUploader"

const MeseroForm = ({ mesero, onSave, onCancel }) => {
  const { createMesero, updateMesero, getCondiciones } = useApi()
  const [formData, setFormData] = useState({
    nombre: "",
    presentacion: "",
    edad: "",
    foto: "",
    telefono: "",
    email: "",
    condicionId: "",
    turno: "",
    fechaIngreso: "",
    salario: "",
    status: true,
  })
  const [condiciones, setCondiciones] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    loadCondiciones()
    if (mesero) {
      setFormData({
        nombre: mesero.nombre || "",
        presentacion: mesero.presentacion || "",
        edad: mesero.edad || "",
        foto: mesero.foto || "",
        telefono: mesero.telefono || "",
        email: mesero.email || "",
        condicionId: mesero.condicionId || "",
        turno: mesero.turno || "",
        fechaIngreso: mesero.fechaIngreso || "",
        salario: mesero.salario || "",
        status: mesero.status !== undefined ? mesero.status : true,
      })
    }
  }, [mesero])

  const loadCondiciones = async () => {
    try {
      const response = await getCondiciones()
      if (response?.success) {
        setCondiciones(response.data || [])
      }
    } catch (error) {
      console.error("Error loading condiciones:", error)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleFileUpload = (fileUrl) => {
    setFormData({
      ...formData,
      foto: fileUrl,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Convert numeric fields
      const dataToSubmit = {
        ...formData,
        edad: Number.parseInt(formData.edad),
        condicionId: formData.condicionId ? Number.parseInt(formData.condicionId) : null,
        salario: formData.salario ? Number.parseFloat(formData.salario) : null,
      }

      let response
      if (mesero) {
        response = await updateMesero(mesero.id, dataToSubmit)
      } else {
        response = await createMesero(dataToSubmit)
      }

      if (response.success) {
        onSave(response.data)
      } else {
        setError(response.message || "Error al guardar el mesero")
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-group">
          <label className="form-label">Nombre *</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            className="form-control"
            placeholder="Nombre completo del mesero"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Edad *</label>
          <input
            type="number"
            name="edad"
            value={formData.edad}
            onChange={handleChange}
            required
            min="18"
            max="70"
            className="form-control"
            placeholder="Edad del mesero"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-group">
          <label className="form-label">Teléfono</label>
          <input
            type="tel"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            className="form-control"
            placeholder="Número de teléfono"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-control"
            placeholder="Correo electrónico"
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Presentación *</label>
        <textarea
          name="presentacion"
          value={formData.presentacion}
          onChange={handleChange}
          required
          rows="3"
          className="form-control"
          placeholder="Presentación del mesero"
        ></textarea>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-group">
          <label className="form-label">Condición</label>
          <select name="condicionId" value={formData.condicionId} onChange={handleChange} className="form-control">
            <option value="">Seleccionar condición</option>
            {condiciones.map((condicion) => (
              <option key={condicion.id} value={condicion.id}>
                {condicion.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Turno</label>
          <select name="turno" value={formData.turno} onChange={handleChange} className="form-control">
            <option value="">Seleccionar turno</option>
            <option value="mañana">Mañana</option>
            <option value="tarde">Tarde</option>
            <option value="noche">Noche</option>
            <option value="completo">Tiempo completo</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-group">
          <label className="form-label">Fecha de Ingreso</label>
          <input
            type="date"
            name="fechaIngreso"
            value={formData.fechaIngreso}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Salario</label>
          <input
            type="number"
            name="salario"
            value={formData.salario}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="form-control"
            placeholder="Salario mensual"
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Foto</label>
        <FileUploader currentFile={formData.foto} onFileUploaded={handleFileUpload} accept="image/*" />
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

export default MeseroForm
