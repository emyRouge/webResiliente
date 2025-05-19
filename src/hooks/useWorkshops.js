"use client"

import { useState, useEffect, useCallback } from "react"
import { useApi } from "../context/ApiContext"

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

  // Cargar talleres
  const loadWorkshops = useCallback(async () => {
    setLoading(true)
    try {
      const result = await getWorkshops()
      if (result.success) {
        setWorkshops(result.data || [])
        setFilteredWorkshops(result.data || [])
        setTotalPages(Math.ceil((result.data?.length || 0) / itemsPerPage))
      } else {
        setError(result.message)
      }
    } catch (err) {
      setError("Error al cargar los talleres")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [getWorkshops])

  // Cargar un taller específico
  const loadWorkshopDetails = useCallback(
    async (id) => {
      setLoading(true)
      try {
        const result = await getWorkshop(id)
        if (result.success) {
          setSelectedWorkshop(result.data)
          setIsModalOpen(true)
        } else {
          setError(result.message)
        }
      } catch (err) {
        setError("Error al cargar el detalle del taller")
        console.error(err)
      } finally {
        setLoading(false)
      }
    },
    [getWorkshop],
  )

  // Filtrar talleres
  const filterWorkshops = useCallback(
    ({ month, searchTerm }) => {
      let filtered = [...workshops]

      // Filtrar por mes
      if (month) {
        filtered = filtered.filter((workshop) => {
          const fechaInicio = new Date(workshop.fechaInicio)
          const mes = fechaInicio.getMonth() + 1
          return mes.toString() === month
        })
      }

      // Filtrar por término de búsqueda
      if (searchTerm) {
        const term = searchTerm.toLowerCase()
        filtered = filtered.filter(
          (workshop) =>
            workshop.nombre.toLowerCase().includes(term) || workshop.descripcion.toLowerCase().includes(term),
        )
      }

      setFilteredWorkshops(filtered)
      setTotalPages(Math.ceil(filtered.length / itemsPerPage))
      setCurrentPage(1)
    },
    [workshops],
  )

  // Obtener talleres para la página actual
  const getCurrentPageWorkshops = useCallback(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredWorkshops.slice(startIndex, endIndex)
  }, [filteredWorkshops, currentPage, itemsPerPage])

  // Cambiar de página
  const changePage = (page) => {
    setCurrentPage(page)
  }

  // Cerrar modal
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
