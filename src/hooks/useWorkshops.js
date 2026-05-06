import { useState, useEffect, useCallback } from "react"
import { useApi } from "../context/ApiContext"
import { MOCK_WORKSHOPS } from "../data/mockData"

export const useWorkshops = () => {
  const { getWorkshops, getWorkshop } = useApi()
  const [workshops, setWorkshops] = useState([])
  const [filteredWorkshops, setFilteredWorkshops] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedWorkshop, setSelectedWorkshop] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const itemsPerPage = 6

  const loadWorkshops = useCallback(async () => {
    setLoading(true)
    try {
      const result = await getWorkshops()
      if (result.success) {
        const data = result.data || []
        setWorkshops(data)
        setFilteredWorkshops(data)
        setTotalPages(Math.ceil(data.length / itemsPerPage))
      } else {
        setWorkshops(MOCK_WORKSHOPS)
        setFilteredWorkshops(MOCK_WORKSHOPS)
        setTotalPages(Math.ceil(MOCK_WORKSHOPS.length / itemsPerPage))
      }
    } catch {
      setWorkshops(MOCK_WORKSHOPS)
      setFilteredWorkshops(MOCK_WORKSHOPS)
      setTotalPages(Math.ceil(MOCK_WORKSHOPS.length / itemsPerPage))
    } finally {
      setLoading(false)
    }
  }, [getWorkshops])

  const loadWorkshopDetails = useCallback(async (id) => {
    try {
      const result = await getWorkshop(id)
      if (result.success) {
        setSelectedWorkshop(result.data)
        setIsModalOpen(true)
      } else {
        const mock = MOCK_WORKSHOPS.find((w) => w.id === id)
        if (mock) {
          setSelectedWorkshop(mock)
          setIsModalOpen(true)
        }
      }
    } catch {
      const mock = MOCK_WORKSHOPS.find((w) => w.id === id)
      if (mock) {
        setSelectedWorkshop(mock)
        setIsModalOpen(true)
      }
    }
  }, [getWorkshop])

  const filterWorkshops = useCallback(({ month, searchTerm }) => {
    let filtered = [...workshops]

    if (month) {
      filtered = filtered.filter((w) => {
        const mes = new Date(w.fechaInicio).getMonth() + 1
        return mes.toString() === month
      })
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (w) => w.nombre.toLowerCase().includes(term) || w.descripcion.toLowerCase().includes(term),
      )
    }

    setFilteredWorkshops(filtered)
    setTotalPages(Math.ceil(filtered.length / itemsPerPage))
    setCurrentPage(1)
  }, [workshops])

  const getCurrentPageWorkshops = useCallback(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredWorkshops.slice(start, start + itemsPerPage)
  }, [filteredWorkshops, currentPage])

  const changePage = (page) => setCurrentPage(page)

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedWorkshop(null)
  }

  useEffect(() => {
    loadWorkshops()
  }, [loadWorkshops])

  return {
    workshops: getCurrentPageWorkshops(),
    loading,
    error,
    currentPage,
    totalPages,
    selectedWorkshop,
    isModalOpen,
    loadWorkshopDetails,
    filterWorkshops,
    changePage,
    closeModal,
  }
}
