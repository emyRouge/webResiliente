"use client"

import { useState, useEffect } from "react"
import { useApi } from "../context/ApiContext"
import Hero from "../components/home/Hero"
import Features from "../components/home/Features"
import Testimonials from "../components/home/Testimonials"
import Contact from "../components/home/Contact"
import LoadingSpinner from "../components/ui/LoadingSpinner"
import Message from "../components/ui/Message"
import ProductCard from "../components/products/ProductCard"
import PostCard from "../components/blog/PostCard"
import WorkshopCard from "../components/workshops/WorkshopCard"
import "./HomePage.css"

const HomePage = () => {
  const { getProducts, getPosts, getWorkshops } = useApi()
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [latestPosts, setLatestPosts] = useState([])
  const [upcomingWorkshops, setUpcomingWorkshops] = useState([])
  const [loading, setLoading] = useState({
    products: true,
    posts: true,
    workshops: true,
  })
  const [error, setError] = useState({
    products: null,
    posts: null,
    workshops: null,
  })

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        const result = await getProducts()
        if (result.success) {
          setFeaturedProducts(result.data.slice(0, 3) || [])
        } else {
          setError((prev) => ({ ...prev, products: result.message }))
        }
      } catch (err) {
        setError((prev) => ({ ...prev, products: "Error al cargar los productos" }))
      } finally {
        setLoading((prev) => ({ ...prev, products: false }))
      }
    }

    const loadLatestPosts = async () => {
      try {
        const result = await getPosts()
        if (result.success) {
          // Ordenar por fecha (más recientes primero)
          const sortedPosts = (result.data || []).sort(
            (a, b) => new Date(b.fechaPublicacion) - new Date(a.fechaPublicacion),
          )
          setLatestPosts(sortedPosts.slice(0, 3))
        } else {
          setError((prev) => ({ ...prev, posts: result.message }))
        }
      } catch (err) {
        setError((prev) => ({ ...prev, posts: "Error al cargar las publicaciones" }))
      } finally {
        setLoading((prev) => ({ ...prev, posts: false }))
      }
    }

    const loadUpcomingWorkshops = async () => {
      try {
        const result = await getWorkshops()
        if (result.success) {
          // Filtrar talleres futuros y ordenar por fecha
          const today = new Date()
          const futureWorkshops = (result.data || [])
            .filter((workshop) => new Date(workshop.fechaInicio) >= today)
            .sort((a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio))

          setUpcomingWorkshops(futureWorkshops.slice(0, 3))
        } else {
          setError((prev) => ({ ...prev, workshops: result.message }))
        }
      } catch (err) {
        setError((prev) => ({ ...prev, workshops: "Error al cargar los talleres" }))
      } finally {
        setLoading((prev) => ({ ...prev, workshops: false }))
      }
    }

    loadFeaturedProducts()
    loadLatestPosts()
    loadUpcomingWorkshops()
  }, [getProducts, getPosts, getWorkshops])

  return (
    <>
      <Hero />
      <Features />

      <section className="featured-products">
        <div className="container">
          <h2 className="section-title">Productos Destacados</h2>
          <div className="products-preview">
            {loading.products ? (
              <LoadingSpinner />
            ) : error.products ? (
              <Message message={error.products} type="error" />
            ) : featuredProducts.length === 0 ? (
              <Message message="No hay productos destacados disponibles" type="warning" />
            ) : (
              featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onViewDetails={() => {}} />
              ))
            )}
          </div>
          <div className="text-center">
            <a href="/productos" className="btn btn-primary">
              Ver todos los productos
            </a>
          </div>
        </div>
      </section>

      <section className="latest-posts">
        <div className="container">
          <h2 className="section-title">Últimas Publicaciones</h2>
          <div className="posts-preview">
            {loading.posts ? (
              <LoadingSpinner />
            ) : error.posts ? (
              <Message message={error.posts} type="error" />
            ) : latestPosts.length === 0 ? (
              <Message message="No hay publicaciones disponibles" type="warning" />
            ) : (
              latestPosts.map((post) => <PostCard key={post.id} post={post} onViewDetails={() => {}} />)
            )}
          </div>
          <div className="text-center">
            <a href="/publicaciones" className="btn btn-secondary">
              Ver todas las publicaciones
            </a>
          </div>
        </div>
      </section>

      <section className="upcoming-workshops">
        <div className="container">
          <h2 className="section-title">Próximos Talleres</h2>
          <div className="workshops-preview">
            {loading.workshops ? (
              <LoadingSpinner />
            ) : error.workshops ? (
              <Message message={error.workshops} type="error" />
            ) : upcomingWorkshops.length === 0 ? (
              <Message message="No hay próximos talleres programados" type="warning" />
            ) : (
              upcomingWorkshops.map((workshop) => (
                <WorkshopCard key={workshop.id} workshop={workshop} onViewDetails={() => {}} />
              ))
            )}
          </div>
          <div className="text-center">
            <a href="/talleres" className="btn btn-primary">
              Ver todos los talleres
            </a>
          </div>
        </div>
      </section>

      <Testimonials />
      <Contact />
    </>
  )
}

export default HomePage
