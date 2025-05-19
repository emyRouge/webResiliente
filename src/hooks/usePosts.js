"use client"

import { useState, useEffect, useCallback } from "react"
import { useApi } from "../context/ApiContext"

export const usePosts = () => {
  const { getPosts, getPost } = useApi()
  const [posts, setPosts] = useState([])
  const [filteredPosts, setFilteredPosts] = useState([])
  const [recentPosts, setRecentPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedPost, setSelectedPost] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const itemsPerPage = 5

  // Cargar publicaciones
  const loadPosts = useCallback(async () => {
    setLoading(true)
    try {
      const result = await getPosts()
      if (result.success) {
        // Ordenar por fecha (más recientes primero)
        const sortedPosts = (result.data || []).sort(
          (a, b) => new Date(b.fechaPublicacion) - new Date(a.fechaPublicacion),
        )

        setPosts(sortedPosts)
        setFilteredPosts(sortedPosts)
        setRecentPosts(sortedPosts.slice(0, 5))
        setTotalPages(Math.ceil(sortedPosts.length / itemsPerPage))
      } else {
        setError(result.message)
      }
    } catch (err) {
      setError("Error al cargar las publicaciones")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [getPosts])

  // Cargar una publicación específica
  const loadPostDetails = useCallback(
    async (id) => {
      setLoading(true)
      try {
        const result = await getPost(id)
        if (result.success) {
          setSelectedPost(result.data)
          setIsModalOpen(true)
        } else {
          setError(result.message)
        }
      } catch (err) {
        setError("Error al cargar el detalle de la publicación")
        console.error(err)
      } finally {
        setLoading(false)
      }
    },
    [getPost],
  )

  // Buscar publicaciones
  const searchPosts = useCallback(
    (searchTerm) => {
      if (!searchTerm.trim()) {
        setFilteredPosts(posts)
      } else {
        const term = searchTerm.toLowerCase()
        const filtered = posts.filter(
          (post) => post.titulo.toLowerCase().includes(term) || post.contenido.toLowerCase().includes(term),
        )
        setFilteredPosts(filtered)
      }

      setCurrentPage(1)
      setTotalPages(Math.ceil(filteredPosts.length / itemsPerPage))
    },
    [posts],
  )

  // Obtener publicaciones para la página actual
  const getCurrentPagePosts = useCallback(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredPosts.slice(startIndex, endIndex)
  }, [filteredPosts, currentPage, itemsPerPage])

  // Cambiar de página
  const changePage = (page) => {
    setCurrentPage(page)
  }

  // Cerrar modal
  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedPost(null)
  }

  useEffect(() => {
    loadPosts()
  }, [loadPosts])

  return {
    posts: getCurrentPagePosts(),
    recentPosts,
    loading,
    error,
    currentPage,
    totalPages,
    selectedPost,
    isModalOpen,
    loadPostDetails,
    searchPosts,
    changePage,
    closeModal,
  }
}
