"use client"

import { useState, useEffect } from "react"
import FileUploader from "../common/FileUploader"

const MeseroForm = ({ mesero, condiciones, onSave, readOnly }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    edad: "",
    condicionId: "",
    presentacion: "",
    foto: "",
    status: true,
  })

  useEffect(() => {
    if (mesero) {
      setFormData({
        nombre: mesero.nombre || "",
        edad: mesero.edad || "",
        condicionId: mesero.condicion ? mesero.condicion.id : "",
        presentacion: mesero.presentacion || "",
        foto: mesero.foto || "",
        status: mesero.status !== undefined ? mesero.status : true,
      })
    }
  }, [mesero])

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

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre *</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            disabled={readOnly}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Edad *</label>
          <input
            type="number"
            name="edad"
            value={formData.edad}
            onChange={handleChange}
            disabled={readOnly}
            required
            min="18"
            max="70"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Condición *</label>
        <select
          name="condicionId"
          value={formData.condicionId}
          onChange={handleChange}
          disabled={readOnly}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Seleccionar condición</option>
          {condiciones.map((condicion) => (
            <option key={condicion.id} value={condicion.id}>
              {condicion.nombre}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Presentación *</label>
        <textarea
          name="presentacion"
          value={formData.presentacion}
          onChange={handleChange}
          disabled={readOnly}
          required
          rows="4"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        ></textarea>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Foto del Mesero</label>
        {readOnly ? (
          formData.foto ? (
            <div className="mt-2">
              <img
                src={formData.foto.startsWith("http") ? formData.foto : `data:image/jpeg;base64,${formData.foto}`}
                alt="Vista previa"
                className="max-h-40 rounded-full"
              />
            </div>
          ) : (
            <p className="mt-2 text-sm text-gray-500">Sin foto</p>
          )
        ) : (
          <FileUploader currentFile={formData.foto} onFileUploaded={handleFileUpload} accept="image/*" />
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

export default MeseroForm
