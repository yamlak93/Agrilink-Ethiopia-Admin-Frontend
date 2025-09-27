import React, { useState, useEffect } from "react";
import logoGreen from "../assets/logoGreen.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt, faBell } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import NotificationModal from "./NotificationModal";

const Navbar = () => {
  const [unreadNotifications] = useState(3);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userName, setUserName] = useState(""); // State to hold the user's name
  const navigate = useNavigate();

  // Effect to load user name from localStorage when component mounts
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserName(user.name || "User"); // Use 'name' from the user object
    }
  }, []);

  const handleShowModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleSignOut = () => {
    // Destroy JWT and user data by removing from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/admin/login"); // Redirect to login page
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
          {/* Left: Logo */}
          <div className="logo d-flex align-items-center">
            <img src={logoGreen} width={36} alt="Logo" className="me-2" />
            <span className="fw-bold text-success d-none d-lg-inline">
              AgriLink Ethiopia
            </span>
          </div>

          {/* Middle: Welcome text */}
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

          {/* Right: Icons and role */}
          <div className="rightside d-flex align-items-center">
            {/* Role badge */}
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

            {/* Notification bell */}
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

            {/* Logout */}
            <div onClick={handleSignOut} style={{ cursor: "pointer" }}>
              <FontAwesomeIcon icon={faSignOutAlt} style={{ color: "red" }} />
            </div>
          </div>
        </div>
      </nav>

      {/* Notification Modal */}
      <NotificationModal show={isModalOpen} handleClose={handleCloseModal} />
    </>
  );
};

export default Navbar;
