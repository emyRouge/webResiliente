"use client"

import { useState, useEffect } from "react"
import { useApi } from "../../../context/ApiContext"

const ProductoForm = ({ producto, onSave, readOnly = false }) => {
  const { getSenas } = useApi()
  const [formData, setFormData] = useState({
    nombre: "",
    precio: "",
    descripcion: "",
    categoria: "",
    codigo: "",
    foto: "",
    idSena: "",
    ingredientes: "",
    calorias: "",
    tiempoPreparacion: "",
    disponible: true,
    status: true,
  })
  const [senas, setSenas] = useState([])
  const [loadingSenas, setLoadingSenas] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    loadSenas()
  }, [])

  useEffect(() => {
    if (producto) {
      setFormData({
        nombre: producto.nombre || "",
        precio: producto.precio || "",
        descripcion: producto.descripcion || "",
        categoria: producto.categoria || "",
        codigo: producto.codigo || "",
        foto: producto.foto || "",
        idSena: producto.sena?.id?.toString() || "",
        ingredientes: producto.ingredientes || "",
        calorias: producto.calorias || "",
        tiempoPreparacion: producto.tiempoPreparacion || "",
        disponible: producto.disponible !== undefined ? producto.disponible : true,
        status: producto.status !== undefined ? producto.status : true,
      })
    }
  }, [producto])

  const loadSenas = async () => {
    setLoadingSenas(true)
    try {
      const result = await getSenas()
      if (result.success) {
        setSenas(result.data || [])
      }
    } catch (error) {
      console.error("Error loading señas:", error)
    } finally {
      setLoadingSenas(false)
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.nombre.trim()) newErrors.nombre = "El nombre es requerido"
    if (!formData.precio || Number.parseFloat(formData.precio) <= 0) newErrors.precio = "El precio debe ser mayor a 0"
    if (!formData.descripcion.trim()) newErrors.descripcion = "La descripción es requerida"
    if (!formData.codigo.trim()) newErrors.codigo = "El código es requerido"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const uploadToWasabi = async (file) => {
    try {
      setUploading(true)
      setUploadProgress(0)

      // Generar nombre único para el archivo
      const timestamp = new Date().getTime()
      const randomString = Math.random().toString(36).substring(2, 15)
      const extension = file.name.split(".").pop()
      const fileName = `productos/${timestamp}-${randomString}.${extension}`

      const formData = new FormData()
      formData.append("file", file)
      formData.append("fileName", fileName)

      // Simular progreso
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 10
        })
      }, 200)

      const response = await fetch("http://localhost:8080/api/upload-to-wasabi", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (!response.ok) {
        throw new Error("Error al subir archivo")
      }

      const result = await response.json()
      return result.fileUrl
    } catch (error) {
      console.error("Error uploading file:", error)
      throw error
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      alert("Solo se permiten archivos de imagen")
      return
    }

    // Validar tamaño (5MB máximo)
    if (file.size > 5 * 1024 * 1024) {
      alert("El archivo es demasiado grande. Máximo 5MB")
      return
    }

    try {
      const fileUrl = await uploadToWasabi(file)
      handleChange("foto", fileUrl)
    } catch (error) {
      alert("Error al subir la imagen")
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const dataToSave = {
      ...formData,
      idSena: formData.idSena || null,
      precio: Number.parseFloat(formData.precio),
      calorias: formData.calorias ? Number.parseInt(formData.calorias) : null,
      tiempoPreparacion: formData.tiempoPreparacion ? Number.parseInt(formData.tiempoPreparacion) : null,
    }

    onSave(dataToSave)
  }

  if (readOnly) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Nombre</label>
            <p className="form-control-static">{formData.nombre}</p>
          </div>
          <div>
            <label className="form-label">Precio</label>
            <p className="form-control-static">${Number.parseFloat(formData.precio || 0).toFixed(2)}</p>
          </div>
        </div>

        <div>
          <label className="form-label">Descripción</label>
          <p className="form-control-static">{formData.descripcion}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Categoría</label>
            <p className="form-control-static">{formData.categoria || "Sin categoría"}</p>
          </div>
          <div>
            <label className="form-label">Código</label>
            <p className="form-control-static">{formData.codigo}</p>
          </div>
        </div>

        {formData.foto && (
          <div>
            <label className="form-label">Imagen</label>
            <div className="mt-2">
              <img
                src={formData.foto || "/placeholder.svg"}
                alt={formData.nombre}
                className="image-preview"
                style={{ maxHeight: "200px", maxWidth: "200px" }}
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Estado</label>
            <span className={`badge ${formData.status ? "badge-success" : "badge-secondary"}`}>
              {formData.status ? "Activo" : "Inactivo"}
            </span>
          </div>
          <div>
            <label className="form-label">Disponibilidad</label>
            <span className={`badge ${formData.disponible ? "badge-success" : "badge-danger"}`}>
              {formData.disponible ? "Disponible" : "No disponible"}
            </span>
          </div>
        </div>

        {producto?.sena && (
          <div>
            <label className="form-label">Seña Asociada</label>
            <div className="mt-1 flex items-center gap-2">
              <span>{producto.sena.nombre}</span>
              {producto.sena.video && (
                <a
                  href={producto.sena.video}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-outline-primary"
                >
                  <i className="fas fa-play mr-1"></i>
                  Ver video
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-group">
          <label className="form-label">Nombre *</label>
          <input
            type="text"
            value={formData.nombre}
            onChange={(e) => handleChange("nombre", e.target.value)}
            className={`form-control ${errors.nombre ? "is-invalid" : ""}`}
            placeholder="Nombre del producto"
          />
          {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
        </div>

        <div className="form-group">
          <label className="form-label">Precio *</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.precio}
            onChange={(e) => handleChange("precio", e.target.value)}
            className={`form-control ${errors.precio ? "is-invalid" : ""}`}
            placeholder="0.00"
          />
          {errors.precio && <div className="invalid-feedback">{errors.precio}</div>}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Descripción *</label>
        <textarea
          value={formData.descripcion}
          onChange={(e) => handleChange("descripcion", e.target.value)}
          className={`form-control ${errors.descripcion ? "is-invalid" : ""}`}
          placeholder="Descripción del producto"
          rows={3}
        />
        {errors.descripcion && <div className="invalid-feedback">{errors.descripcion}</div>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-group">
          <label className="form-label">Categoría</label>
          <input
            type="text"
            value={formData.categoria}
            onChange={(e) => handleChange("categoria", e.target.value)}
            className="form-control"
            placeholder="Categoría del producto"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Código *</label>
          <input
            type="text"
            value={formData.codigo}
            onChange={(e) => handleChange("codigo", e.target.value)}
            className={`form-control ${errors.codigo ? "is-invalid" : ""}`}
            placeholder="Código único"
          />
          {errors.codigo && <div className="invalid-feedback">{errors.codigo}</div>}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Ingredientes</label>
        <textarea
          value={formData.ingredientes}
          onChange={(e) => handleChange("ingredientes", e.target.value)}
          className="form-control"
          placeholder="Lista de ingredientes"
          rows={2}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-group">
          <label className="form-label">Calorías</label>
          <input
            type="number"
            min="0"
            value={formData.calorias}
            onChange={(e) => handleChange("calorias", e.target.value)}
            className="form-control"
            placeholder="Calorías por porción"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Tiempo de Preparación (min)</label>
          <input
            type="number"
            min="0"
            value={formData.tiempoPreparacion}
            onChange={(e) => handleChange("tiempoPreparacion", e.target.value)}
            className="form-control"
            placeholder="Minutos"
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Seña Asociada</label>
        <select
          value={formData.idSena}
          onChange={(e) => handleChange("idSena", e.target.value)}
          className="form-control"
          disabled={loadingSenas}
        >
          <option value="">Sin seña asignada</option>
          {senas.map((sena) => (
            <option key={sena.id} value={sena.id}>
              {sena.nombre}
            </option>
          ))}
        </select>
        {loadingSenas && <small className="form-text text-muted">Cargando señas...</small>}
      </div>

      <div className="form-group">
        <label className="form-label">Imagen del Producto</label>
        <div className="upload-container">
          {formData.foto ? (
            <div className="image-preview-container">
              <img
                src={formData.foto || "/placeholder.svg"}
                alt="Preview"
                className="image-preview"
                style={{ maxHeight: "200px", maxWidth: "200px" }}
              />
              <button
                type="button"
                className="btn btn-sm btn-danger remove-image-btn"
                onClick={() => handleChange("foto", "")}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          ) : (
            <div className="upload-area">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="file-input"
                id="file-upload"
                disabled={uploading}
              />
              {uploading ? (
                <div className="upload-progress">
                  <div className="spinner-border spinner-border-sm text-primary mb-2"></div>
                  <div className="progress mb-2">
                    <div className="progress-bar" style={{ width: `${uploadProgress}%` }} />
                  </div>
                  <p className="text-muted">Subiendo... {uploadProgress}%</p>
                </div>
              ) : (
                <div className="upload-placeholder">
                  <i className="fas fa-cloud-upload-alt fa-2x text-muted mb-2"></i>
                  <label htmlFor="file-upload" className="btn btn-outline-primary">
                    Seleccionar imagen
                  </label>
                  <p className="text-muted mt-1">Máximo 5MB</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-group">
          <label className="form-label">Disponibilidad</label>
          <div className="form-check-container">
            <div className="form-check">
              <input
                type="radio"
                name="disponible"
                checked={formData.disponible === true}
                onChange={() => handleChange("disponible", true)}
                className="form-check-input"
                id="disponible-si"
              />
              <label className="form-check-label" htmlFor="disponible-si">
                Disponible
              </label>
            </div>
            <div className="form-check">
              <input
                type="radio"
                name="disponible"
                checked={formData.disponible === false}
                onChange={() => handleChange("disponible", false)}
                className="form-check-input"
                id="disponible-no"
              />
              <label className="form-check-label" htmlFor="disponible-no">
                No disponible
              </label>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Estado</label>
          <div className="form-check-container">
            <div className="form-check">
              <input
                type="radio"
                name="status"
                checked={formData.status === true}
                onChange={() => handleChange("status", true)}
                className="form-check-input"
                id="status-activo"
              />
              <label className="form-check-label" htmlFor="status-activo">
                Activo
              </label>
            </div>
            <div className="form-check">
              <input
                type="radio"
                name="status"
                checked={formData.status === false}
                onChange={() => handleChange("status", false)}
                className="form-check-input"
                id="status-inactivo"
              />
              <label className="form-check-label" htmlFor="status-inactivo">
                Inactivo
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" onClick={() => onSave(null)} className="btn btn-secondary">
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary">
          {producto ? "Actualizar" : "Crear"} Producto
        </button>
      </div>
    </form>
  )
}

export default ProductoForm
