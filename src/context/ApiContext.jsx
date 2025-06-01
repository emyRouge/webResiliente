"use client"

import { createContext, useContext } from "react"

const ApiContext = createContext()

export const useApi = () => {
  return useContext(ApiContext)
}

export const ApiProvider = ({ children }) => {
  const API_BASE_URL = "http://localhost:8080"

  // Función genérica para hacer peticiones a la API
  const fetchData = async (endpoint, options = {}) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, options)

      const contentType = response.headers.get("content-type")
      if (contentType && contentType.indexOf("application/json") === -1) {
        throw new Error("La respuesta no es JSON. Posiblemente se recibió HTML de error.")
      }

      const data = await response.json()

      if (data.tipo === "SUCCESS") {
        return { success: true, data: data.datos }
      } else {
        return { success: false, message: data.mensaje || "Error en la petición" }
      }
    } catch (error) {
      console.error("Error en la petición:", error)
      return { success: false, message: "Error al conectar con el servidor" }
    }
  }

  // Función para subir archivos a Wasabi
  const uploadFileToWasabi = async (file, folder = "uploads") => {
    try {
      const timestamp = new Date().getTime()
      const randomString = Math.random().toString(36).substring(2, 15)
      const extension = file.name.split(".").pop()
      const fileName = `${folder}/${timestamp}-${randomString}.${extension}`

      const formData = new FormData()
      formData.append("file", file)
      formData.append("fileName", fileName)

      const response = await fetch(`${API_BASE_URL}/api/upload-to-wasabi`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Error al subir archivo")
      }

      const result = await response.json()
      return { success: true, fileUrl: result.fileUrl }
    } catch (error) {
      console.error("Error uploading file:", error)
      return { success: false, message: error.message }
    }
  }

  // Función para eliminar archivos de Wasabi
  const deleteFileFromWasabi = async (fileName) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/delete-from-wasabi`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName }),
      })

      if (!response.ok) {
        throw new Error("Error al eliminar archivo")
      }

      const result = await response.json()
      return { success: true, message: result.message }
    } catch (error) {
      console.error("Error deleting file:", error)
      return { success: false, message: error.message }
    }
  }

  // Función para obtener URL de archivo a través del backend
  const getFileUrl = (fileName) => {
    if (!fileName) return null

    // Si ya es una URL completa, devolverla tal como está
    if (fileName.startsWith("http")) {
      return fileName
    }

    // Si es solo el nombre del archivo, construir la URL del proxy
    return `${API_BASE_URL}/api/files/cafe2/${fileName}`
  }

  // Funciones para productos
  const getProducts = () => fetchData("/productos")
  const getProduct = (id) => fetchData(`/productos/${id}`)
  const createProduct = (productData) =>
    fetchData("/productos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    })
  const updateProduct = (id, productData) =>
    fetchData(`/productos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    })
  const deleteProduct = (id) => fetchData(`/productos/${id}`, { method: "DELETE" })
  const getProductsBySena = (idSena) => fetchData(`/productos/sena/${idSena}`)
  const assignSenaToProduct = (idProducto, idSena) =>
    fetchData(`/productos/${idProducto}/sena/${idSena}`, { method: "PATCH" })
  const removeSenaFromProduct = (idProducto) => fetchData(`/productos/${idProducto}/sena`, { method: "DELETE" })

  // Funciones para señas
  const getSenas = () => fetchData("/senas")
  const getSena = (id) => fetchData(`/senas/${id}`)
  const createSena = (senaData) =>
    fetchData("/senas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(senaData),
    })
  const updateSena = (id, senaData) =>
    fetchData(`/senas/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(senaData),
    })
  const deleteSena = (id) => fetchData(`/senas/${id}`, { method: "DELETE" })

  // Funciones para meseros
  const getMeseros = () => fetchData("/meseros")
  const getMesero = (id) => fetchData(`/meseros/${id}`)
  const createMesero = (meseroData) =>
    fetchData("/meseros", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(meseroData),
    })
  const updateMesero = (id, meseroData) =>
    fetchData(`/meseros/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(meseroData),
    })
  const deleteMesero = (id) => fetchData(`/meseros/${id}`, { method: "DELETE" })

  // Funciones para productos tienda
  const getProductosTienda = () => fetchData("/productos-tienda")
  const getProductoTienda = (id) => fetchData(`/productos-tienda/${id}`)
  const createProductoTienda = (productoTiendaData) =>
    fetchData("/productos-tienda", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productoTiendaData),
    })
  const updateProductoTienda = (id, productoTiendaData) =>
    fetchData(`/productos-tienda/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productoTiendaData),
    })
  const deleteProductoTienda = (id) => fetchData(`/productos-tienda/${id}`, { method: "DELETE" })

  // Funciones para usuarios
  const getUsuarios = () => fetchData("/usuarios")
  const getUsuario = (id) => fetchData(`/usuarios/${id}`)
  const createUsuario = (usuarioData) =>
    fetchData("/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuarioData),
    })
  const updateUsuario = (id, usuarioData) =>
    fetchData(`/usuarios/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuarioData),
    })
  const deleteUsuario = (id) => fetchData(`/usuarios/${id}`, { method: "DELETE" })

  // Funciones para condiciones
  const getCondiciones = () => fetchData("/condiciones")
  const getCondicion = (id) => fetchData(`/condiciones/${id}`)
  const createCondicion = (condicionData) =>
    fetchData("/condiciones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(condicionData),
    })
  const updateCondicion = (id, condicionData) =>
    fetchData(`/condiciones/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(condicionData),
    })
  const deleteCondicion = (id) => fetchData(`/condiciones/${id}`, { method: "DELETE" })

  // Funciones para publicaciones
  const getPosts = () => fetchData("/publicaciones")
  const getPost = (id) => fetchData(`/publicaciones/${id}`)
  const createPost = (postData) =>
    fetchData("/publicaciones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postData),
    })
  const updatePost = (id, postData) =>
    fetchData(`/publicaciones/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postData),
    })
  const deletePost = (id) => fetchData(`/publicaciones/${id}`, { method: "DELETE" })

  // Funciones para talleres
  const getWorkshops = () => fetchData("/talleres")
  const getWorkshop = (id) => fetchData(`/talleres/${id}`)
  const createWorkshop = (workshopData) =>
    fetchData("/talleres", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(workshopData),
    })
  const updateWorkshop = (id, workshopData) =>
    fetchData(`/talleres/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(workshopData),
    })
  const deleteWorkshop = (id) => fetchData(`/talleres/${id}`, { method: "DELETE" })

  const value = {
    API_BASE_URL,
    // Funciones de archivos
    uploadFileToWasabi,
    deleteFileFromWasabi,
    getFileUrl,
    // Productos
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductsBySena,
    assignSenaToProduct,
    removeSenaFromProduct,
    // Señas
    getSenas,
    getSena,
    createSena,
    updateSena,
    deleteSena,
    // Meseros
    getMeseros,
    getMesero,
    createMesero,
    updateMesero,
    deleteMesero,
    // Productos Tienda
    getProductosTienda,
    getProductoTienda,
    createProductoTienda,
    updateProductoTienda,
    deleteProductoTienda,
    // Usuarios
    getUsuarios,
    getUsuario,
    createUsuario,
    updateUsuario,
    deleteUsuario,
    // Condiciones
    getCondiciones,
    getCondicion,
    createCondicion,
    updateCondicion,
    deleteCondicion,
    // Publicaciones
    getPosts,
    getPost,
    createPost,
    updatePost,
    deletePost,
    // Talleres
    getWorkshops,
    getWorkshop,
    createWorkshop,
    updateWorkshop,
    deleteWorkshop,
  }

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>
}
