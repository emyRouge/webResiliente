"use client"

import { useState, useEffect } from "react"
import FileUploader from "../common/FileUploader"

const PublicacionForm = ({ publicacion, onSave, readOnly }) => {
  const [formData, setFormData] = useState({
    titulo: "",
    contenido: "",
    imagen: "",
    status: true,
  })

  useEffect(() => {
    if (publicacion) {
      setFormData({
        titulo: publicacion.titulo || "",
        contenido: publicacion.contenido || "",
        imagen: publicacion.imagen || "",
        status: publicacion.status !== undefined ? publicacion.status : true,
      })
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

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Título *</label>
        <input
          type="text"
          name="titulo"
          value={formData.titulo}
          onChange={handleChange}
          disabled={readOnly}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Contenido *</label>
        <textarea
          name="contenido"
          value={formData.contenido}
          onChange={handleChange}
          disabled={readOnly}
          required
          rows="6"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        ></textarea>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Imagen de la Publicación</label>
        {readOnly ? (
          formData.imagen ? (
            <div className="mt-2">
              <img
                src={formData.imagen.startsWith("http") ? formData.imagen : `data:image/jpeg;base64,${formData.imagen}`}
                alt="Vista previa"
                className="max-h-40 rounded"
              />
            </div>
          ) : (
            <p className="mt-2 text-sm text-gray-500">Sin imagen</p>
          )
        ) : (
          <FileUploader currentFile={formData.imagen} onFileUploaded={handleFileUpload} accept="image/*" />
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Estado</label>
        <div className="mt-2">
          <label className="inline-flex items-center mr-4">
            <input
              type="radio"
              name="status"
              checked={formData.status === true}
              onChange={() => setFormData({ ...formData, status: true })}
              disabled={readOnly}
              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
            />
            <span className="ml-2">Activo</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="status"
              checked={formData.status === false}
              onChange={() => setFormData({ ...formData, status: false })}
              disabled={readOnly}
              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
            />
            <span className="ml-2">Inactivo</span>
          </label>
        </div>
      </div>

      {!readOnly && (
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => onSave(null)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Guardar
          </button>
        </div>
      )}
    </form>
  )
}

export default PublicacionForm
