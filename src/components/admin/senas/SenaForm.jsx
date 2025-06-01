"use client"

import { useState, useEffect } from "react"
import { useApi } from "../../../context/ApiContext"
import FileUploader from "../common/FileUploader"

const SenaForm = ({ sena, onSave, onCancel }) => {
  const { createSena, updateSena } = useApi()
  const [formData, setFormData] = useState({
    nombre: "",
    video: "",
    descripcion: "",
    categoria: "",
    status: true,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (sena) {
      setFormData({
        nombre: sena.nombre || "",
        video: sena.video || "",
        descripcion: sena.descripcion || "",
        categoria: sena.categoria || "",
        status: sena.status !== undefined ? sena.status : true,
      })
    }
  }, [sena])

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
      video: fileUrl,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      let response
      if (sena) {
        response = await updateSena(sena.id, formData)
      } else {
        response = await createSena(formData)
      }

      if (response.success) {
        onSave(response.data)
      } else {
        setError(response.message || "Error al guardar la seña")
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
          placeholder="Nombre de la seña"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Descripción</label>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          rows="3"
          className="form-control"
          placeholder="Descripción de la seña"
        ></textarea>
      </div>

      <div className="form-group">
        <label className="form-label">Categoría</label>
        <input
          type="text"
          name="categoria"
          value={formData.categoria}
          onChange={handleChange}
          className="form-control"
          placeholder="Categoría de la seña"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Video URL</label>
        <input
          type="url"
          name="video"
          value={formData.video}
          onChange={handleChange}
          className="form-control"
          placeholder="URL del video de la seña"
        />
        <small className="text-muted">O sube un archivo de video:</small>
        <FileUploader currentFile={formData.video} onFileUploaded={handleFileUpload} accept="video/*" />
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

export default SenaForm
