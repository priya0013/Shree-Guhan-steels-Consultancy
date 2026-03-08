import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import apiService from "../../services/api";
import "./AdminEnquiries.css";

function AdminEnquiries() {
  const { isAuthenticated } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [enquiries, setEnquiries] = useState([]);
  const [updatingId, setUpdatingId] = useState("");

  const loadEnquiries = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await apiService.getAdminEnquiries();
      setEnquiries(response.enquiries || []);
    } catch (err) {
      setError(err.message || "Failed to fetch enquiries");
      setEnquiries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadEnquiries();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const handleStatusChange = async (enquiryId, newStatus) => {
    try {
      setUpdatingId(enquiryId);
      await apiService.updateEnquiryStatus(enquiryId, newStatus);
      setEnquiries((prev) =>
        prev.map((enquiry) =>
          enquiry._id === enquiryId ? { ...enquiry, status: newStatus } : enquiry
        )
      );
    } catch (err) {
      setError(err.message || "Failed to update enquiry status");
    } finally {
      setUpdatingId("");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-enquiries-page">
        <div className="container admin-state">
          <h1>Admin Enquiries</h1>
          <p>Please login to continue.</p>
          <Link to="/login" className="admin-btn">Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-enquiries-page">
      <div className="container">
        <div className="admin-enquiries-header">
          <h1>Admin Enquiries</h1>
          <button className="admin-btn" onClick={loadEnquiries} disabled={loading}>
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {error && <div className="admin-error">{error}</div>}

        {loading ? (
          <div className="admin-state">Loading enquiries...</div>
        ) : error ? (
          <div className="admin-state">Please login with the configured admin email to view enquiries.</div>
        ) : enquiries.length === 0 ? (
          <div className="admin-state">No enquiries found.</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Enquiry Type</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {enquiries.map((enquiry) => (
                  <tr key={enquiry._id}>
                    <td>{new Date(enquiry.createdAt).toLocaleString()}</td>
                    <td>{enquiry.name}</td>
                    <td>
                      <div>{enquiry.email}</div>
                      <div>{enquiry.phone}</div>
                    </td>
                    <td>{enquiry.enquiryType || "-"}</td>
                    <td>{[enquiry.city, enquiry.state, enquiry.country].filter(Boolean).join(", ") || "-"}</td>
                    <td>
                      <select
                        value={enquiry.status}
                        onChange={(e) => handleStatusChange(enquiry._id, e.target.value)}
                        disabled={updatingId === enquiry._id}
                      >
                        <option value="New">New</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>
                    <td>{enquiry.emailSent ? "Sent" : "Failed"}</td>
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

export default AdminEnquiries;
