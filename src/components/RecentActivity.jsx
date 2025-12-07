import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaUserPlus,
  FaUser,
  FaSeedling,
  FaShoppingCart,
  FaTruck,
} from "react-icons/fa";

/* ────────────────── ICON HELPERS ────────────────── */
const getIcon = (type) => {
  switch (type) {
    case "farmer":
      return <FaUserPlus className="fs-5" />;
    case "buyer":
      return <FaUser className="fs-5" />;
    case "product":
      return <FaSeedling className="fs-5" />;
    case "order":
      return <FaShoppingCart className="fs-5" />;
    case "delivery":
      return <FaTruck className="fs-5" />;
    default:
      return <i className="bi bi-activity fs-5"></i>;
  }
};

/* ────────────────── TIME-AGO LOGIC ────────────────── */
const formatTimeAgo = (dateObj) => {
  const now = new Date();
  const seconds = Math.floor((now - dateObj) / 1000);

  if (seconds < 0) return "just now";

  const intervals = [
    { label: "y", sec: 31536000 },
    { label: "mo", sec: 2592000 },
    { label: "d", sec: 86400 },
    { label: "h", sec: 3600 },
    { label: "m", sec: 60 },
  ];

  for (const { label, sec } of intervals) {
    const count = Math.floor(seconds / sec);
    if (count > 0) return `${count}${label} ago`;
  }
  return `${seconds}s ago`;
};

/* ────────────────── MAIN COMPONENT ────────────────── */
const RecentActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(
          "http://localhost:5000/api/admin/activities/recent",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const processed = data.activities
          .map((act) => {
            const rawDate = new Date(act.timestamp);
            // ONLY deliveries are stored 2 days ahead → subtract 2 days
            const displayDate =
              act.type === "delivery"
                ? new Date(rawDate.getTime() - 2 * 24 * 60 * 60 * 1000)
                : rawDate;

            return { ...act, displayDate };
          })
          .sort((a, b) => b.displayDate - a.displayDate)
          .slice(0, 6); // newest 6 only

        setActivities(processed);
      } catch (err) {
        console.error("Failed to fetch recent activities:", err);
        setError("Failed to load recent activities.");
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  /* ────────────────── UI ────────────────── */
  if (loading) {
    return (
      <div className="card shadow-sm border-0 text-center py-5">
        <div
          className="spinner-border text-success"
          style={{ width: "2.5rem", height: "2.5rem" }}
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card shadow-sm border-0 text-center py-5">
        <i className="bi bi-exclamation-triangle-fill fs-1 text-danger mb-3"></i>
        <p className="text-danger fw-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
      {/* Header */}
      <div className="card-header bg-success text-white py-3">
        <h5 className="mb-0 d-flex align-items-center">
          <i className="bi bi-clock-history me-2"></i>
          Recent Activity
        </h5>
      </div>

      {/* Body */}
      <div className="card-body p-0">
        {activities.length > 0 ? (
          <div className="list-group list-group-flush">
            {activities.map((activity, idx) => (
              <div
                key={activity.id || idx}
                className="list-group-item px-4 py-3 d-flex align-items-center hover-bg-light"
                style={{ transition: "background 0.2s" }}
              >
                {/* Icon */}
                <div
                  className="rounded-circle bg-white shadow-sm d-flex justify-content-center align-items-center me-3"
                  style={{
                    width: "42px",
                    height: "42px",
                    border: "2px solid #28a745",
                  }}
                >
                  <div className="text-success">{getIcon(activity.type)}</div>
                </div>

                {/* Text */}
                <div className="flex-grow-1">
                  <div className="fw-semibold text-dark">{activity.title}</div>
                  <div className="text-muted small">{activity.description}</div>
                </div>

                {/* Time */}
                <small className="text-success fw-medium ms-3">
                  {formatTimeAgo(activity.displayDate)}
                </small>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-5 text-muted">
            <i className="bi bi-check-circle fs-1 mb-3 text-success"></i>
            <p className="mb-0">No recent activity found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
