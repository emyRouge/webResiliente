"use client"

import { useState, useEffect } from "react"
import { useApi } from "../../../context/ApiContext"
import FileUploader from "../common/FileUploader"

const CandidatoForm = ({ candidato, onSave, onCancel }) => {
  const { createCandidato, updateCandidato, getCondiciones } = useApi()
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    direccion: "",
    fechaNacimiento: "",
    experiencia: "",
    habilidades: "",
    condicionId: "",
    curriculum: "",
    foto: "",
    estado: "pendiente",
    status: true,
  })
  const [condiciones, setCondiciones] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    loadCondiciones()
    if (candidato) {
      setFormData({
        nombre: candidato.nombre || "",
        email: candidato.email || "",
        telefono: candidato.telefono || "",
        direccion: candidato.direccion || "",
        fechaNacimiento: candidato.fechaNacimiento || "",
        experiencia: candidato.experiencia || "",
        habilidades: candidato.habilidades || "",
        condicionId: candidato.condicionId || "",
        curriculum: candidato.curriculum || "",
        foto: candidato.foto || "",
        estado: candidato.estado || "pendiente",
        status: candidato.status !== undefined ? candidato.status : true,
      })
    }
  }, [candidato])

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

  const handleCurriculumUpload = (fileUrl) => {
    setFormData({
      ...formData,
      curriculum: fileUrl,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const dataToSubmit = {
        ...formData,
        condicionId: formData.condicionId ? Number.parseInt(formData.condicionId) : null,
      }

      let response
      if (candidato) {
        response = await updateCandidato(candidato.id, dataToSubmit)
      } else {
        response = await createCandidato(dataToSubmit)
      }

      if (response.success) {
        onSave(response.data)
      } else {
        setError(response.message || "Error al guardar el candidato")
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
          <label className="form-label">Nombre Completo *</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            className="form-control"
            placeholder="Nombre completo del candidato"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="form-control"
            placeholder="Correo electrónico"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-group">
          <label className="form-label">Teléfono *</label>
          <input
            type="tel"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            required
            className="form-control"
            placeholder="Número de teléfono"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Fecha de Nacimiento</label>
          <input
            type="date"
            name="fechaNacimiento"
            value={formData.fechaNacimiento}
            onChange={handleChange}
            className="form-control"
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Dirección</label>
        <input
          type="text"
          name="direccion"
          value={formData.direccion}
          onChange={handleChange}
          className="form-control"
          placeholder="Dirección de residencia"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Experiencia Laboral</label>
        <textarea
          name="experiencia"
          value={formData.experiencia}
          onChange={handleChange}
          rows="3"
          className="form-control"
          placeholder="Describe tu experiencia laboral previa"
        ></textarea>
      </div>

      <div className="form-group">
        <label className="form-label">Habilidades</label>
        <textarea
          name="habilidades"
          value={formData.habilidades}
          onChange={handleChange}
          rows="3"
          className="form-control"
          placeholder="Describe tus habilidades y competencias"
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
          <label className="form-label">Estado de Candidatura</label>
          <select name="estado" value={formData.estado} onChange={handleChange} className="form-control">
            <option value="pendiente">Pendiente</option>
            <option value="en_revision">En Revisión</option>
            <option value="entrevista">Entrevista</option>
            <option value="aprobado">Aprobado</option>
            <option value="rechazado">Rechazado</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Foto del Candidato</label>
        <FileUploader currentFile={formData.foto} onFileUploaded={handleFileUpload} accept="image/*" />
      </div>

      <div className="form-group">
        <label className="form-label">Curriculum Vitae</label>
        <FileUploader
          currentFile={formData.curriculum}
          onFileUploaded={handleCurriculumUpload}
          accept=".pdf,.doc,.docx"
        />
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

export default CandidatoForm
