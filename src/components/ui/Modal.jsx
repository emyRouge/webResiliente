"use client"

import { useEffect } from "react"
import "./Modal.css"

const Modal = ({ isOpen, onClose, children, title, size = "lg" }) => {
  useEffect(() => {
    if (isOpen) {
      // Prevenir scroll del body cuando el modal está abierto
      document.body.style.overflow = "hidden"

      // Enfocar el modal para accesibilidad
      const modal = document.querySelector(".modal")
      if (modal) {
        modal.focus()
      }
    } else {
      // Restaurar scroll del body
      document.body.style.overflow = "unset"
    }

    // Cleanup al desmontar
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className={`modal modal-${size}`} role="dialog" aria-modal="true" tabIndex={-1}>
        <div className="modal-header">
          {title && <h2 className="modal-title">{title}</h2>}
          <button type="button" className="modal-close" onClick={onClose} aria-label="Cerrar modal">
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  )
}

export default Modal
