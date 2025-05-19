"use client"

import { useState } from "react"
import "./WorkshopFilters.css"

const WorkshopFilters = ({ onFilter }) => {
  const [month, setMonth] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  const handleSearch = (e) => {
    e.preventDefault()
    applyFilters()
  }

  const applyFilters = () => {
    onFilter({
      month,
      searchTerm,
    })
  }

  return (
    <div className="calendar-filters">
      <div className="filter-group">
        <label htmlFor="month-filter">Mes:</label>
        <select
          id="month-filter"
          value={month}
          onChange={(e) => {
            setMonth(e.target.value)
            setTimeout(applyFilters, 0)
          }}
        >
          <option value="">Todos los meses</option>
          <option value="1">Enero</option>
          <option value="2">Febrero</option>
          <option value="3">Marzo</option>
          <option value="4">Abril</option>
          <option value="5">Mayo</option>
          <option value="6">Junio</option>
          <option value="7">Julio</option>
          <option value="8">Agosto</option>
          <option value="9">Septiembre</option>
          <option value="10">Octubre</option>
          <option value="11">Noviembre</option>
          <option value="12">Diciembre</option>
        </select>
      </div>
      <div className="filter-group search">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Buscar talleres..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">
            <i className="fas fa-search"></i>
          </button>
        </form>
      </div>
    </div>
  )
}

export default WorkshopFilters
