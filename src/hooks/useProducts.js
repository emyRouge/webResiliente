import { useState, useEffect, useCallback } from "react"
import { useApi } from "../context/ApiContext"
import { MOCK_PRODUCTS } from "../data/mockData"

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

  const loadProducts = useCallback(async () => {
    setLoading(true)
    try {
      const result = await getProducts()
      if (result.success) {
        const data = result.data || []
        setProducts(data)
        setFilteredProducts(data)
        setTotalPages(Math.ceil(data.length / itemsPerPage))
      } else {
        setProducts(MOCK_PRODUCTS)
        setFilteredProducts(MOCK_PRODUCTS)
        setTotalPages(Math.ceil(MOCK_PRODUCTS.length / itemsPerPage))
      }
    } catch {
      setProducts(MOCK_PRODUCTS)
      setFilteredProducts(MOCK_PRODUCTS)
      setTotalPages(Math.ceil(MOCK_PRODUCTS.length / itemsPerPage))
    } finally {
      setLoading(false)
    }
  }, [getProducts])

  const loadProductDetails = useCallback(async (id) => {
    try {
      const result = await getProduct(id)
      if (result.success) {
        setSelectedProduct(result.data)
        setIsModalOpen(true)
      } else {
        const mock = MOCK_PRODUCTS.find((p) => p.id === id)
        if (mock) {
          setSelectedProduct(mock)
          setIsModalOpen(true)
        }
      }
    } catch {
      const mock = MOCK_PRODUCTS.find((p) => p.id === id)
      if (mock) {
        setSelectedProduct(mock)
        setIsModalOpen(true)
      }
    }
  }, [getProduct])

  const filterProducts = useCallback(({ category, priceRange, searchTerm }) => {
    let filtered = [...products]

    if (category) {
      filtered = filtered.filter(
        (p) => p.categoria && p.categoria.toLowerCase() === category.toLowerCase(),
      )
    }

    if (priceRange) {
      const [min, max] = priceRange.split("-")
      if (min && max) {
        filtered = filtered.filter((p) => p.precio >= Number(min) && p.precio <= Number(max))
      } else if (min) {
        filtered = filtered.filter((p) => p.precio >= Number(min))
      }
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.nombre.toLowerCase().includes(term) ||
          p.descripcion.toLowerCase().includes(term) ||
          (p.categoria && p.categoria.toLowerCase().includes(term)),
      )
    }

    setFilteredProducts(filtered)
    setTotalPages(Math.ceil(filtered.length / itemsPerPage))
    setCurrentPage(1)
  }, [products])

  const getCurrentPageProducts = useCallback(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredProducts.slice(start, start + itemsPerPage)
  }, [filteredProducts, currentPage])

  const changePage = (page) => setCurrentPage(page)

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
