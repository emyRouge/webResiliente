import React from "react"
import { Outlet } from "react-router-dom"
import Header from "./Header"
import Footer from "./Footer"

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {children || <Outlet />}
      </main>
      <Footer />
    </div>
  )
}

export const AdminLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      {children}
    </div>
  )
}

export default Layout