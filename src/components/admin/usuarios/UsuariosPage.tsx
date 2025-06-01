"use client"

import { useState, useEffect } from "react"
import { Users, Plus, List, Edit, Trash2 } from "lucide-react"
import { useApi } from "../../../context/ApiContext"
import AlertContainer from "../common/AlertContainer"
import DeleteConfirmationModal from "../common/DeleteConfirmationModal"
import FormModal from "../common/FormModal"
import UsuarioForm from "./UsuarioForm"

interface Usuario {
  id: number
  nombre: string
  apellido: string
  email: string
  rol?: { id: number; nombre: string }
  rolId?: number
  numeroEmpleado: number
  area: string
  status: boolean
}

interface Alert {
  id: number
  message: string
  type: "success" | "danger" | "warning" | "info"
}

const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(false)
  const { getUsuarios, deleteUsuario } = useApi()

  useEffect(() => {
    loadUsuarios()
  }, [])

  const loadUsuarios = async () => {
    setLoading(true)
    try {
      const response = await getUsuarios()
      if (response?.success) {
        setUsuarios(response.data || [])
      } else {
        addAlert(response?.message || "Error al cargar los usuarios.", "danger")
      }
    } catch (error) {
      addAlert("Error al conectar con el servidor", "danger")
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (usuario: Usuario | null = null) => {
    setSelectedUsuario(usuario)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedUsuario(null)
  }

  const handleDelete = (usuario: Usuario) => {
    setSelectedUsuario(usuario)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (selectedUsuario) {
      const response = await deleteUsuario(selectedUsuario.id)
      setIsDeleteModalOpen(false)
      if (response?.success) {
        addAlert("Usuario eliminado correctamente.", "success")
        loadUsuarios()
      } else {
        addAlert(response?.message || "Error al eliminar el usuario.", "danger")
      }
    }
  }

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setSelectedUsuario(null)
  }

  const addAlert = (message: string, type: "success" | "danger" | "warning" | "info") => {
    const id = Date.now()
    setAlerts((prevAlerts) => [...prevAlerts, { id, message, type }])
    setTimeout(() => {
      setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id))
    }, 5000)
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1 className="page-title flex items-center gap-3">
          <Users className="w-8 h-8" />
          Usuarios
        </h1>
        <button onClick={() => handleOpenModal()} className="btn btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nuevo Usuario
        </button>
      </div>

      <AlertContainer alerts={alerts} />

      <div className="card">
        <div className="card-header">
          <h2 className="card-title flex items-center gap-2">
            <List className="w-5 h-5" />
            Lista de Usuarios ({usuarios.length})
          </h2>
        </div>
        <div className="card-body p-0">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p className="loading-text">Cargando usuarios...</p>
            </div>
          ) : usuarios.length === 0 ? (
            <div className="empty-state">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3>No hay usuarios disponibles</h3>
              <p>Comienza agregando tu primer usuario</p>
              <button onClick={() => handleOpenModal()} className="btn btn-primary flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Crear Primer Usuario
              </button>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Número Empleado</th>
                    <th>Área</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((usuario) => (
                    <tr key={usuario.id}>
                      <td>{usuario.id}</td>
                      <td>{usuario.nombre}</td>
                      <td>{usuario.apellido}</td>
                      <td>{usuario.email}</td>
                      <td>{usuario.rol?.nombre || `ID: ${usuario.rol?.id || usuario.rolId}`}</td>
                      <td>{usuario.numeroEmpleado}</td>
                      <td>{usuario.area}</td>
                      <td>
                        <span className={`badge ${usuario.status ? "badge-success" : "badge-danger"}`}>
                          {usuario.status ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button
                            onClick={() => handleOpenModal(usuario)}
                            className="action-btn edit"
                            title="Editar usuario"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(usuario)}
                            className="action-btn delete"
                            title="Eliminar usuario"
                          >
                            <Trash2 className="w-4 h-4" />
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
        onClose={handleCloseModal}
        title={selectedUsuario ? "Editar Usuario" : "Nuevo Usuario"}
      >
        <UsuarioForm
          usuario={selectedUsuario}
          onSave={(data) => {
            if (data) {
              addAlert("Usuario guardado correctamente.", "success")
            }
            handleCloseModal()
            loadUsuarios()
          }}
          onCancel={handleCloseModal}
        />
      </FormModal>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={confirmDelete}
        title="Confirmar Eliminación"
        message={`¿Estás seguro de que deseas eliminar el usuario "${selectedUsuario?.nombre} ${selectedUsuario?.apellido}"? Esta acción no se puede deshacer.`}
        itemName={`${selectedUsuario?.nombre} ${selectedUsuario?.apellido}`}
      />
    </div>
  )
}

export default UsuariosPage
