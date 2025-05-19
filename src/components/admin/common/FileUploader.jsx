"use client"

import { useState } from "react"

const FileUploader = ({ onFileUploaded, acceptTypes = "image/*", previewType = "image" }) => {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [previewUrl, setPreviewUrl] = useState(null)

  const generateUniqueFileName = (originalName) => {
    const timestamp = new Date().getTime()
    const randomString = Math.random().toString(36).substring(2, 15)
    const extension = originalName.split(".").pop()
    return `${timestamp}-${randomString}.${extension}`
  }

  const uploadToWasabi = async (file) => {
    setUploading(true)
    setProgress(0)

    try {
      // Generate unique filename
      const fileName = generateUniqueFileName(file.name)

      // Create FormData
      const formData = new FormData()
      formData.append("file", file)
      formData.append("fileName", fileName)

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress((prevProgress) => {
          const newProgress = prevProgress + 5
          return newProgress <= 90 ? newProgress : prevProgress
        })
      }, 200)

      // Upload file
      const response = await fetch("http://localhost:8080/api/upload-to-wasabi", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)

      if (!response.ok) {
        throw new Error(`Error al subir archivo: ${response.status}`)
      }

      const result = await response.json()
      setProgress(100)

      // Create preview
      if (file.type.startsWith("image/")) {
        setPreviewUrl(URL.createObjectURL(file))
      } else if (file.type.startsWith("video/")) {
        setPreviewUrl(URL.createObjectURL(file))
      }

      // Call callback with file URL
      onFileUploaded(result.fileUrl)

      // Hide progress bar after a moment
      setTimeout(() => {
        setUploading(false)
      }, 1000)

      return result.fileUrl
    } catch (error) {
      console.error("Error uploading file:", error)
      setUploading(false)
      throw error
    }
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      // Show preview before upload
      if (file.type.startsWith("image/")) {
        setPreviewUrl(URL.createObjectURL(file))
      } else if (file.type.startsWith("video/")) {
        setPreviewUrl(URL.createObjectURL(file))
      }

      // Upload file
      await uploadToWasabi(file)
    } catch (error) {
      console.error("Error handling file:", error)
    }
  }

  return (
    <div className="file-upload-container">
      <div className="file-upload">
        <label className="file-upload-label">
          <i className="fas fa-cloud-upload-alt btn-icon"></i> Seleccionar{" "}
          {previewType === "image" ? "imagen" : "archivo"}
          <input type="file" className="file-upload-input" accept={acceptTypes} onChange={handleFileChange} />
        </label>
      </div>

      {uploading && (
        <div id="uploadProgress" style={{ marginTop: "10px" }}>
          <div
            className="progress"
            style={{ height: "10px", backgroundColor: "#f0f0f0", borderRadius: "5px", overflow: "hidden" }}
          >
            <div
              id="progressBar"
              style={{
                height: "100%",
                width: `${progress}%`,
                backgroundColor: "#4CAF50",
                transition: "width 0.3s",
              }}
            ></div>
          </div>
          <p id="progressText" style={{ textAlign: "center", marginTop: "5px", fontSize: "0.9rem" }}>
            {progress}%
          </p>
        </div>
      )}

      <div className="file-preview">
        {previewUrl && previewType === "image" && (
          <img
            src={previewUrl || "/placeholder.svg"}
            alt="Vista previa"
            style={{ maxWidth: "100%", maxHeight: "200px" }}
          />
        )}
        {previewUrl && previewType === "video" && (
          <video src={previewUrl} controls style={{ maxWidth: "100%", maxHeight: "200px" }} />
        )}
      </div>
    </div>
  )
}

export default FileUploader
