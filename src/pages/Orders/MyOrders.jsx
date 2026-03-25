import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import apiService from "../../services/api";
import "./MyOrders.css";

const TRACKING_STEPS = ["confirmed", "processing", "shipped", "delivered"];

const formatStatusLabel = (status) => {
  if (!status) {
    return "Unknown";
  }
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const getTrackingMeta = (order) => {
  const history = Array.isArray(order.trackingHistory) ? [...order.trackingHistory] : [];

  history.sort((a, b) => new Date(a.updatedAt || 0) - new Date(b.updatedAt || 0));

  const stepTimeByStatus = {};
  history.forEach((entry) => {
    if (entry?.status && entry?.updatedAt) {
      stepTimeByStatus[entry.status] = entry.updatedAt;
    }
  });

  if (!stepTimeByStatus.confirmed && order.createdAt) {
    stepTimeByStatus.confirmed = order.createdAt;
  }

  const statusIndex = TRACKING_STEPS.indexOf(order.status);
  const completedByCurrentStatus = TRACKING_STEPS.reduce((acc, step, index) => {
    if (statusIndex >= 0 && index <= statusIndex) {
      acc[step] = true;
    }
    return acc;
  }, {});

  return {
    stepTimeByStatus,
    completedByCurrentStatus,
    isCancelled: order.status === "cancelled",
    cancelledAt: stepTimeByStatus.cancelled || order.updatedAt
  };
};

const formatDateTime = (value) => {
  if (!value) {
    return "";
  }
  return new Date(value).toLocaleString();
};

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

                <div className="order-tracking">
                  <h4>Track Order</h4>
                  {(() => {
                    const { stepTimeByStatus, completedByCurrentStatus, isCancelled, cancelledAt } = getTrackingMeta(order);

                    return (
                      <>
                        <div className="tracking-steps">
                          {TRACKING_STEPS.map((step, index) => {
                            const stepReached = Boolean(stepTimeByStatus[step] || completedByCurrentStatus[step]);
                            const isActive = !isCancelled && order.status === step;

                            return (
                              <div
                                className={`tracking-step ${stepReached ? "is-complete" : "is-pending"} ${isActive ? "is-active" : ""}`}
                                key={`${order._id}-${step}`}
                              >
                                <span className="tracking-dot">{index + 1}</span>
                                <div className="tracking-text">
                                  <strong>{formatStatusLabel(step)}</strong>
                                  <small>{stepTimeByStatus[step] ? formatDateTime(stepTimeByStatus[step]) : "Pending"}</small>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {isCancelled && (
                          <p className="tracking-cancelled">
                            This order was cancelled on {formatDateTime(cancelledAt)}.
                          </p>
                        )}
                      </>
                    );
                  })()}
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
