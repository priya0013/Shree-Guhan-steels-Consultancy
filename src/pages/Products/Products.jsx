import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../../components/ProductCard";
import apiService from "../../services/api";
import "./Products.css";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAllProducts();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError('Failed to load products. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="products-page">
      <section className="products-hero">
        <div className="container">
          <h1>Our Products</h1>
          <p>Explore our premium range of steel windows and doors</p>
          <div className="category-links">
            <Link to="/products/doors" className="category-link">View Doors</Link>
            <Link to="/products/windows" className="category-link">View Windows</Link>
          </div>
        </div>
      </section>

      <section className="products-section">
        <div className="container">
          {loading && (
            <div className="loading-message">
              <div className="spinner"></div>
              <p>Loading products...</p>
            </div>
          )}

          {error && (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={fetchProducts} className="btn btn-primary">Retry</button>
            </div>
          )}

          {!loading && !error && products.length === 0 && (
            <div className="empty-message">
              <p>No products available at the moment.</p>
            </div>
          )}

          {!loading && !error && products.length > 0 && (
            <div className="products-grid">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Products;