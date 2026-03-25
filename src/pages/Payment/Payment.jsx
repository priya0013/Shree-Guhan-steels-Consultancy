import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import apiService from "../../services/api";
import "./Payment.css";

const Payment = () => {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice, clearCart } = useContext(CartContext);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [orderRef, setOrderRef] = useState("");
  
  // Form states
  const [formData, setFormData] = useState({
    // Shipping Info
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: ""
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (cartItems.length === 0 && !orderPlaced) {
      navigate("/cart");
    }
  }, [cartItems, navigate, orderPlaced]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setSubmitError("");
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Shipping validation
    if (!formData.fullName.trim()) newErrors.fullName = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    else if (!/^[0-9]{10}$/.test(formData.phone)) newErrors.phone = "Phone must be 10 digits";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.pincode.trim()) newErrors.pincode = "Pincode is required";
    else if (!/^[0-9]{6}$/.test(formData.pincode)) newErrors.pincode = "Pincode must be 6 digits";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getCheckoutPayload = () => {
    const subtotal = getTotalPrice();
    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + tax;

    return {
      customer: {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode.trim()
      },
      items: cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        model: item.model,
        price: Number(String(item.price).replace(/[^0-9]/g, "")) || 0,
        quantity: item.quantity || 1,
        selectedSize: item.selectedSize || item.size || "",
        selectedColor: item.selectedColor || item.color || "",
        selectedDimension: item.selectedDimension || item.dimension || "",
        image: item.image || "",
        type: item.type || "other"
      })),
      pricing: {
        subtotal,
        tax,
        shipping: 0,
        total
      },
      currency: "INR"
    };
  };

  const finalizeSuccessOrder = (response) => {
    setOrderRef(response?.order?.orderId || "");
    setOrderPlaced(true);

    setTimeout(() => {
      clearCart();
      navigate("/");
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsProcessing(true);
    setSubmitError("");

    try {
      const checkoutPayload = getCheckoutPayload();

      const response = await apiService.createOrder({
        ...checkoutPayload,
        payment: {
          method: "cod"
        }
      });

      finalizeSuccessOrder(response);
    } catch (error) {
      setSubmitError(error.message || "Unable to place order right now. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="payment-page">
        <div className="payment-container">
          <div className="order-success">
            <div className="success-icon">✓</div>
            <h1>Order Placed Successfully!</h1>
            <p>Thank you for your purchase. Your order is being processed.</p>
            <p className="order-id">Order ID: {orderRef || "Generated"}</p>
            <p className="redirect-msg">Redirecting to home...</p>
          </div>
        </div>
      </div>
    );
  }

  const totalAmount = getTotalPrice();
  const totalWithTax = Math.round(totalAmount * 1.18);
  const taxAmount = Math.round(totalAmount * 0.18);

  return (
    <div className="payment-page">
      <div className="payment-container">
        <h1 className="payment-title">Secure Checkout</h1>
        
        <div className="payment-layout">
          {/* Left Column - Forms */}
          <div className="payment-forms">
            <form onSubmit={handleSubmit}>
              {/* Shipping Information */}
              <section className="form-section">
                <h2>Shipping Information</h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={errors.fullName ? "error" : ""}
                      placeholder="John Doe"
                    />
                    {errors.fullName && <span className="error-msg">{errors.fullName}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={errors.email ? "error" : ""}
                      placeholder="john@example.com"
                    />
                    {errors.email && <span className="error-msg">{errors.email}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={errors.phone ? "error" : ""}
                      placeholder="9876543210"
                      maxLength="10"
                    />
                    {errors.phone && <span className="error-msg">{errors.phone}</span>}
                  </div>
                  
                  <div className="form-group full-width">
                    <label>Address *</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={errors.address ? "error" : ""}
                      placeholder="Street address, apartment, suite, etc."
                      rows="3"
                    />
                    {errors.address && <span className="error-msg">{errors.address}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label>City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={errors.city ? "error" : ""}
                      placeholder="Mumbai"
                    />
                    {errors.city && <span className="error-msg">{errors.city}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label>State *</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className={errors.state ? "error" : ""}
                      placeholder="Maharashtra"
                    />
                    {errors.state && <span className="error-msg">{errors.state}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label>Pincode *</label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className={errors.pincode ? "error" : ""}
                      placeholder="400001"
                      maxLength="6"
                    />
                    {errors.pincode && <span className="error-msg">{errors.pincode}</span>}
                  </div>
                </div>
              </section>

              {/* Payment Method */}
              <section className="form-section">
                <h2>Payment Method</h2>

                <div className="payment-methods cod-only">
                  <div className="payment-method-btn active" aria-label="Cash on Delivery">
                    <span className="icon">💵</span>
                    <span>Cash on Delivery</span>
                  </div>
                </div>

                <div className="payment-form-details">
                  <div className="cod-info">
                    <p>📦 Pay with cash upon delivery</p>
                    <p className="cod-note">Additional charges may apply for COD orders</p>
                  </div>
                </div>
              </section>

              <button 
                type="submit" 
                className="place-order-btn"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <span className="spinner"></span>
                    Processing...
                  </>
                ) : (
                  `Place COD Order - ₹${totalWithTax.toLocaleString()}`
                )}
              </button>

              {submitError && <p className="payment-submit-error">{submitError}</p>}

              <div className="security-badges">
                <span className="badge">🔒 Secure Payment</span>
                <span className="badge">✓ 256-bit Encryption</span>
                <span className="badge">✓ PCI DSS Compliant</span>
              </div>
            </form>
          </div>

          {/* Right Column - Order Summary */}
          <div className="order-summary-sidebar">
            <h3>Order Summary</h3>
            
            <div className="summary-items">
              {cartItems.map((item) => (
                <div key={item.cartId} className="summary-item">
                  <img src={item.image} alt={item.name} />
                  <div className="summary-item-details">
                    <h4>{item.name}</h4>
                    <p>Qty: {item.quantity}</p>
                    {item.color && <p className="item-spec">Color: {item.color}</p>}
                    {item.size && <p className="item-spec">Size: {item.size}</p>}
                  </div>
                  <div className="summary-item-price">{item.price}</div>
                </div>
              ))}
            </div>

            <div className="summary-totals">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{totalAmount.toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>FREE</span>
              </div>
              <div className="summary-row">
                <span>Tax (GST)</span>
                <span>₹{taxAmount.toLocaleString()}</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-row total">
                <span>Total</span>
                <span>₹{totalWithTax.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
