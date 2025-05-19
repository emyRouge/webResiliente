"use client"

import { createContext, useContext } from "react"

const ApiContext = createContext()

export const useApi = () => {
  return useContext(ApiContext)
}

export const ApiProvider = ({ children }) => {
  const API_BASE_URL = "http://localhost:8080"

  // Función para obtener URL a través del backend
  const getProxiedFileUrl = (wasabiUrl) => {
    // Extraer el nombre del archivo de la URL de Wasabi
    const fileName = wasabiUrl.split("/").pop()
    // Devolver URL a través del backend
    return `${API_BASE_URL}/api/files/cafe2/${fileName}`
  }

  // Función genérica para hacer peticiones a la API
  const fetchData = async (endpoint, options = {}) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, options)

      // Verificar si la respuesta es HTML en lugar de JSON
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

  // Funciones específicas para cada tipo de dato
  const getProducts = () => fetchData("/productos-tienda")
  const getProduct = (id) => fetchData(`/productos-tienda/${id}`)
  const getPosts = () => fetchData("/publicaciones")
  const getPost = (id) => fetchData(`/publicaciones/${id}`)
  const getWorkshops = () => fetchData("/talleres")
  const getWorkshop = (id) => fetchData(`/talleres/${id}`)

  const value = {
    API_BASE_URL,
    getProxiedFileUrl,
    getProducts,
    getProduct,
    getPosts,
    getPost,
    getWorkshops,
    getWorkshop,
  }

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>
}
