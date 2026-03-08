import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Windows.css";
import { windowProducts } from "./windowsData";
import catalogPdf from "../../assets/models/SGS-Catalog.pdf";

function Windows() {
  const navigate = useNavigate();
  const [likes, setLikes] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", ...new Set(windowProducts.map((product) => product.category))];
  const filteredProducts =
    selectedCategory === "All"
      ? windowProducts
      : windowProducts.filter((product) => product.category === selectedCategory);

  const toggleLike = (productId, event) => {
    event.stopPropagation();
    setLikes((prevLikes) => ({
      ...prevLikes,
      [productId]: !prevLikes[productId],
    }));
  };

  return (
    <div className="windows-page">
      <section className="category-filter-section">
        <div className="container">
          <h2>Browse by Category</h2>
          <div className="category-filters">
            {categories.map((category) => (
              <button
                key={category}
                className={`filter-btn ${selectedCategory === category ? "active" : ""}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
          <p className="product-count">Showing {filteredProducts.length} products</p>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="windows-gallery">
        <div className="container">
          <h2>Our Steel Window Collection</h2>
          <div className="gallery-grid">
            {filteredProducts.map((product) => (
              <div key={product.id} className="gallery-card">
                <div 
                  className="gallery-image-wrapper"
                  onClick={() => navigate(`/products/windows/${product.id}`)}
                >
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="gallery-image"
                  />
                  <div className="product-category-badge">{product.category}</div>
                  <button
                    className={`like-btn ${likes[product.id] ? "liked" : ""}`}
                    onClick={(e) => toggleLike(product.id, e)}
                    title={likes[product.id] ? "Unlike" : "Like"}
                  >
                    <span className="heart-icon">♥</span>
                  </button>
                  <div className="gallery-overlay">
                    <button
                      className="view-btn"
                      onClick={(event) => {
                        event.stopPropagation();
                        navigate(`/products/windows/${product.id}`);
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
                <div className="gallery-card-content">
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <Link to={`/products/windows/${product.id}`} className="details-link">
                    Open Product Page →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specifications Section */}
      <section className="windows-specs">
        <div className="container">
          <h2>Technical Specifications</h2>
          <div className="specs-grid">
            <div className="spec-item">
              <h4>Material</h4>
              <p>High-grade structural steel with corrosion-resistant coating</p>
            </div>
            <div className="spec-item">
              <h4>Glass Options</h4>
              <p>Single, double, or triple glazing with low-E coatings</p>
            </div>
            <div className="spec-item">
              <h4>Finishes</h4>
              <p>Powder coat, anodized, or custom color options available</p>
            </div>
            <div className="spec-item">
              <h4>Installation</h4>
              <p>Professional installation with warranty on all products</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="windows-cta">
        <div className="container">
          <h2>Ready to Upgrade Your Windows?</h2>
          <p>Get a free consultation from our expert team</p>
          <div className="cta-buttons">
            <Link to="/contact" className="btn btn-primary">Contact Us Today</Link>
            <a
              href={catalogPdf}
              className="btn btn-secondary"
              target="_blank"
              rel="noopener noreferrer"
              download="SGS-Catalog.pdf"
            >
              Download Catalog
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Windows;