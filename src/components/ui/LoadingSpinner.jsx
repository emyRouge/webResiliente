import "./LoadingSpinner.css"

const LoadingSpinner = ({ fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div className="page-loader">
        <div className="page-loader-brand">Resiliente</div>
        <div className="page-loader-spinner"></div>
      </div>
    )
  }

  return (
    <div className="loading">
      <div className="spinner"></div>
      <p>Cargando...</p>
    </div>
  )
}

export default LoadingSpinner
