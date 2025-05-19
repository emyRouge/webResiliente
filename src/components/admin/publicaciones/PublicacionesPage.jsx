"use client"

import { useState, useEffect } from "react"
import AlertContainer from "../common/AlertContainer"
import DeleteConfirmationModal from "../common/DeleteConfirmationModal"
import FormModal from "../common/FormModal"
import PublicacionForm from "./PublicacionForm"

const PublicacionesPage = () => {
  const [publicaciones, setPublicaciones] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedPublicacion, setSelectedPublicacion] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [alerts, setAlerts] = useState([])
  const [modalMode, setModalMode] = useState("create") // "create", "edit", "view"

  useEffect(() => {
    fetchPublicaciones()
  }, [])

  const fetchPublicaciones = async () => {
    setLoading(true)
    try {
      const response = await fetch("http://localhost:8080/publicaciones")
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }
      const data = await response.json()
      setPublicaciones(data.datos || [])
    } catch (error) {
      console.error("Error fetching publicaciones:", error)
      addAlert(`Error al cargar publicaciones: ${error.message}`, "danger")
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePublicacion = () => {
    setSelectedPublicacion(null)
    setModalMode("create")
    setIsModalOpen(true)
  }

  const handleEditPublicacion = (publicacion) => {
    setSelectedPublicacion(publicacion)
    setModalMode("edit")
    setIsModalOpen(true)
  }

  const handleViewPublicacion = (publicacion) => {
    setSelectedPublicacion(publicacion)
    setModalMode("view")
    setIsModalOpen(true)
  }

  const handleDeletePublicacion = (publicacion) => {
    setSelectedPublicacion(publicacion)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8080/publicaciones/${selectedPublicacion.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      setPublicaciones(publicaciones.filter((p) => p.id !== selectedPublicacion.id))
      addAlert("Publicación eliminada exitosamente", "success")
    } catch (error) {
      console.error("Error deleting publicacion:", error)
      addAlert(`Error al eliminar publicación: ${error.message}`, "danger")
    } finally {
      setIsDeleteModalOpen(false)
    }
  }

  const handleSavePublicacion = async (publicacionData) => {
    try {
      let url = "http://localhost:8080/publicaciones"
      let method = "POST"

      if (modalMode === "edit") {
        url += `/${selectedPublicacion.id}`
        method = "PUT"
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(publicacionData),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      fetchPublicaciones()
      setIsModalOpen(false)
      addAlert(
        modalMode === "create" ? "Publicación creada exitosamente" : "Publicación actualizada exitosamente",
        "success",
      )
    } catch (error) {
      console.error("Error saving publicacion:", error)
      addAlert(`Error al guardar publicación: ${error.message}`, "danger")
    }
  }

  const addAlert = (message, type) => {
    const id = Date.now()
    setAlerts((prevAlerts) => [...prevAlerts, { id, message, type }])
    setTimeout(() => {
      setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id))
    }, 5000)
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Publicaciones</h1>
        <button
          onClick={handleCreatePublicacion}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          <i className="fas fa-plus mr-2"></i> Nueva Publicación
        </button>
      </div>

      <AlertContainer alerts={alerts} />

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Lista de Publicaciones</h2>
          <button onClick={fetchPublicaciones} className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded">
            <i className="fas fa-sync-alt mr-2"></i> Actualizar
          </button>
        </div>
        <div className="p-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4">Cargando publicaciones...</p>
            </div>
          ) : publicaciones.length === 0 ? (
            <div className="text-center py-8">
              <i className="fas fa-newspaper text-4xl text-gray-300 mb-4"></i>
              <p>No hay publicaciones disponibles</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Imagen
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Título
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contenido
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {publicaciones.map((publicacion) => (
                    <tr key={publicacion.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {publicacion.imagen ? (
                          <img
                            src={
                              publicacion.imagen.startsWith("http")
                                ? publicacion.imagen
                                : `data:image/jpeg;base64,${publicacion.imagen}`
                            }
                            alt={publicacion.titulo}
                            className="h-12 w-12 object-cover rounded"
                          />
                        ) : (
                          <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center">
                            <i className="fas fa-image text-gray-400"></i>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{publicacion.titulo}</td>
                      <td className="px-6 py-4">
                        <div className="max-w-xs truncate">{publicacion.contenido}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{formatDate(publicacion.fechaPublicacion)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {publicacion.status ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Activo
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Inactivo
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewPublicacion(publicacion)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          <button
                            onClick={() => handleEditPublicacion(publicacion)}
                            className="text-yellow-600 hover:text-yellow-900"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            onClick={() => handleDeletePublicacion(publicacion)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          modalMode === "create" ? "Nueva Publicación" : modalMode === "edit" ? "Editar Publicación" : "Ver Publicación"
        }
      >
        <PublicacionForm
          publicacion={selectedPublicacion}
          onSave={handleSavePublicacion}
          readOnly={modalMode === "view"}
        />
      </FormModal>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmar Eliminación"
        message="¿Estás seguro de que deseas eliminar esta publicación? Esta acción no se puede deshacer."
      />
    </div>
  )
}

export default PublicacionesPage
