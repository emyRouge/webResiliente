"use client"

import { usePosts } from "../hooks/usePosts"
import PageBanner from "../components/ui/PageBanner"
import PostCard from "../components/blog/PostCard"
import PostDetail from "../components/blog/PostDetail"
import BlogSidebar from "../components/blog/BlogSidebar"
import Modal from "../components/ui/Modal"
import Pagination from "../components/ui/Pagination"
import LoadingSpinner from "../components/ui/LoadingSpinner"
import Message from "../components/ui/Message"
import "./BlogPage.css"

const BlogPage = () => {
  const {
    posts,
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
  } = usePosts()

  return (
    <>
      <PageBanner title="Nuestro Blog" subtitle="Historias, noticias y eventos de nuestra comunidad" />

      <section className="blog-content">
        <div className="container">
          <div className="blog-layout">
            <main className="blog-posts">
              {loading ? (
                <LoadingSpinner />
              ) : error ? (
                <Message message={error} type="error" />
              ) : posts.length === 0 ? (
                <Message message="No se encontraron publicaciones" type="warning" />
              ) : (
                posts.map((post) => <PostCard key={post.id} post={post} onViewDetails={loadPostDetails} />)
              )}
            </main>

            <BlogSidebar recentPosts={recentPosts} onPostClick={loadPostDetails} onSearch={searchPosts} />
          </div>

          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={changePage} />
        </div>
      </section>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {selectedPost && <PostDetail post={selectedPost} />}
      </Modal>
    </>
  )
}

export default BlogPage
