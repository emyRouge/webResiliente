import { createContext, useContext, useCallback, useMemo } from "react"

const ApiContext = createContext()

export const useApi = () => {
  return useContext(ApiContext)
}

export const ApiProvider = ({ children }) => {
  const API_BASE_URL = "http://localhost:8080"

  const fetchData = useCallback(async (endpoint, options = {}) => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 8000)
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        signal: controller.signal,
      })
      clearTimeout(timeoutId)

      const contentType = response.headers.get("content-type")
      if (contentType && contentType.indexOf("application/json") === -1) {
        throw new Error("La respuesta no es JSON.")
      }

      const data = await response.json()

      if (data.tipo === "SUCCESS") {
        return { success: true, data: data.datos }
      } else {
        return { success: false, message: data.mensaje || "Error en la petición" }
      }
    } catch (error) {
      clearTimeout(timeoutId)
      if (error.name === "AbortError") {
        return { success: false, message: "Tiempo de espera agotado. Verifica tu conexión." }
      }
      console.error("Error en la petición:", error)
      return { success: false, message: "Error al conectar con el servidor" }
    }
  }, [API_BASE_URL])

  const uploadFileToWasabi = useCallback(async (file, folder = "uploads") => {
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

      if (!response.ok) throw new Error("Error al subir archivo")

      const result = await response.json()
      return { success: true, fileUrl: result.fileUrl }
    } catch (error) {
      console.error("Error uploading file:", error)
      return { success: false, message: error.message }
    }
  }, [API_BASE_URL])

  const deleteFileFromWasabi = useCallback(async (fileName) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/delete-from-wasabi`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName }),
      })
      if (!response.ok) throw new Error("Error al eliminar archivo")
      const result = await response.json()
      return { success: true, message: result.message }
    } catch (error) {
      console.error("Error deleting file:", error)
      return { success: false, message: error.message }
    }
  }, [API_BASE_URL])

  const getFileUrl = useCallback((fileName) => {
    if (!fileName) return null
    if (fileName.startsWith("http")) return fileName
    return `${API_BASE_URL}/api/files/cafe2/${fileName}`
  }, [API_BASE_URL])

  // Productos
  const getProducts = useCallback(() => fetchData("/productos"), [fetchData])
  const getProduct = useCallback((id) => fetchData(`/productos/${id}`), [fetchData])
  const createProduct = useCallback((data) => fetchData("/productos", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }), [fetchData])
  const updateProduct = useCallback((id, data) => fetchData(`/productos/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }), [fetchData])
  const deleteProduct = useCallback((id) => fetchData(`/productos/${id}`, { method: "DELETE" }), [fetchData])
  const getProductsBySena = useCallback((idSena) => fetchData(`/productos/sena/${idSena}`), [fetchData])
  const assignSenaToProduct = useCallback((idProducto, idSena) => fetchData(`/productos/${idProducto}/sena/${idSena}`, { method: "PATCH" }), [fetchData])
  const removeSenaFromProduct = useCallback((idProducto) => fetchData(`/productos/${idProducto}/sena`, { method: "DELETE" }), [fetchData])

  // Señas
  const getSenas = useCallback(() => fetchData("/senas"), [fetchData])
  const getSena = useCallback((id) => fetchData(`/senas/${id}`), [fetchData])
  const createSena = useCallback((data) => fetchData("/senas", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }), [fetchData])
  const updateSena = useCallback((id, data) => fetchData(`/senas/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }), [fetchData])
  const deleteSena = useCallback((id) => fetchData(`/senas/${id}`, { method: "DELETE" }), [fetchData])

  // Meseros
  const getMeseros = useCallback(() => fetchData("/meseros"), [fetchData])
  const getMesero = useCallback((id) => fetchData(`/meseros/${id}`), [fetchData])
  const createMesero = useCallback((data) => fetchData("/meseros", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }), [fetchData])
  const updateMesero = useCallback((id, data) => fetchData(`/meseros/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }), [fetchData])
  const deleteMesero = useCallback((id) => fetchData(`/meseros/${id}`, { method: "DELETE" }), [fetchData])

  // Productos tienda
  const getProductosTienda = useCallback(() => fetchData("/productos-tienda"), [fetchData])
  const getProductoTienda = useCallback((id) => fetchData(`/productos-tienda/${id}`), [fetchData])
  const createProductoTienda = useCallback((data) => fetchData("/productos-tienda", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }), [fetchData])
  const updateProductoTienda = useCallback((id, data) => fetchData(`/productos-tienda/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }), [fetchData])
  const deleteProductoTienda = useCallback((id) => fetchData(`/productos-tienda/${id}`, { method: "DELETE" }), [fetchData])

  // Usuarios
  const getUsuarios = useCallback(() => fetchData("/usuarios"), [fetchData])
  const getUsuario = useCallback((id) => fetchData(`/usuarios/${id}`), [fetchData])
  const createUsuario = useCallback((data) => fetchData("/usuarios", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }), [fetchData])
  const updateUsuario = useCallback((id, data) => fetchData(`/usuarios/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }), [fetchData])
  const deleteUsuario = useCallback((id) => fetchData(`/usuarios/${id}`, { method: "DELETE" }), [fetchData])

  // Condiciones
  const getCondiciones = useCallback(() => fetchData("/condiciones"), [fetchData])
  const getCondicion = useCallback((id) => fetchData(`/condiciones/${id}`), [fetchData])
  const createCondicion = useCallback((data) => fetchData("/condiciones", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }), [fetchData])
  const updateCondicion = useCallback((id, data) => fetchData(`/condiciones/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }), [fetchData])
  const deleteCondicion = useCallback((id) => fetchData(`/condiciones/${id}`, { method: "DELETE" }), [fetchData])

  // Publicaciones
  const getPosts = useCallback(() => fetchData("/publicaciones"), [fetchData])
  const getPost = useCallback((id) => fetchData(`/publicaciones/${id}`), [fetchData])
  const createPost = useCallback((data) => fetchData("/publicaciones", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }), [fetchData])
  const updatePost = useCallback((id, data) => fetchData(`/publicaciones/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }), [fetchData])
  const deletePost = useCallback((id) => fetchData(`/publicaciones/${id}`, { method: "DELETE" }), [fetchData])

  // Talleres
  const getWorkshops = useCallback(() => fetchData("/talleres"), [fetchData])
  const getWorkshop = useCallback((id) => fetchData(`/talleres/${id}`), [fetchData])
  const createWorkshop = useCallback((data) => fetchData("/talleres", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }), [fetchData])
  const updateWorkshop = useCallback((id, data) => fetchData(`/talleres/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }), [fetchData])
  const deleteWorkshop = useCallback((id) => fetchData(`/talleres/${id}`, { method: "DELETE" }), [fetchData])

  const value = useMemo(() => ({
    API_BASE_URL,
    uploadFileToWasabi,
    deleteFileFromWasabi,
    getFileUrl,
    getProducts, getProduct, createProduct, updateProduct, deleteProduct,
    getProductsBySena, assignSenaToProduct, removeSenaFromProduct,
    getSenas, getSena, createSena, updateSena, deleteSena,
    getMeseros, getMesero, createMesero, updateMesero, deleteMesero,
    getProductosTienda, getProductoTienda, createProductoTienda, updateProductoTienda, deleteProductoTienda,
    getUsuarios, getUsuario, createUsuario, updateUsuario, deleteUsuario,
    getCondiciones, getCondicion, createCondicion, updateCondicion, deleteCondicion,
    getPosts, getPost, createPost, updatePost, deletePost,
    getWorkshops, getWorkshop, createWorkshop, updateWorkshop, deleteWorkshop,
  }), [
    API_BASE_URL,
    uploadFileToWasabi, deleteFileFromWasabi, getFileUrl,
    getProducts, getProduct, createProduct, updateProduct, deleteProduct,
    getProductsBySena, assignSenaToProduct, removeSenaFromProduct,
    getSenas, getSena, createSena, updateSena, deleteSena,
    getMeseros, getMesero, createMesero, updateMesero, deleteMesero,
    getProductosTienda, getProductoTienda, createProductoTienda, updateProductoTienda, deleteProductoTienda,
    getUsuarios, getUsuario, createUsuario, updateUsuario, deleteUsuario,
    getCondiciones, getCondicion, createCondicion, updateCondicion, deleteCondicion,
    getPosts, getPost, createPost, updatePost, deletePost,
    getWorkshops, getWorkshop, createWorkshop, updateWorkshop, deleteWorkshop,
  ])

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>
}
