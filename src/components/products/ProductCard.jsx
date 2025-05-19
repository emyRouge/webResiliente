"use client"
import { useApi } from "../../context/ApiContext"
import "./ProductCard.css"

const ProductCard = ({ product, onViewDetails }) => {
  const { getProxiedFileUrl } = useApi()

  // Determinar la fuente de la imagen
  let imageSrc = "https://placehold.co/300x200?text=Producto"
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
  if (product.descuento && product.descuento > 0) {
    finalPrice = product.precio - product.precio * (product.descuento / 100)
    originalPrice = product.precio
  }

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={imageSrc || "/placeholder.svg"} alt={product.nombre} />
      </div>
      <div className="product-info">
        <div className="product-category">{product.categoria || "Sin categoría"}</div>
        <h3 className="product-title">{product.nombre}</h3>
        <div className="product-price">
          {originalPrice && <span className="original-price">${originalPrice.toFixed(2)}</span>}${finalPrice.toFixed(2)}
        </div>
        <p className="product-description">{product.descripcion.substring(0, 80)}...</p>
        <div className="product-actions">
          <button className="btn btn-secondary" onClick={() => onViewDetails(product.id)}>
            Ver detalles
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
