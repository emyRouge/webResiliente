"use client"

import { useEffect, useState } from "react"

const FormModal = ({ isOpen, onClose, onSave, title, children, saveButtonText = "Guardar", formId }) => {
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async (e) => {
    e.preventDefault()

    // Check form validity
    const form = document.getElementById(formId)
    if (form && !form.checkValidity()) {
      form.reportValidity()
      return
    }

    setIsSaving(true)
    try {
      await onSave()
      onClose()
    } catch (error) {
      console.error("Error saving:", error)
    } finally {
      setIsSaving(false)
    }
  }

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="modal-overlay open">
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">{children}</div>
        <div className="modal-footer">
          <button className="btn btn-danger" onClick={onClose} disabled={isSaving}>
            Cancelar
          </button>
          <button className="btn btn-success" onClick={handleSave} disabled={isSaving}>
            {isSaving ? <span className="loading-spinner"></span> : <span>{saveButtonText}</span>}
          </button>
        </div>
      </div>
    </div>
  )
}

export default FormModal
