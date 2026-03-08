import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import apiService from "../../services/api";
import "./AdminOrders.css";

function AdminOrders() {
  const { isAuthenticated } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [orders, setOrders] = useState([]);
  const [updatingId, setUpdatingId] = useState("");

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await apiService.getAdminOrders();
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

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      await apiService.updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      setError(err.message || "Failed to update order status");
    } finally {
      setUpdatingId("");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-orders-page">
        <div className="container admin-state">
          <h1>Admin Orders</h1>
          <p>Please login to continue.</p>
          <Link to="/login" className="admin-btn">Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-orders-page">
      <div className="container">
        <div className="admin-orders-header">
          <h1>Admin Orders</h1>
          <button className="admin-btn" onClick={loadOrders} disabled={loading}>
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {error && <div className="admin-error">{error}</div>}

        {loading ? (
          <div className="admin-state">Loading orders...</div>
        ) : error ? (
          <div className="admin-state">Please login with the configured admin email to view orders.</div>
        ) : orders.length === 0 ? (
          <div className="admin-state">No orders found.</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{new Date(order.createdAt).toLocaleString()}</td>
                    <td>{order.orderId}</td>
                    <td>
                      <div>{order.customer?.fullName}</div>
                      <div>{order.customer?.email}</div>
                      <div>{order.customer?.phone}</div>
                    </td>
                    <td>{order.items?.length || 0}</td>
                    <td>{order.currency || "INR"} {order.pricing?.total || 0}</td>
                    <td>{order.payment?.method || "-"}</td>
                    <td>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        disabled={updatingId === order._id}
                      >
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminOrders;
