"use client"

import { useState, useEffect } from "react"
import { useApi } from "../../../context/ApiContext"
import FileUploader from "../common/FileUploader"

const TallerForm = ({ taller, onSave, onCancel }) => {
  const { createWorkshop, updateWorkshop } = useApi()
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    fechaInicio: "",
    fechaFin: "",
    horaInicio: "",
    horaFin: "",
    instructor: "",
    cupos: "",
    precio: "",
    ubicacion: "",
    requisitos: "",
    imagen: "",
    status: true,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (taller) {
      setFormData({
        nombre: taller.nombre || "",
        descripcion: taller.descripcion || "",
        fechaInicio: taller.fechaInicio || "",
        fechaFin: taller.fechaFin || "",
        horaInicio: taller.horaInicio || "",
        horaFin: taller.horaFin || "",
        instructor: taller.instructor || "",
        cupos: taller.cupos || "",
        precio: taller.precio || "",
        ubicacion: taller.ubicacion || "",
        requisitos: taller.requisitos || "",
        imagen: taller.imagen || "",
        status: taller.status !== undefined ? taller.status : true,
      })
    }
  }, [taller])

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
      // Convert numeric fields
      const dataToSubmit = {
        ...formData,
        cupos: formData.cupos ? Number.parseInt(formData.cupos) : null,
        precio: formData.precio ? Number.parseFloat(formData.precio) : null,
      }

      let response
      if (taller) {
        response = await updateWorkshop(taller.id, dataToSubmit)
      } else {
        response = await createWorkshop(dataToSubmit)
      }

      if (response.success) {
        onSave(response.data)
      } else {
        setError(response.message || "Error al guardar el taller")
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
        <label className="form-label">Nombre del Taller *</label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
          className="form-control"
          placeholder="Nombre del taller"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Descripción *</label>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          required
          rows="4"
          className="form-control"
          placeholder="Descripción detallada del taller"
        ></textarea>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-group">
          <label className="form-label">Instructor *</label>
          <input
            type="text"
            name="instructor"
            value={formData.instructor}
            onChange={handleChange}
            required
            className="form-control"
            placeholder="Nombre del instructor"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Ubicación</label>
          <input
            type="text"
            name="ubicacion"
            value={formData.ubicacion}
            onChange={handleChange}
            className="form-control"
            placeholder="Lugar donde se realizará"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-group">
          <label className="form-label">Fecha Inicio *</label>
          <input
            type="date"
            name="fechaInicio"
            value={formData.fechaInicio}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Fecha Fin *</label>
          <input
            type="date"
            name="fechaFin"
            value={formData.fechaFin}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-group">
          <label className="form-label">Hora Inicio</label>
          <input
            type="time"
            name="horaInicio"
            value={formData.horaInicio}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Hora Fin</label>
          <input type="time" name="horaFin" value={formData.horaFin} onChange={handleChange} className="form-control" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-group">
          <label className="form-label">Cupos Disponibles</label>
          <input
            type="number"
            name="cupos"
            value={formData.cupos}
            onChange={handleChange}
            min="1"
            className="form-control"
            placeholder="Número de cupos"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Precio</label>
          <input
            type="number"
            name="precio"
            value={formData.precio}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="form-control"
            placeholder="Precio del taller"
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Requisitos</label>
        <textarea
          name="requisitos"
          value={formData.requisitos}
          onChange={handleChange}
          rows="3"
          className="form-control"
          placeholder="Requisitos para participar en el taller"
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

export default TallerForm
