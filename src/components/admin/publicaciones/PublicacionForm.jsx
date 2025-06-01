"use client"

import { useState, useEffect } from "react"
import { useApi } from "../../../context/ApiContext"
import FileUploader from "../common/FileUploader"

const PublicacionForm = ({ publicacion, onSave, onCancel }) => {
  const { createPost, updatePost } = useApi()
  const [formData, setFormData] = useState({
    titulo: "",
    contenido: "",
    imagen: "",
    autor: "",
    categoria: "",
    fechaPublicacion: "",
    status: true,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (publicacion) {
      setFormData({
        titulo: publicacion.titulo || "",
        contenido: publicacion.contenido || "",
        imagen: publicacion.imagen || "",
        autor: publicacion.autor || "",
        categoria: publicacion.categoria || "",
        fechaPublicacion: publicacion.fechaPublicacion || "",
        status: publicacion.status !== undefined ? publicacion.status : true,
      })
    } else {
      // Set default date for new publications
      const today = new Date().toISOString().split("T")[0]
      setFormData((prev) => ({ ...prev, fechaPublicacion: today }))
    }
  }, [publicacion])

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
      imagen: fileUrl,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      let response
      if (publicacion) {
        response = await updatePost(publicacion.id, formData)
      } else {
        response = await createPost(formData)
      }

      if (response.success) {
        onSave(response.data)
      } else {
        setError(response.message || "Error al guardar la publicación")
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
        <label className="form-label">Título *</label>
        <input
          type="text"
          name="titulo"
          value={formData.titulo}
          onChange={handleChange}
          required
          className="form-control"
          placeholder="Título de la publicación"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-group">
          <label className="form-label">Autor *</label>
          <input
            type="text"
            name="autor"
            value={formData.autor}
            onChange={handleChange}
            required
            className="form-control"
            placeholder="Nombre del autor"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Categoría</label>
          <input
            type="text"
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            className="form-control"
            placeholder="Categoría de la publicación"
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Fecha de Publicación *</label>
        <input
          type="date"
          name="fechaPublicacion"
          value={formData.fechaPublicacion}
          onChange={handleChange}
          required
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Contenido *</label>
        <textarea
          name="contenido"
          value={formData.contenido}
          onChange={handleChange}
          required
          rows="6"
          className="form-control"
          placeholder="Contenido de la publicación"
        ></textarea>
      </div>

      <div className="form-group">
        <label className="form-label">Imagen</label>
        <FileUploader currentFile={formData.imagen} onFileUploaded={handleFileUpload} accept="image/*" />
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

export default PublicacionForm
