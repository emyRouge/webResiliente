"use client"

import { useState, useEffect } from "react"
import { useApi } from "../../../context/ApiContext"
import FileUploader from "../common/FileUploader"

const ProductoTiendaForm = ({ productoTienda, onSave, onCancel }) => {
  const { createProductoTienda, updateProductoTienda } = useApi()
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    categoria: "",
    imagen: "",
    descuento: "0",
    caracteristicas: "",
    stock: "",
    peso: "",
    dimensiones: "",
    status: true,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (productoTienda) {
      setFormData({
        nombre: productoTienda.nombre || "",
        descripcion: productoTienda.descripcion || "",
        precio: productoTienda.precio || "",
        categoria: productoTienda.categoria || "",
        imagen: productoTienda.imagen || "",
        descuento: productoTienda.descuento || "0",
        caracteristicas: productoTienda.caracteristicas || "",
        stock: productoTienda.stock || "",
        peso: productoTienda.peso || "",
        dimensiones: productoTienda.dimensiones || "",
        status: productoTienda.status !== undefined ? productoTienda.status : true,
      })
    }
  }, [productoTienda])

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
        precio: Number.parseFloat(formData.precio),
        descuento: Number.parseFloat(formData.descuento),
        stock: formData.stock ? Number.parseInt(formData.stock) : 0,
        peso: formData.peso ? Number.parseFloat(formData.peso) : null,
      }

      let response
      if (productoTienda) {
        response = await updateProductoTienda(productoTienda.id, dataToSubmit)
      } else {
        response = await createProductoTienda(dataToSubmit)
      }

      if (response.success) {
        onSave(response.data)
      } else {
        setError(response.message || "Error al guardar el producto")
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
          placeholder="Nombre del producto"
        />
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
          placeholder="Descripción del producto"
        ></textarea>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="form-group">
          <label className="form-label">Precio *</label>
          <input
            type="number"
            name="precio"
            value={formData.precio}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="form-control"
            placeholder="0.00"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Stock</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            min="0"
            className="form-control"
            placeholder="Cantidad disponible"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Descuento (%)</label>
          <input
            type="number"
            name="descuento"
            value={formData.descuento}
            onChange={handleChange}
            min="0"
            max="100"
            step="0.01"
            className="form-control"
            placeholder="0"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-group">
          <label className="form-label">Categoría</label>
          <input
            type="text"
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            className="form-control"
            placeholder="Categoría del producto"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Peso (kg)</label>
          <input
            type="number"
            name="peso"
            value={formData.peso}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="form-control"
            placeholder="Peso en kilogramos"
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Dimensiones</label>
        <input
          type="text"
          name="dimensiones"
          value={formData.dimensiones}
          onChange={handleChange}
          className="form-control"
          placeholder="Ej: 20cm x 15cm x 10cm"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Características</label>
        <textarea
          name="caracteristicas"
          value={formData.caracteristicas}
          onChange={handleChange}
          rows="3"
          className="form-control"
          placeholder="Características especiales del producto"
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

export default ProductoTiendaForm
