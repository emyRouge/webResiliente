"use client"

import "./Pagination.css"

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null

  return (
    <div className="pagination">
      {currentPage > 1 && (
        <div className="pagination-item" onClick={() => onPageChange(currentPage - 1)}>
          <i className="fas fa-chevron-left"></i>
        </div>
      )}

      {[...Array(totalPages)].map((_, index) => {
        const pageNumber = index + 1
        return (
          <div
            key={pageNumber}
            className={`pagination-item ${pageNumber === currentPage ? "active" : ""}`}
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </div>
        )
      })}

      {currentPage < totalPages && (
        <div className="pagination-item" onClick={() => onPageChange(currentPage + 1)}>
          <i className="fas fa-chevron-right"></i>
        </div>
      )}
    </div>
  )
}

export default Pagination
