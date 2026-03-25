import { useState } from "react";
import { Link } from "react-router-dom";
import apiService from "../../services/api";
import "./TrackOrder.css";

const TRACKING_STEPS = ["confirmed", "processing", "shipped", "delivered"];

const formatStatusLabel = (status) => {
  if (!status) {
    return "Unknown";
  }
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const formatDateTime = (value) => {
  if (!value) {
    return "";
  }
  return new Date(value).toLocaleString();
};

const getTrackingMeta = (order) => {
  const history = Array.isArray(order?.trackingHistory) ? [...order.trackingHistory] : [];

  history.sort((a, b) => new Date(a.updatedAt || 0) - new Date(b.updatedAt || 0));

  const stepTimeByStatus = {};
  history.forEach((entry) => {
    if (entry?.status && entry?.updatedAt) {
      stepTimeByStatus[entry.status] = entry.updatedAt;
    }
  });

  if (!stepTimeByStatus.confirmed && order?.createdAt) {
    stepTimeByStatus.confirmed = order.createdAt;
  }

  const statusIndex = TRACKING_STEPS.indexOf(order?.status);
  const completedByCurrentStatus = TRACKING_STEPS.reduce((acc, step, index) => {
    if (statusIndex >= 0 && index <= statusIndex) {
      acc[step] = true;
    }
    return acc;
  }, {});

  return {
    stepTimeByStatus,
    completedByCurrentStatus,
    isCancelled: order?.status === "cancelled",
    cancelledAt: stepTimeByStatus.cancelled || order?.updatedAt
  };
};

function TrackOrder() {
  const [form, setForm] = useState({ orderId: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setOrder(null);

    const orderId = String(form.orderId || "").trim();
    const phone = String(form.phone || "").trim();

    if (!orderId) {
      setError("Please enter your Order ID.");
      return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    try {
      setLoading(true);
      const response = await apiService.trackOrderPublic({ orderId, phone });
      setOrder(response.order || null);
    } catch (err) {
      setError(err.message || "Unable to track this order now.");
    } finally {
      setLoading(false);
    }
  };

  const { stepTimeByStatus, completedByCurrentStatus, isCancelled, cancelledAt } = getTrackingMeta(order);

  return (
    <div className="track-order-page">
      <div className="container">
        <div className="track-order-card">
          <h1>Track Your Order</h1>
          <p>Enter your order ID and phone number used during checkout.</p>

          <form className="track-order-form" onSubmit={handleSubmit}>
            <label htmlFor="orderId">Order ID</label>
            <input
              id="orderId"
              name="orderId"
              type="text"
              placeholder="Example: SGS-ABC123"
              value={form.orderId}
              onChange={handleChange}
            />

            <label htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="10-digit mobile number"
              value={form.phone}
              onChange={handleChange}
              maxLength={10}
            />

            <button type="submit" disabled={loading}>
              {loading ? "Tracking..." : "Track Order"}
            </button>
          </form>

          {error && <div className="track-order-error">{error}</div>}

          {order && (
            <section className="track-order-result">
              <div className="track-order-head">
                <h2>{order.orderId}</h2>
                <span className={`track-status status-${order.status}`}>{formatStatusLabel(order.status)}</span>
              </div>

              <div className="track-order-meta">
                <span>Placed: {formatDateTime(order.createdAt)}</span>
                <span>Total: {order.currency || "INR"} {order.pricing?.total || 0}</span>
                <span>Items: {order.items?.length || 0}</span>
              </div>

              <div className="tracking-steps">
                {TRACKING_STEPS.map((step, index) => {
                  const stepReached = Boolean(stepTimeByStatus[step] || completedByCurrentStatus[step]);
                  const isActive = !isCancelled && order.status === step;

                  return (
                    <div
                      className={`tracking-step ${stepReached ? "is-complete" : "is-pending"} ${isActive ? "is-active" : ""}`}
                      key={step}
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
            </section>
          )}

          <p className="track-order-login-note">
            Already logged in? <Link to="/my-orders">View all your orders</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default TrackOrder;
