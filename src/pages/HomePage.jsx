import { useState, useEffect } from "react"
import { useApi } from "../context/ApiContext"
import Hero from "../components/home/Hero"
import Features from "../components/home/Features"
import Testimonials from "../components/home/Testimonials"
import Contact from "../components/home/Contact"
import LoadingSpinner from "../components/ui/LoadingSpinner"
import ProductCard from "../components/products/ProductCard"
import PostCard from "../components/blog/PostCard"
import WorkshopCard from "../components/workshops/WorkshopCard"
import { MOCK_PRODUCTS, MOCK_POSTS, MOCK_WORKSHOPS } from "../data/mockData"
import "./HomePage.css"

const HomePage = () => {
  const { getProducts, getPosts, getWorkshops } = useApi()
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [latestPosts, setLatestPosts] = useState([])
  const [upcomingWorkshops, setUpcomingWorkshops] = useState([])
  const [loading, setLoading] = useState({ products: true, posts: true, workshops: true })

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        const result = await getProducts()
        if (result.success) {
          setFeaturedProducts((result.data || []).slice(0, 3))
        } else {
          setFeaturedProducts(MOCK_PRODUCTS.slice(0, 3))
        }
      } catch {
        setFeaturedProducts(MOCK_PRODUCTS.slice(0, 3))
      } finally {
        setLoading((prev) => ({ ...prev, products: false }))
      }
    }

    const loadLatestPosts = async () => {
      try {
        const result = await getPosts()
        if (result.success) {
          const sorted = (result.data || []).sort(
            (a, b) => new Date(b.fechaPublicacion) - new Date(a.fechaPublicacion),
          )
          setLatestPosts(sorted.slice(0, 3))
        } else {
          setLatestPosts(MOCK_POSTS.slice(0, 3))
        }
      } catch {
        setLatestPosts(MOCK_POSTS.slice(0, 3))
      } finally {
        setLoading((prev) => ({ ...prev, posts: false }))
      }
    }

    const loadUpcomingWorkshops = async () => {
      try {
        const result = await getWorkshops()
        if (result.success) {
          const today = new Date()
          const future = (result.data || [])
            .filter((w) => new Date(w.fechaInicio) >= today)
            .sort((a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio))
          setUpcomingWorkshops(future.slice(0, 3))
        } else {
          setUpcomingWorkshops(MOCK_WORKSHOPS.slice(0, 3))
        }
      } catch {
        setUpcomingWorkshops(MOCK_WORKSHOPS.slice(0, 3))
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
            ) : (
              featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onViewDetails={() => {}} />
              ))
            )}
          </div>
          <div className="text-center">
            <a href="/productos" className="btn btn-primary">Ver todos los productos</a>
          </div>
        </div>
      </section>

      <section className="latest-posts">
        <div className="container">
          <h2 className="section-title">Últimas Publicaciones</h2>
          <div className="posts-preview">
            {loading.posts ? (
              <LoadingSpinner />
            ) : (
              latestPosts.map((post) => (
                <PostCard key={post.id} post={post} onViewDetails={() => {}} />
              ))
            )}
          </div>
          <div className="text-center">
            <a href="/publicaciones" className="btn btn-secondary">Ver todas las publicaciones</a>
          </div>
        </div>
      </section>

      <section className="upcoming-workshops">
        <div className="container">
          <h2 className="section-title">Próximos Talleres</h2>
          <div className="workshops-preview">
            {loading.workshops ? (
              <LoadingSpinner />
            ) : (
              upcomingWorkshops.map((workshop) => (
                <WorkshopCard key={workshop.id} workshop={workshop} onViewDetails={() => {}} />
              ))
            )}
          </div>
          <div className="text-center">
            <a href="/talleres" className="btn btn-primary">Ver todos los talleres</a>
          </div>
        </div>
      </section>

      <Testimonials />
      <Contact />
    </>
  )
}

export default HomePage
