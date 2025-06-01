"use client"

import { useState } from "react"

const FileUploader = ({
  currentFile,
  onFileUploaded,
  accept = "image/*",
  maxSize = 5,
  label = "Seleccionar archivo",
  folder = "uploads",
}) => {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState("")

  const generateUniqueFileName = (originalName, folder) => {
    const timestamp = new Date().getTime()
    const randomString = Math.random().toString(36).substring(2, 15)
    const extension = originalName.split(".").pop()
    return `${folder}/${timestamp}-${randomString}.${extension}`
  }

  const uploadToWasabi = async (file) => {
    try {
      setUploading(true)
      setUploadProgress(0)
      setError("")

      const fileName = generateUniqueFileName(file.name, folder)
      const formData = new FormData()
      formData.append("file", file)
      formData.append("fileName", fileName)

      // Simular progreso
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 10
        })
      }, 200)

      const response = await fetch("http://localhost:8080/api/upload-to-wasabi", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (!response.ok) {
        throw new Error(`Error al subir archivo: ${response.status}`)
      }

      const result = await response.json()
      return result.fileUrl
    } catch (error) {
      console.error("Error uploading to Wasabi:", error)
      throw error
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError("")

    // Validar tipo de archivo
    if (accept !== "*/*" && !file.type.match(accept.replace("*", ".*"))) {
      setError(`Tipo de archivo no permitido. Se esperaba: ${accept}`)
      return
    }

    // Validar tamaño
    if (file.size > maxSize * 1024 * 1024) {
      setError(`El archivo es demasiado grande. Máximo ${maxSize}MB`)
      return
    }

    try {
      const fileUrl = await uploadToWasabi(file)
      onFileUploaded(fileUrl)
    } catch (error) {
      setError("Error al subir archivo")
    }
  }

  const removeFile = () => {
    onFileUploaded("")
  }

  const getFilePreview = () => {
    if (!currentFile) return null

    if (accept.includes("image/") && currentFile) {
      return (
        <div className="file-preview image-preview">
          <img
            src={currentFile || "/placeholder.svg"}
            alt="Preview"
            style={{ maxWidth: "200px", maxHeight: "200px", objectFit: "cover" }}
          />
          <button type="button" onClick={removeFile} className="btn btn-sm btn-danger remove-file-btn">
            <i className="fas fa-times"></i>
          </button>
        </div>
      )
    }

    if (accept.includes("video/") && currentFile) {
      return (
        <div className="file-preview video-preview">
          <div className="file-info">
            <i className="fas fa-video fa-2x text-primary"></i>
            <span>Video subido</span>
            <button type="button" onClick={removeFile} className="btn btn-sm btn-danger">
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
      )
    }

    return (
      <div className="file-preview generic-preview">
        <div className="file-info">
          <i className="fas fa-file fa-2x text-secondary"></i>
          <span>Archivo subido</span>
          <button type="button" onClick={removeFile} className="btn btn-sm btn-danger">
            <i className="fas fa-times"></i>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="file-uploader">
      {error && (
        <div className="alert alert-danger mb-3">
          <i className="fas fa-exclamation-circle mr-2"></i>
          {error}
        </div>
      )}

      {getFilePreview()}

      {!currentFile && (
        <div className="upload-area">
          <input
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            className="file-input"
            id="file-upload"
            disabled={uploading}
          />

          {uploading ? (
            <div className="upload-progress">
              <div className="spinner-border spinner-border-sm text-primary mb-2"></div>
              <div className="progress mb-2">
                <div className="progress-bar bg-primary" style={{ width: `${uploadProgress}%` }} />
              </div>
              <p className="text-muted">Subiendo... {uploadProgress}%</p>
            </div>
          ) : (
            <div className="upload-placeholder">
              <i className="fas fa-cloud-upload-alt fa-2x text-muted mb-2"></i>
              <label htmlFor="file-upload" className="btn btn-outline-primary">
                {label}
              </label>
              <p className="text-muted mt-1">Máximo {maxSize}MB</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default FileUploader
