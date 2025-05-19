"use client"

import { useEffect, useState } from "react"

const Alert = ({ message, type = "info", duration = 5000, onClose }) => {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      if (onClose) onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  if (!visible) return null

  let icon
  switch (type) {
    case "success":
      icon = "check-circle"
      break
    case "danger":
      icon = "exclamation-circle"
      break
    case "warning":
      icon = "exclamation-triangle"
      break
    default:
      icon = "info-circle"
  }

  return (
    <div className={`alert alert-${type}`}>
      <i className={`fas fa-${icon}`}></i>
      <span dangerouslySetInnerHTML={{ __html: message }}></span>
      <button
        type="button"
        className="close-alert"
        onClick={() => {
          setVisible(false)
          if (onClose) onClose()
        }}
      >
        &times;
      </button>
    </div>
  )
}

export default Alert
