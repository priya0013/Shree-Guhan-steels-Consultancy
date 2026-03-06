import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import "./Cart.css";

const Cart = () => {
    const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useContext(CartContext);

  const handleQuantityChange = (cartId, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(cartId, newQuantity);
  };

  const handleRemove = (cartId) => {
    removeFromCart(cartId);
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-container">
          <h1>Shopping Cart</h1>
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Add some products to get started!</p>
            <Link to="/products" className="continue-shopping-btn">
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <h1>Shopping Cart</h1>
          <button onClick={clearCart} className="clear-cart-btn">
            Clear Cart
          </button>
        </div>

        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.cartId} className="cart-item">
                <div className="cart-item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                
                <div className="cart-item-details">
                  <div className="cart-item-info">
                    <h3>{item.name}</h3>
                    <p className="cart-item-model">Model: {item.model}</p>
                    {item.selectedSize && (
                      <p className="cart-item-spec">Size: {item.selectedSize}</p>
                    )}
                    {item.selectedColor && (
                      <p className="cart-item-spec">Color: {item.selectedColor}</p>
                    )}
                    {item.selectedDimension && (
                      <p className="cart-item-spec">Dimension: {item.selectedDimension}</p>
                    )}
                  </div>

                  <div className="cart-item-actions">
                    <div className="quantity-controls">
                      <button
                        onClick={() => handleQuantityChange(item.cartId, item.quantity - 1)}
                        className="quantity-btn"
                        disabled={item.quantity <= 1}
                      >
                        −
                      </button>
                      <span className="quantity-display">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.cartId, item.quantity + 1)}
                        className="quantity-btn"
                      >
                        +
                      </button>
                    </div>

                    <div className="cart-item-price">
                      <span className="price">{item.price}</span>
                    </div>

                    <button
                      onClick={() => handleRemove(item.cartId)}
                      className="remove-btn"
                      aria-label="Remove item"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-details">
              <div className="summary-row">
                <span>Subtotal ({cartItems.length} items)</span>
                <span>{getTotalPrice()}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-row total">
                <span>Total</span>
                <span className="total-price">{getTotalPrice()}</span>
              </div>
            </div>

            <div className="summary-actions">
              <button className="checkout-btn" onClick={() => navigate('/payment')}>
                Proceed to Checkout
              </button>
              <Link to="/products" className="continue-shopping-link">
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
