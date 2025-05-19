"use client"

import { useProducts } from "../hooks/useProducts"
import PageBanner from "../components/ui/PageBanner"
import ProductFilters from "../components/products/ProductFilters"
import ProductCard from "../components/products/ProductCard"
import ProductDetail from "../components/products/ProductDetail"
import Modal from "../components/ui/Modal"
import Pagination from "../components/ui/Pagination"
import LoadingSpinner from "../components/ui/LoadingSpinner"
import Message from "../components/ui/Message"
import "./ProductsPage.css"

const ProductsPage = () => {
  const {
    products,
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
  } = useProducts()

  return (
    <>
      <PageBanner title="Nuestros Productos" subtitle="Descubre nuestra selección de productos artesanales" />

      <ProductFilters onFilter={filterProducts} />

      <section className="products-grid">
        <div className="container">
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <Message message={error} type="error" />
          ) : products.length === 0 ? (
            <Message message="No se encontraron productos con los filtros seleccionados" type="warning" />
          ) : (
            <>
              <div className="products">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} onViewDetails={loadProductDetails} />
                ))}
              </div>

              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={changePage} />
            </>
          )}
        </div>
      </section>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {selectedProduct && <ProductDetail product={selectedProduct} />}
      </Modal>
    </>
  )
}

export default ProductsPage
