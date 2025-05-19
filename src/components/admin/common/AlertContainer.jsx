"use client"

import { useState, useEffect } from "react"
import Alert from "./Alert"

const AlertContainer = () => {
  const [alerts, setAlerts] = useState([])

  // Add a global event listener for showing alerts
  useEffect(() => {
    const showAlert = (event) => {
      const { message, type, duration } = event.detail

      const id = Date.now()
      setAlerts((prev) => [...prev, { id, message, type, duration }])
    }

    window.addEventListener("showAlert", showAlert)

    return () => {
      window.removeEventListener("showAlert", showAlert)
    }
  }, [])

  const removeAlert = (id) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id))
  }

  return (
    <div id="alertContainer">
      {alerts.map((alert) => (
        <Alert
          key={alert.id}
          message={alert.message}
          type={alert.type}
          duration={alert.duration}
          onClose={() => removeAlert(alert.id)}
        />
      ))}
    </div>
  )
}

// Helper function to show alerts from anywhere in the app
export const showAlert = (message, type = "info", duration = 5000) => {
  const event = new CustomEvent("showAlert", {
    detail: { message, type, duration },
  })
  window.dispatchEvent(event)
}

export default AlertContainer
