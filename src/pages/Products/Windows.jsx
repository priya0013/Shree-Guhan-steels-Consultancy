import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Windows.css";
import { windowProducts } from "./windowsData";

function Windows() {
  const navigate = useNavigate();
  const [likes, setLikes] = useState({});

  const toggleLike = (productId, event) => {
    event.stopPropagation();
    setLikes((prevLikes) => ({
      ...prevLikes,
      [productId]: !prevLikes[productId],
    }));
  };

  return (
    <div className="windows-page">
      {/* Designer Window Sets Banner - Mikasa Style */}
      <section className="designer-banner">
        <div className="corner-line corner-top-left"></div>
        <div className="corner-line corner-top-right"></div>
        <div className="corner-line corner-bottom-left"></div>
        <div className="corner-line corner-bottom-right"></div>
        
        <div className="banner-products">
          {windowProducts.slice(0, 7).map((product, index) => (
            <div 
              key={product.id} 
              className="banner-product-item"
              onClick={() => navigate(`/products/windows/${product.id}`)}
            >
              <img src={product.image} alt={product.name} />
            </div>
          ))}
        </div>
        
        <div className="banner-overlay">
          <h1 className="banner-title">Steel Window Sets</h1>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="windows-gallery">
        <div className="container">
          <h2>Our Steel Window Collection</h2>
          <div className="gallery-grid">
            {windowProducts.map((product) => (
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
            <button className="btn btn-primary">Contact Us Today</button>
            <button className="btn btn-secondary">Download Catalog</button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Windows;