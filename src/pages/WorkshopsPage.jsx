"use client"

import { useRef } from "react"
import { useWorkshops } from "../hooks/useWorkshops"
import PageBanner from "../components/ui/PageBanner"
import WorkshopCard from "../components/workshops/WorkshopCard"
import WorkshopDetail from "../components/workshops/WorkshopDetail"
import WorkshopFilters from "../components/workshops/WorkshopFilters"
import WorkshopRegistration from "../components/workshops/WorkshopRegistration"
import Modal from "../components/ui/Modal"
import Pagination from "../components/ui/Pagination"
import LoadingSpinner from "../components/ui/LoadingSpinner"
import Message from "../components/ui/Message"
import "./WorkshopsPage.css"

const WorkshopsPage = () => {
  const {
    workshops,
    loading,
    error,
    currentPage,
    totalPages,
    selectedWorkshop,
    isModalOpen,
    loadWorkshopDetails,
    filterWorkshops,
    changePage,
    closeModal,
  } = useWorkshops()

  const registrationRef = useRef(null)

  const handleRegister = () => {
    closeModal()
    // Scroll hasta el formulario de registro
    if (registrationRef.current) {
      registrationRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <>
      <PageBanner title="Nuestros Talleres" subtitle="Aprende, comparte y crece con nuestra comunidad" />

      <section className="workshops-intro">
        <div className="container">
          <div className="intro-content">
            <div className="intro-text">
              <h2>Talleres inclusivos para todos</h2>
              <p>
                En Resiliente, creemos en el poder transformador del aprendizaje compartido. Nuestros talleres están
                diseñados para ser accesibles a personas de todas las capacidades, creando un espacio donde todos pueden
                participar, aprender y crecer juntos.
              </p>
              <p>
                Desde barismo hasta arte, nuestros talleres ofrecen una experiencia enriquecedora que fomenta la
                inclusión, el desarrollo de habilidades y la construcción de comunidad.
              </p>
            </div>
            <div className="intro-image">
              <img src="https://placehold.co/500x300" alt="Taller inclusivo en Resiliente" />
            </div>
          </div>
        </div>
      </section>

      <section className="workshops-calendar">
        <div className="container">
          <h2 className="section-title">Próximos Talleres</h2>

          <WorkshopFilters onFilter={filterWorkshops} />

          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <Message message={error} type="error" />
          ) : workshops.length === 0 ? (
            <Message message="No se encontraron talleres con los filtros seleccionados" type="warning" />
          ) : (
            <>
              <div className="workshops-grid">
                {workshops.map((workshop) => (
                  <WorkshopCard key={workshop.id} workshop={workshop} onViewDetails={loadWorkshopDetails} />
                ))}
              </div>

              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={changePage} />
            </>
          )}
        </div>
      </section>

      <div ref={registrationRef}>
        <WorkshopRegistration />
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {selectedWorkshop && <WorkshopDetail workshop={selectedWorkshop} onRegister={handleRegister} />}
      </Modal>
    </>
  )
}

export default WorkshopsPage
