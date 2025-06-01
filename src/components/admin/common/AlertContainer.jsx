const AlertContainer = ({ alerts = [] }) => {
  if (!alerts.length) return null

  const getAlertIcon = (type) => {
    switch (type) {
      case "success":
        return "fas fa-check-circle"
      case "danger":
        return "fas fa-exclamation-circle"
      case "warning":
        return "fas fa-exclamation-triangle"
      case "info":
        return "fas fa-info-circle"
      default:
        return "fas fa-info-circle"
    }
  }

  return (
    <div className="alert-container mb-4">
      {alerts.map((alert) => (
        <div key={alert.id} className={`alert alert-${alert.type}`}>
          <i className={getAlertIcon(alert.type)}></i>
          {alert.message}
        </div>
      ))}
    </div>
  )
}

export default AlertContainer
