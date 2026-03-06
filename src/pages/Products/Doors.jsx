import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Doors.css";
import { doorProducts } from "./doorsData";

function Doors() {
  const navigate = useNavigate();
  const [likes, setLikes] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("All");

  const toggleLike = (productId, event) => {
    event.stopPropagation();
    setLikes((prevLikes) => ({
      ...prevLikes,
      [productId]: !prevLikes[productId],
    }));
  };

  // Get all unique categories
  const categories = ["All", ...new Set(doorProducts.map(p => p.category))];
  
  // Filter products by category
  const filteredProducts = selectedCategory === "All" 
    ? doorProducts 
    : doorProducts.filter(product => product.category === selectedCategory);

  return (
    <div className="doors-page">
      {/* Category Filter Section */}
      <section className="category-filter-section">
        <div className="container">
          <h2>Browse by Category</h2>
          <div className="category-filters">
            {categories.map((category) => (
              <button
                key={category}
                className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
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
      <section className="doors-gallery">
        <div className="container">
          <div className="gallery-grid">
            {filteredProducts.map((product) => (
              <div key={product.id} className="gallery-card">
                <div 
                  className="gallery-image-wrapper"
                  onClick={() => navigate(`/products/doors/${product.id}`)}
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
                        navigate(`/products/doors/${product.id}`);
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
                <div className="gallery-card-content">
                  <h3>{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  <div className="product-specs">
                    <span className="spec-item">
                      <strong>Material:</strong> {product.material}
                    </span>
                  </div>
                  <div className="product-price">{product.price}</div>
                  <Link to={`/products/doors/${product.id}`} className="details-link">
                    View Product Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="doors-cta">
        <div className="container">
          <h2>Transform Your Space with Premium Steel Doors</h2>
          <p>Choose from our extensive collection of 33 unique door designs</p>
          <div className="cta-buttons">
            <Link to="/contact" className="btn btn-primary">Get Expert Consultation</Link>
            <button className="btn btn-secondary">View Catalog PDF</button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Doors;