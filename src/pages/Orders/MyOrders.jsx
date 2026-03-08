import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import apiService from "../../services/api";
import "./MyOrders.css";

function MyOrders() {
  const { isAuthenticated } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [orders, setOrders] = useState([]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await apiService.getMyOrders();
      setOrders(response.orders || []);
    } catch (err) {
      setError(err.message || "Failed to fetch orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadOrders();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="my-orders-page">
        <div className="container orders-state">
          <h1>My Orders</h1>
          <p>Please login to view your orders.</p>
          <Link to="/login" className="orders-btn">Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="my-orders-page">
      <div className="container">
        <div className="orders-header">
          <h1>My Orders</h1>
          <button className="orders-btn" onClick={loadOrders} disabled={loading}>
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {error && <div className="orders-error">{error}</div>}

        {loading ? (
          <div className="orders-state">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="orders-state">
            <p>No orders found yet.</p>
            <Link to="/products" className="orders-link">Start Shopping</Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <article className="order-card" key={order._id}>
                <header className="order-card-head">
                  <div>
                    <h3>{order.orderId}</h3>
                    <p>{new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                  <span className={`order-status status-${order.status}`}>{order.status}</span>
                </header>

                <div className="order-meta">
                  <span>Items: {order.items?.length || 0}</span>
                  <span>Payment: {order.payment?.method || "-"}</span>
                  <span>Total: {order.currency || "INR"} {order.pricing?.total || 0}</span>
                </div>

                <div className="order-items">
                  {(order.items || []).map((item, index) => (
                    <div className="order-item-row" key={`${order._id}-${index}`}>
                      <span>{item.name}</span>
                      <span>Qty: {item.quantity}</span>
                      <span>{item.price}</span>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyOrders;
