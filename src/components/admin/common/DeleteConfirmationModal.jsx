"use client"

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, itemName }) => {
  if (!isOpen) return null

  return (
    <div className="modal-overlay open">
      <div className="modal max-w-md">
        <div className="modal-header">
          <h3 className="modal-title text-danger">
            <i className="fas fa-exclamation-triangle mr-2"></i>
            {title}
          </h3>
          <button onClick={onClose} className="modal-close">
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="modal-body">
          <div className="text-center mb-4">
            <div className="text-danger mb-3" style={{ fontSize: "3rem" }}>
              <i className="fas fa-trash-alt"></i>
            </div>
            <p className="mb-3">{message}</p>
            {itemName && (
              <div className="alert alert-warning">
                <strong>Elemento a eliminar:</strong> {itemName}
              </div>
            )}
          </div>
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-secondary">
            <i className="fas fa-times mr-2"></i>
            Cancelar
          </button>
          <button onClick={onConfirm} className="btn btn-danger">
            <i className="fas fa-trash-alt mr-2"></i>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirmationModal
