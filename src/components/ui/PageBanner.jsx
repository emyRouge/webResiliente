import "./PageBanner.css"

const PageBanner = ({ title, subtitle }) => {
  return (
    <section className="page-banner">
      <div className="container">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </section>
  )
}

export default PageBanner
