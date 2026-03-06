import { useMemo, useState, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { windowProducts } from "./windowsData";
import "./WindowDetail.css";

function WindowDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  
  const product = useMemo(
    () => windowProducts.find((item) => item.id === Number(id)),
    [id]
  );

  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedDimension, setSelectedDimension] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [notification, setNotification] = useState('');

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
              <button type="button" className="detail-btn quote">REQUEST A QUOTE</button>
            </div>

            <ul className="feature-list">
              {product.features.map((feature, index) => (
                <li key={`${product.id}-feature-${index}`}>{feature}</li>
              ))}
            </ul>

            <Link to="/products/windows" className="back-link">← Back to Windows</Link>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default WindowDetail;
