import { useMemo, useState, useContext, useRef, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { windowProducts } from "./windowsData";
import apiService from "../../services/api";
import "./WindowDetail.css";

function WindowDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const activeProductRef = useRef(null);
  
  const product = useMemo(
    () => windowProducts.find((item) => item.id === Number(id)),
    [id]
  );

  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedDimension, setSelectedDimension] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [notification, setNotification] = useState('');
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [isQuoteSubmitting, setIsQuoteSubmitting] = useState(false);
  const [quoteForm, setQuoteForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  // Auto-scroll to active product when id changes
  useEffect(() => {
    if (activeProductRef.current) {
      activeProductRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [id]);

  const handleAddToCart = () => {
    const selectedSize = product.dimensions[selectedDimension];
    const selectedColorValue = product.colors[selectedColor];

    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.gallery[0],
      size: selectedSize,
      color: selectedColorValue,
      type: 'window'
    };

    addToCart(cartItem);
    setNotification('✓ Added to cart!');
    setTimeout(() => setNotification(''), 3000);
  };

  const handleQuoteSubmit = async (e) => {
    e.preventDefault();
    if (isQuoteSubmitting) return;
    
    // Validate form
    if (!quoteForm.name || !quoteForm.email || !quoteForm.phone) {
      setNotification('⚠ Please fill in all required fields (Name, Email, Phone)');
      setTimeout(() => setNotification(''), 3000);
      return;
    }
    
    try {
      setIsQuoteSubmitting(true);
      const quoteData = {
        customer: {
          name: quoteForm.name,
          email: quoteForm.email,
          phone: quoteForm.phone,
          message: quoteForm.message
        },
        product: {
          id: product.id,
          name: product.name,
          category: product.category,
          price: product.price,
          size: product.dimensions[selectedDimension],
          type: 'window'
        }
      };
      
      const response = await apiService.createQuote(quoteData);
      
      if (response.success) {
        setNotification(`✓ Quote request saved successfully! Quote ID: ${response.quoteId}`);
        setShowQuoteModal(false);
        setQuoteForm({ name: '', email: '', phone: '', message: '' });
        setTimeout(() => setNotification(''), 6000);
      } else {
        setNotification('⚠ Failed to save quote. Please try again.');
        setTimeout(() => setNotification(''), 3000);
      }
    } catch (error) {
      console.error('Quote submission error:', error);
      setNotification('⚠ Could not connect to server. Please ensure backend is running.');
      setTimeout(() => setNotification(''), 3000);
    } finally {
      setIsQuoteSubmitting(false);
    }
  };

  const handleQuoteFormChange = (e) => {
    setQuoteForm({
      ...quoteForm,
      [e.target.name]: e.target.value
    });
  };

  if (!product) {
    return (
      <div className="window-detail-page not-found">
        <div className="container">
          <h2>Product not found</h2>
          <Link to="/products/windows" className="back-link">← Back to Windows</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="window-detail-page">
      <div className="container">
        <div className="window-detail-layout">
          <section className="window-detail-gallery">
            <div className="main-image-card">
              <img src={product.gallery[selectedImage]} alt={product.name} className="main-product-image" />
            </div>

            <div className="thumb-row">
              {product.gallery.map((image, index) => (
                <button
                  key={`${product.id}-img-${index}`}
                  className={`thumb-btn ${selectedImage === index ? "active" : ""}`}
                  onClick={() => setSelectedImage(index)}
                  type="button"
                >
                  <img src={image} alt={`${product.name} ${index + 1}`} />
                </button>
              ))}
            </div>
          </section>

          <aside className="window-detail-info">
            <p className="detail-label">Product details</p>
            <h1>{product.name}</h1>
            <p className="detail-price">{product.price}.00</p>

            <div className="detail-field">
              <label>Color</label>
              <div className="color-swatches">
                {product.colors.map((color, index) => (
                  <button
                    key={`${product.id}-color-${index}`}
                    className={`color-btn ${selectedColor === index ? "active" : ""}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(index)}
                    type="button"
                    aria-label={`Color ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className="detail-field">
              <label>Dimensions</label>
              <select
                className="dimension-select"
                value={selectedDimension}
                onChange={(event) => setSelectedDimension(Number(event.target.value))}
              >
                {product.dimensions.map((size, index) => (
                  <option key={`${product.id}-size-${index}`} value={index}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            {notification && (
              <div className="cart-notification">
                {notification}
              </div>
            )}

            <div className="detail-actions">
              <button type="button" className="detail-btn add-cart" onClick={handleAddToCart}>ADD TO CART</button>
              <button type="button" className="detail-btn quote" onClick={() => setShowQuoteModal(true)}>REQUEST A QUOTE</button>
            </div>

            {/* Quote Modal */}
            {showQuoteModal && (
              <div className="quote-modal-overlay" onClick={() => setShowQuoteModal(false)}>
                <div className="quote-modal" onClick={(e) => e.stopPropagation()}>
                  <button className="quote-modal-close" onClick={() => setShowQuoteModal(false)}>×</button>
                  <h2>Request a Quote</h2>
                  <div className="quote-product-info">
                    <p><strong>{product.name}</strong></p>
                    <p>Category: {product.category}</p>
                    <p>Price: {product.price}</p>
                  </div>
                  <form onSubmit={handleQuoteSubmit}>
                    <div className="quote-form-group">
                      <label>Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={quoteForm.name}
                        onChange={handleQuoteFormChange}
                        required
                        placeholder="Your full name"
                      />
                    </div>
                    <div className="quote-form-group">
                      <label>Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={quoteForm.email}
                        onChange={handleQuoteFormChange}
                        required
                        placeholder="your.email@example.com"
                      />
                    </div>
                    <div className="quote-form-group">
                      <label>Phone *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={quoteForm.phone}
                        onChange={handleQuoteFormChange}
                        required
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                    <div className="quote-form-group">
                      <label>Message</label>
                      <textarea
                        name="message"
                        value={quoteForm.message}
                        onChange={handleQuoteFormChange}
                        rows="4"
                        placeholder="Any additional requirements or questions..."
                      />
                    </div>
                    <button type="submit" className="quote-submit-btn" disabled={isQuoteSubmitting}>
                      {isQuoteSubmitting ? 'Sending...' : 'Send Quote Request'}
                    </button>
                  </form>
                </div>
              </div>
            )}

            <ul className="feature-list">
              {product.features.map((feature, index) => (
                <li key={`${product.id}-feature-${index}`}>{feature}</li>
              ))}
            </ul>

            <Link to="/products/windows" className="back-link">← Back to Windows</Link>
          </aside>
        </div>

        {/* Browse All Windows Section */}
        <section className="more-products-section">
          <h2>Browse All Windows</h2>
          <div className="more-products-grid">
            {windowProducts.map((relatedProduct) => (
              <div
                key={`window-${relatedProduct.id}`}
                ref={relatedProduct.id === product.id ? activeProductRef : null}
                className={`more-product-card ${relatedProduct.id === product.id ? 'active' : ''}`}
                onClick={() => navigate(`/products/windows/${relatedProduct.id}`)}
              >
                <div className="more-product-image">
                  <img src={relatedProduct.image} alt={relatedProduct.name} />
                </div>
                <div className="more-product-info">
                  <h4>{relatedProduct.name}</h4>
                  <p className="more-product-model">{relatedProduct.category}</p>
                  <p className="more-product-price">{relatedProduct.price}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default WindowDetail;
