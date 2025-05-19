"use client"

import { useState, useEffect } from "react"
import AlertContainer from "../common/AlertContainer"
import DeleteConfirmationModal from "../common/DeleteConfirmationModal"
import FormModal from "../common/FormModal"
import MeseroForm from "./MeseroForm"

const MeserosPage = () => {
  const [meseros, setMeseros] = useState([])
  const [condiciones, setCondiciones] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedMesero, setSelectedMesero] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [alerts, setAlerts] = useState([])
  const [modalMode, setModalMode] = useState("create") // "create", "edit", "view"
  const [condicionFilter, setCondicionFilter] = useState("")

  useEffect(() => {
    fetchCondiciones()
    fetchMeseros()
  }, [])

  useEffect(() => {
    if (condicionFilter) {
      fetchMeserosByCondicion(condicionFilter)
    } else {
      fetchMeseros()
    }
  }, [condicionFilter])

  const fetchCondiciones = async () => {
    try {
      const response = await fetch("http://localhost:8080/condiciones")
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }
      const data = await response.json()
      setCondiciones(data.datos || [])
    } catch (error) {
      console.error("Error fetching condiciones:", error)
      addAlert(`Error al cargar condiciones: ${error.message}`, "danger")
    }
  }

  const fetchMeseros = async () => {
    setLoading(true)
    try {
      const response = await fetch("http://localhost:8080/meseros")
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }
      const data = await response.json()
      setMeseros(data.datos || [])
    } catch (error) {
      console.error("Error fetching meseros:", error)
      addAlert(`Error al cargar meseros: ${error.message}`, "danger")
    } finally {
      setLoading(false)
    }
  }

  const fetchMeserosByCondicion = async (condicionId) => {
    setLoading(true)
    try {
      const response = await fetch(`http://localhost:8080/meseros/condicion/${condicionId}`)
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }
      const data = await response.json()
      setMeseros(data.datos || [])
    } catch (error) {
      console.error("Error fetching meseros by condicion:", error)
      addAlert(`Error al filtrar meseros: ${error.message}`, "danger")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateMesero = () => {
    setSelectedMesero(null)
    setModalMode("create")
    setIsModalOpen(true)
  }

  const handleEditMesero = (mesero) => {
    setSelectedMesero(mesero)
    setModalMode("edit")
    setIsModalOpen(true)
  }

  const handleViewMesero = (mesero) => {
    setSelectedMesero(mesero)
    setModalMode("view")
    setIsModalOpen(true)
  }

  const handleDeleteMesero = (mesero) => {
    setSelectedMesero(mesero)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8080/meseros/${selectedMesero.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      setMeseros(meseros.filter((m) => m.id !== selectedMesero.id))
      addAlert("Mesero eliminado exitosamente", "success")
    } catch (error) {
      console.error("Error deleting mesero:", error)
      addAlert(`Error al eliminar mesero: ${error.message}`, "danger")
    } finally {
      setIsDeleteModalOpen(false)
    }
  }

  const handleSaveMesero = async (meseroData) => {
    try {
      let url = "http://localhost:8080/meseros"
      let method = "POST"

      if (modalMode === "edit") {
        url += `/${selectedMesero.id}`
        method = "PUT"
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(meseroData),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      if (condicionFilter) {
        fetchMeserosByCondicion(condicionFilter)
      } else {
        fetchMeseros()
      }

      setIsModalOpen(false)
      addAlert(modalMode === "create" ? "Mesero creado exitosamente" : "Mesero actualizado exitosamente", "success")
    } catch (error) {
      console.error("Error saving mesero:", error)
      addAlert(`Error al guardar mesero: ${error.message}`, "danger")
    }
  }

  const handleFilterChange = (e) => {
    setCondicionFilter(e.target.value)
  }

  const addAlert = (message, type) => {
    const id = Date.now()
    setAlerts((prevAlerts) => [...prevAlerts, { id, message, type }])
    setTimeout(() => {
      setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id))
    }, 5000)
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Meseros</h1>
        <button onClick={handleCreateMesero} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
          <i className="fas fa-plus mr-2"></i> Nuevo Mesero
        </button>
      </div>

      <AlertContainer alerts={alerts} />

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Lista de Meseros</h2>
          <div className="flex items-center space-x-2">
            <select
              value={condicionFilter}
              onChange={handleFilterChange}
              className="rounded border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Todas las condiciones</option>
              {condiciones.map((condicion) => (
                <option key={condicion.id} value={condicion.id}>
                  {condicion.nombre}
                </option>
              ))}
            </select>
            <button
              onClick={() => {
                setCondicionFilter("")
                fetchMeseros()
              }}
              className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
            >
              <i className="fas fa-sync-alt mr-2"></i> Actualizar
            </button>
          </div>
        </div>
        <div className="p-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4">Cargando meseros...</p>
            </div>
          ) : meseros.length === 0 ? (
            <div className="text-center py-8">
              <i className="fas fa-user-tie text-4xl text-gray-300 mb-4"></i>
              <p>No hay meseros disponibles</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Foto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Edad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Condición
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Presentación
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
                  {meseros.map((mesero) => (
                    <tr key={mesero.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {mesero.foto ? (
                          <img
                            src={mesero.foto.startsWith("http") ? mesero.foto : `data:image/jpeg;base64,${mesero.foto}`}
                            alt={mesero.nombre}
                            className="h-12 w-12 object-cover rounded-full"
                          />
                        ) : (
                          <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
                            <i className="fas fa-user text-gray-400"></i>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{mesero.nombre}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{mesero.edad} años</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {mesero.condicion ? mesero.condicion.nombre : "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-xs truncate">{mesero.presentacion || "Sin presentación"}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {mesero.status ? (
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
                            onClick={() => handleViewMesero(mesero)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          <button
                            onClick={() => handleEditMesero(mesero)}
                            className="text-yellow-600 hover:text-yellow-900"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            onClick={() => handleDeleteMesero(mesero)}
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
        title={modalMode === "create" ? "Nuevo Mesero" : modalMode === "edit" ? "Editar Mesero" : "Ver Mesero"}
      >
        <MeseroForm
          mesero={selectedMesero}
          condiciones={condiciones}
          onSave={handleSaveMesero}
          readOnly={modalMode === "view"}
        />
      </FormModal>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmar Eliminación"
        message="¿Estás seguro de que deseas eliminar este mesero? Esta acción no se puede deshacer."
      />
    </div>
  )
}

export default MeserosPage
