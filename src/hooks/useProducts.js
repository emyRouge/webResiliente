"use client"

import { useState, useEffect, useCallback } from "react"
import { useApi } from "../context/ApiContext"

export const useProducts = () => {
  const { getProducts, getProduct } = useApi()
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const itemsPerPage = 9

  // Cargar productos
  const loadProducts = useCallback(async () => {
    setLoading(true)
    try {
      const result = await getProducts()
      if (result.success) {
        setProducts(result.data || [])
        setFilteredProducts(result.data || [])
        setTotalPages(Math.ceil((result.data?.length || 0) / itemsPerPage))
      } else {
        setError(result.message)
      }
    } catch (err) {
      setError("Error al cargar los productos")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [getProducts])

  // Cargar un producto específico
  const loadProductDetails = useCallback(
    async (id) => {
      setLoading(true)
      try {
        const result = await getProduct(id)
        if (result.success) {
          setSelectedProduct(result.data)
          setIsModalOpen(true)
        } else {
          setError(result.message)
        }
      } catch (err) {
        setError("Error al cargar el detalle del producto")
        console.error(err)
      } finally {
        setLoading(false)
      }
    },
    [getProduct],
  )

  // Filtrar productos
  const filterProducts = useCallback(
    ({ category, priceRange, searchTerm }) => {
      let filtered = [...products]

      // Filtrar por categoría
      if (category) {
        filtered = filtered.filter(
          (product) => product.categoria && product.categoria.toLowerCase() === category.toLowerCase(),
        )
      }

      // Filtrar por rango de precio
      if (priceRange) {
        const [min, max] = priceRange.split("-")
        if (min && max) {
          filtered = filtered.filter(
            (product) => product.precio >= Number.parseInt(min) && product.precio <= Number.parseInt(max),
          )
        } else if (min) {
          filtered = filtered.filter((product) => product.precio >= Number.parseInt(min))
        }
      }

      // Filtrar por término de búsqueda
      if (searchTerm) {
        const term = searchTerm.toLowerCase()
        filtered = filtered.filter(
          (product) =>
            product.nombre.toLowerCase().includes(term) ||
            product.descripcion.toLowerCase().includes(term) ||
            (product.categoria && product.categoria.toLowerCase().includes(term)),
        )
      }

      setFilteredProducts(filtered)
      setTotalPages(Math.ceil(filtered.length / itemsPerPage))
      setCurrentPage(1)
    },
    [products],
  )

  // Obtener productos para la página actual
  const getCurrentPageProducts = useCallback(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredProducts.slice(startIndex, endIndex)
  }, [filteredProducts, currentPage, itemsPerPage])

  // Cambiar de página
  const changePage = (page) => {
    setCurrentPage(page)
  }

  // Cerrar modal
  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedProduct(null)
  }

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  return {
    products: getCurrentPageProducts(),
    loading,
    error,
    currentPage,
    totalPages,
    selectedProduct,
    isModalOpen,
    loadProductDetails,
    filterProducts,
    changePage,
    closeModal,
  }
}
