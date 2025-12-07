// src/components/Navbar.jsx
import React, { useState, useEffect } from "react";
import logoGreen from "../assets/logoGreen.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt, faBell } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import NotificationModal from "./NotificationModal";
import apiClient from "../api/api";

const Navbar = () => {
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserName(user.name || "User");
    } else {
      navigate("/admin/login");
    }
  }, [navigate]);

  // Fetch notifications from DB via API
  const fetchNotifications = async () => {
    try {
      const response = await apiClient.get("/notifications/all");
      const fetchedNotifications = response.data;
      setNotifications(fetchedNotifications);
      setUnreadNotifications(
        fetchedNotifications.filter((n) => !n.isRead).length || 0
      );
      console.log(
        "✅ Notifications fetched from DB:",
        fetchedNotifications.length
      );
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
      setUnreadNotifications(0);
    }
  };

  // Poll every 30s
  useEffect(() => {
    fetchNotifications(); // Initial fetch
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleShowModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/admin/login");
  };

  return (
    <>
      <nav
        className="navbar navbar-light bg-light shadow-sm"
        style={{
          position: "fixed",
          top: 0,
          width: "100%",
          zIndex: 1050,
          height: "60px",
        }}
      >
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <div className="logo d-flex align-items-center">
            <img src={logoGreen} width={36} alt="Logo" className="me-2" />
            <span className="fw-bold text-success d-none d-lg-inline">
              AgriLink Ethiopia
            </span>
          </div>

          <div className="flex-grow-1 d-flex justify-content-center">
            <span
              className="welcome-text d-none d-md-inline"
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: "14px",
                fontWeight: "600",
                color: "#2ecc71",
              }}
            >
              Welcome, {userName}
            </span>
          </div>

          <div className="rightside d-flex align-items-center">
            <span
              className="bg-success text-white d-none d-sm-inline"
              style={{
                width: "60px",
                borderRadius: "10px",
                padding: "1px",
                textAlign: "center",
                height: "20px",
                marginRight: "10px",
                fontSize: "12px",
              }}
            >
              Admin
            </span>

            <div
              className="position-relative me-2"
              onClick={handleShowModal}
              style={{ cursor: "pointer" }}
            >
              <FontAwesomeIcon
                icon={faBell}
                size="lg"
                className="text-success"
              />
              {unreadNotifications > 0 && (
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                  style={{ fontSize: "10px", padding: "2px 6px" }}
                >
                  {unreadNotifications}
                </span>
              )}
            </div>

            <div onClick={handleSignOut} style={{ cursor: "pointer" }}>
              <FontAwesomeIcon icon={faSignOutAlt} style={{ color: "red" }} />
            </div>
          </div>
        </div>
      </nav>

      <NotificationModal
        show={isModalOpen}
        handleClose={handleCloseModal}
        notifications={notifications}
        setNotifications={setNotifications}
        setUnreadNotifications={setUnreadNotifications}
        fetchNotifications={fetchNotifications} // Pass to refresh after mark read
      />
    </>
  );
};

export default Navbar;
