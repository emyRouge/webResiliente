"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useApi } from "../../../context/ApiContext"
import FileUploader from "../common/FileUploader"

interface Usuario {
  id?: number
  nombre: string
  apellido: string
  email: string
  rol?: { id: number; nombre: string }
  rolId?: number
  numeroEmpleado: number
  area: string
  status: boolean
}

interface UsuarioFormProps {
  usuario?: Usuario | null
  onSave: (data: any) => void
  onCancel: () => void
}

const UsuarioForm = ({ usuario, onSave, onCancel }: UsuarioFormProps) => {
  const { createUsuario, updateUsuario, getRoles } = useApi()
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    rolId: "",
    numeroEmpleado: "",
    area: "",
    telefono: "",
    fechaIngreso: "",
    foto: "",
    status: true,
  })
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    loadRoles()
    if (usuario) {
      setFormData({
        nombre: usuario.nombre || "",
        apellido: usuario.apellido || "",
        email: usuario.email || "",
        password: "",
        rolId: String(usuario.rol?.id || usuario.rolId || ""),
        numeroEmpleado: String(usuario.numeroEmpleado || ""),
        area: usuario.area || "",
        telefono: usuario.telefono || "",
        fechaIngreso: usuario.fechaIngreso || "",
        foto: usuario.foto || "",
        status: usuario.status !== undefined ? usuario.status : true,
      })
    }
  }, [usuario])

  const loadRoles = async () => {
    try {
      const response = await getRoles()
      if (response?.success) {
        setRoles(response.data || [])
      }
    } catch (error) {
      console.error("Error loading roles:", error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleFileUpload = (fileUrl: string) => {
    setFormData({
      ...formData,
      foto: fileUrl,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Convert string values to appropriate types
      const dataToSubmit = {
        ...formData,
        rolId: Number.parseInt(formData.rolId, 10),
        numeroEmpleado: Number.parseInt(formData.numeroEmpleado, 10),
      }

      // Don't send empty password for updates
      if (usuario?.id && !dataToSubmit.password) {
        delete dataToSubmit.password
      }

      let response
      if (usuario?.id) {
        response = await updateUsuario(usuario.id, dataToSubmit)
      } else {
        response = await createUsuario(dataToSubmit)
      }

      if (response.success) {
        onSave(response.data)
      } else {
        setError(response.message || "Error al guardar el usuario")
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
            placeholder="Nombre del usuario"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Apellido *</label>
          <input
            type="text"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            required
            className="form-control"
            placeholder="Apellido del usuario"
          />
        </div>
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

      <div className="form-group">
        <label className="form-label">
          {usuario ? "Nueva Contraseña (dejar vacío para mantener actual)" : "Contraseña *"}
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required={!usuario}
          className="form-control"
          placeholder="Contraseña"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="form-group">
          <label className="form-label">Rol *</label>
          <select name="rolId" value={formData.rolId} onChange={handleChange} required className="form-control">
            <option value="">Seleccionar rol</option>
            {roles.map((rol: any) => (
              <option key={rol.id} value={rol.id}>
                {rol.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Número Empleado *</label>
          <input
            type="number"
            name="numeroEmpleado"
            value={formData.numeroEmpleado}
            onChange={handleChange}
            required
            min="1"
            className="form-control"
            placeholder="Número de empleado"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Área *</label>
          <input
            type="text"
            name="area"
            value={formData.area}
            onChange={handleChange}
            required
            className="form-control"
            placeholder="Área de trabajo"
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
          <label className="form-label">Fecha de Ingreso</label>
          <input
            type="date"
            name="fechaIngreso"
            value={formData.fechaIngreso}
            onChange={handleChange}
            className="form-control"
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Foto de Perfil</label>
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

export default UsuarioForm
