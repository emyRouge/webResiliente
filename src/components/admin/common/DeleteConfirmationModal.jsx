"use client"

import { useState } from "react"

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmar Eliminación",
  message = "¿Estás seguro de que deseas eliminar este elemento? Esta acción no se puede deshacer.",
}) => {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleConfirm = async () => {
    setIsDeleting(true)
    try {
      await onConfirm()
    } catch (error) {
      console.error("Error during deletion:", error)
    } finally {
      setIsDeleting(false)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay open">
      <div className="modal" style={{ maxWidth: "400px" }}>
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <p>{message}</p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-primary" onClick={onClose} disabled={isDeleting}>
            Cancelar
          </button>
          <button className="btn btn-danger" onClick={handleConfirm} disabled={isDeleting}>
            {isDeleting ? (
              <span className="loading-spinner"></span>
            ) : (
              <>
                <i className="fas fa-trash-alt btn-icon"></i> Eliminar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirmationModal
