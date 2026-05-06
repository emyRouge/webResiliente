import { useState, useEffect, useCallback } from "react"
import { useApi } from "../context/ApiContext"
import { MOCK_POSTS } from "../data/mockData"

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

  const loadPosts = useCallback(async () => {
    setLoading(true)
    try {
      const result = await getPosts()
      if (result.success) {
        const sorted = (result.data || []).sort(
          (a, b) => new Date(b.fechaPublicacion) - new Date(a.fechaPublicacion),
        )
        setPosts(sorted)
        setFilteredPosts(sorted)
        setRecentPosts(sorted.slice(0, 5))
        setTotalPages(Math.ceil(sorted.length / itemsPerPage))
      } else {
        setPosts(MOCK_POSTS)
        setFilteredPosts(MOCK_POSTS)
        setRecentPosts(MOCK_POSTS.slice(0, 5))
        setTotalPages(Math.ceil(MOCK_POSTS.length / itemsPerPage))
      }
    } catch {
      setPosts(MOCK_POSTS)
      setFilteredPosts(MOCK_POSTS)
      setRecentPosts(MOCK_POSTS.slice(0, 5))
      setTotalPages(Math.ceil(MOCK_POSTS.length / itemsPerPage))
    } finally {
      setLoading(false)
    }
  }, [getPosts])

  const loadPostDetails = useCallback(async (id) => {
    try {
      const result = await getPost(id)
      if (result.success) {
        setSelectedPost(result.data)
        setIsModalOpen(true)
      } else {
        const mock = MOCK_POSTS.find((p) => p.id === id)
        if (mock) {
          setSelectedPost(mock)
          setIsModalOpen(true)
        }
      }
    } catch {
      const mock = MOCK_POSTS.find((p) => p.id === id)
      if (mock) {
        setSelectedPost(mock)
        setIsModalOpen(true)
      }
    }
  }, [getPost])

  const searchPosts = useCallback((searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredPosts(posts)
      setTotalPages(Math.ceil(posts.length / itemsPerPage))
    } else {
      const term = searchTerm.toLowerCase()
      const filtered = posts.filter(
        (p) => p.titulo.toLowerCase().includes(term) || p.contenido.toLowerCase().includes(term),
      )
      setFilteredPosts(filtered)
      setTotalPages(Math.ceil(filtered.length / itemsPerPage))
    }
    setCurrentPage(1)
  }, [posts])

  const getCurrentPagePosts = useCallback(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredPosts.slice(start, start + itemsPerPage)
  }, [filteredPosts, currentPage])

  const changePage = (page) => setCurrentPage(page)

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
