"use client"

import { useState } from "react"
import { useApi } from "../../context/ApiContext"
import "./ProductDetail.css"

const ProductDetail = ({ product }) => {
  const [quantity, setQuantity] = useState(1)
  const { getProxiedFileUrl } = useApi()

  // Determinar la fuente de la imagen
  let imageSrc = "https://placehold.co/600x400?text=Producto"
  if (product.imagen) {
    if (product.imagen.startsWith("http")) {
      // Es una URL de Wasabi - usar proxy
      imageSrc = getProxiedFileUrl(product.imagen)
    } else {
      // Es base64 (compatibilidad con datos existentes)
      imageSrc = `data:image/jpeg;base64,${product.imagen}`
    }
  }

  // Calcular precio con descuento si existe
  let finalPrice = product.precio
  let originalPrice = null
  let discountInfo = null
  if (product.descuento && product.descuento > 0) {
    finalPrice = product.precio - product.precio * (product.descuento / 100)
    originalPrice = product.precio
    discountInfo = `-${product.descuento}%`
  }

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1)
  }

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1)
    }
  }

  const handleAddToCart = () => {
    alert(`Producto agregado al carrito: ${product.nombre} x ${quantity}`)
  }

  return (
    <div className="product-detail-grid">
      <div className="product-detail-image">
        {discountInfo && <div className="discount-badge">{discountInfo}</div>}
        <img src={imageSrc || "/placeholder.svg"} alt={product.nombre} />
      </div>
      <div className="product-detail-info">
        <div className="product-category">{product.categoria || "Sin categoría"}</div>
        <h2 className="product-title">{product.nombre}</h2>
        <div className="product-price">
          {originalPrice && <span className="original-price">${originalPrice.toFixed(2)}</span>}
          <span className="final-price">${finalPrice.toFixed(2)}</span>
        </div>
        <div className="product-description">
          <p>{product.descripcion}</p>
        </div>
        {product.caracteristicas && (
          <div className="product-features">
            <h3>Características</h3>
            <p>{product.caracteristicas}</p>
          </div>
        )}
        <div className="product-actions">
          <div className="quantity-selector">
            <button className="quantity-btn minus" onClick={handleDecrement}>
              -
            </button>
            <input
              type="number"
              value={quantity}
              min="1"
              className="quantity-input"
              onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
            />
            <button className="quantity-btn plus" onClick={handleIncrement}>
              +
            </button>
          </div>
          <button className="btn btn-primary add-to-cart" onClick={handleAddToCart}>
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
