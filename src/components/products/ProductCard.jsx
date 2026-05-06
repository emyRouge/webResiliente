import { useApi } from "../../context/ApiContext"
import "./ProductCard.css"

const ProductCard = ({ product, onViewDetails }) => {
  const { getFileUrl } = useApi()

  let imageSrc = `https://picsum.photos/seed/product-${product.id}/400/300`
  if (product.imagen) {
    if (product.imagen.startsWith("http")) {
      imageSrc = getFileUrl(product.imagen)
    } else {
      imageSrc = `data:image/jpeg;base64,${product.imagen}`
    }
  }

  let finalPrice = product.precio
  let originalPrice = null
  if (product.descuento && product.descuento > 0) {
    finalPrice = product.precio - product.precio * (product.descuento / 100)
    originalPrice = product.precio
  }

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={imageSrc} alt={product.nombre} loading="lazy" />
        {product.descuento > 0 && (
          <span className="product-badge">-{product.descuento}%</span>
        )}
      </div>
      <div className="product-info">
        <div className="product-category">{product.categoria || "Sin categoría"}</div>
        <h3 className="product-title">{product.nombre}</h3>
        <div className="product-price">
          {originalPrice && <span className="original-price">${originalPrice.toFixed(2)}</span>}
          <span className="final-price">${finalPrice.toFixed(2)}</span>
        </div>
        <p className="product-description">{product.descripcion.substring(0, 85)}...</p>
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
