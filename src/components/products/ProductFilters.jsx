"use client"

import { useState } from "react"
import "./ProductFilters.css"

const ProductFilters = ({ onFilter }) => {
  const [category, setCategory] = useState("")
  const [priceRange, setPriceRange] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  const handleSearch = (e) => {
    e.preventDefault()
    applyFilters()
  }

  const applyFilters = () => {
    onFilter({
      category,
      priceRange,
      searchTerm,
    })
  }

  return (
    <section className="product-filters">
      <div className="container">
        <div className="filters">
          <div className="filter-group">
            <label htmlFor="category-filter">Categoría:</label>
            <select
              id="category-filter"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value)
                setTimeout(applyFilters, 0)
              }}
            >
              <option value="">Todas las categorías</option>
              <option value="Café">Café</option>
              <option value="Pastelería">Pastelería</option>
              <option value="Accesorios">Accesorios</option>
              <option value="Merchandising">Merchandising</option>
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="price-filter">Precio:</label>
            <select
              id="price-filter"
              value={priceRange}
              onChange={(e) => {
                setPriceRange(e.target.value)
                setTimeout(applyFilters, 0)
              }}
            >
              <option value="">Todos los precios</option>
              <option value="0-50">$0 - $50</option>
              <option value="50-100">$50 - $100</option>
              <option value="100-200">$100 - $200</option>
              <option value="200+">$200+</option>
            </select>
          </div>
          <div className="filter-group search">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                id="search-products"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" id="search-button">
                <i className="fas fa-search"></i>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductFilters
