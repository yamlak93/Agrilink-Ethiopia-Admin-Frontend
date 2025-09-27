import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaUserPlus,
  FaSeedling,
  FaShoppingCart,
  FaTruck,
  FaUser,
} from "react-icons/fa";

const getIcon = (type) => {
  switch (type) {
    case "farmer":
      return <FaUserPlus />;
    case "buyer":
      return <FaUser />;
    case "product":
      return <FaSeedling />;
    case "order":
      return <FaShoppingCart />;
    case "delivery":
      return <FaTruck />;
    default:
      return null;
  }
};

const formatTimeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + "y ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "mo ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "m ago";
  return Math.floor(seconds) + "s ago";
};

const RecentActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const token = localStorage.getItem("token");
        // Corrected URL: added '/admin' to the path
        const response = await axios.get(
          "http://localhost:5000/api/admin/activities/recent",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setActivities(response.data.activities);
      } catch (err) {
        console.error("Failed to fetch recent activities:", err);
        setError("Failed to load recent activities.");
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  if (loading) {
    return <div className="text-center text-muted">Loading activities...</div>;
  }

  if (error) {
    return <div className="text-center text-danger">{error}</div>;
  }

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <h5 className="card-title mb-3">Recent Activity</h5>
        {activities.length > 0 ? (
          activities.map((activity, index) => (
            <div key={index} className="d-flex mb-3">
              <div
                className="rounded-circle bg-success text-white d-flex justify-content-center align-items-center"
                style={{ width: "35px", height: "35px" }}
              >
                {getIcon(activity.type)}
              </div>
              <div className="ms-3">
                <strong>{activity.title}</strong>
                <div className="text-muted small">{activity.description}</div>
              </div>
              <small className="ms-auto text-muted">
                {formatTimeAgo(activity.timestamp)}
              </small>
            </div>
          ))
        ) : (
          <div className="text-muted text-center">
            No recent activity found.
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
