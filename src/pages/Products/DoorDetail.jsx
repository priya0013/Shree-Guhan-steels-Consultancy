import { useMemo, useState, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { doorProducts } from "./doorsData";
import "./WindowDetail.css";

function DoorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  
  const product = useMemo(
    () => doorProducts.find((item) => item.id === Number(id)),
    [id]
  );

  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedDimension, setSelectedDimension] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [notification, setNotification] = useState('');

  const handleAddToCart = () => {
    const selectedSize = product.sizes && product.sizes.length > 0 
      ? product.sizes[selectedDimension] 
      : product.dimensions[selectedDimension];
    const selectedColorValue = product.colors[selectedColor];

    const cartItem = {
      id: product.id,
      name: product.name,
      model: product.model,
      price: product.price,
      image: product.gallery[0],
      size: selectedSize,
      color: selectedColorValue,
      dimension: product.dimensions?.[selectedDimension] || '',
      type: 'door'
    };

    addToCart(cartItem);
    setNotification('✓ Added to cart!');
    setTimeout(() => setNotification(''), 3000);
  };

  if (!product) {
    return (
      <div className="window-detail-page not-found">
        <div className="container">
          <h2>Product not found</h2>
          <Link to="/products/doors" className="back-link">← Back to Doors</Link>
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
            {product.model && <p className="detail-model">Model: <strong>{product.model}</strong></p>}
            <p className="detail-price">{product.price}</p>

            <div className="detail-field">
              <label>Size (mm)</label>
              <div className="size-options">
                {product.sizes && product.sizes.length > 0 ? (
                  product.sizes.map((size, index) => (
                    <button
                      key={`${product.id}-size-${index}`}
                      className={`size-btn ${selectedDimension === index ? "active" : ""}`}
                      onClick={() => setSelectedDimension(index)}
                      type="button"
                    >
                      {size}
                    </button>
                  ))
                ) : (
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
                )}
              </div>
              {product.dimensions && product.dimensions[selectedDimension] && (
                <p className="dimension-info">{product.dimensions[selectedDimension]}</p>
              )}
            </div>

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

            {product.specifications && (
              <div className="specifications-section">
                <h3>Technical Specifications</h3>
                <div className="specs-grid">
                  {product.specifications.frameThickness && (
                    <div className="spec-item">
                      <span className="spec-label">Frame Thickness:</span>
                      <span className="spec-value">{product.specifications.frameThickness}</span>
                    </div>
                  )}
                  {product.specifications.lockPoints && (
                    <div className="spec-item">
                      <span className="spec-label">Locking Points:</span>
                      <span className="spec-value">{product.specifications.lockPoints}</span>
                    </div>
                  )}
                  {product.specifications.insulation && (
                    <div className="spec-item">
                      <span className="spec-label">Insulation (U-value):</span>
                      <span className="spec-value">{product.specifications.insulation}</span>
                    </div>
                  )}
                  {product.specifications.soundReduction && (
                    <div className="spec-item">
                      <span className="spec-label">Sound Reduction:</span>
                      <span className="spec-value">{product.specifications.soundReduction}</span>
                    </div>
                  )}
                  {product.specifications.fireRating && (
                    <div className="spec-item">
                      <span className="spec-label">Fire Rating:</span>
                      <span className="spec-value">{product.specifications.fireRating}</span>
                    </div>
                  )}
                  <div className="spec-item">
                    <span className="spec-label">Material:</span>
                    <span className="spec-value">{product.material}</span>
                  </div>
                </div>
              </div>
            )}

            {notification && (
              <div className="cart-notification">
                {notification}
              </div>
            )}

            <div className="detail-actions">
              <button type="button" className="detail-btn add-cart" onClick={handleAddToCart}>ADD TO CART</button>
              <button type="button" className="detail-btn quote">REQUEST A QUOTE</button>
            </div>

            <ul className="feature-list">
              {product.features.map((feature, index) => (
                <li key={`${product.id}-feature-${index}`}>{feature}</li>
              ))}
            </ul>

            <Link to="/products/doors" className="back-link">← Back to Doors</Link>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default DoorDetail;
