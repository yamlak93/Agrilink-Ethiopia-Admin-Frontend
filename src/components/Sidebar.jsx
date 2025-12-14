import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../Css/Sidebar.css";
import {
  FaTachometerAlt, // Dashboard
  FaUsers, // Manage Users
  FaBoxOpen, // Manage Products
  FaClipboardList, // Manage Orders
  FaTruck, // Delivery Management
  FaLightbulb, // Tips & Alerts
  FaCog, // Settings
  FaUser,
  FaBars,
  FaChartLine,
  FaBook,
  FaUniversity,
} from "react-icons/fa";
import { FaMoneyCheckDollar } from "react-icons/fa6";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState("Demo User"); // Default to Demo User

  const location = useLocation(); // Added this since isActive uses it
  const isActive = (path) => location.pathname === path;

  // Fetch user name from localStorage on mount
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUserName(parsedUser.name || "Demo User"); // Extract name from userData
    }
  }, []);

  return (
    <>
      {/* Hamburger Button (visible only on small screens) */}
      <button
        className="btn btn-success d-lg-none m-2"
        onClick={() => setIsOpen(!isOpen)}
        style={{ position: "fixed", top: "10px", left: "10px", zIndex: 2000 }}
      >
        <FaBars />
      </button>

      <div
        className={`sidebar bg-white border-end ${
          isOpen ? "d-block" : "d-none"
        } d-lg-block`}
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          height: "100vh",
          width: "220px",
          transition: "all 0.3s ease",
          zIndex: 1500,
        }}
      >
        <ul className="nav flex-column mt-5 mt-lg-0">
          <li className="nav-item">
            <Link
              to="/admin/dashboard"
              className={`nav-link ${
                isActive("/admin/dashboard") ? "active-link" : ""
              }`}
              onClick={() => setIsOpen(false)}
            >
              <FaTachometerAlt className="me-2" />
              Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/admin/manage-users"
              className={`nav-link ${
                isActive("/admin/manage-users") ? "active-link" : ""
              }`}
              onClick={() => setIsOpen(false)}
            >
              <FaUsers className="me-2" />
              Manage Users
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/admin/manage-products"
              className={`nav-link ${
                isActive("/admin/manage-products") ? "active-link" : ""
              }`}
              onClick={() => setIsOpen(false)}
            >
              <FaBoxOpen className="me-2" />
              Manage Products
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/admin/manage-orders"
              className={`nav-link ${
                isActive("/admin/manage-orders") ? "active-link" : ""
              }`}
              onClick={() => setIsOpen(false)}
            >
              <FaClipboardList className="me-2" />
              Manage Orders
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/admin/manage-deliveries"
              className={`nav-link ${
                isActive("/admin/manage-deliveries") ? "active-link" : ""
              }`}
              onClick={() => setIsOpen(false)}
            >
              <FaTruck className="me-2" />
              Manage Delivery
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/admin/tip"
              className={`nav-link ${
                isActive("/admin/tip") ? "active-link" : ""
              }`}
              onClick={() => setIsOpen(false)}
            >
              <FaLightbulb className="me-2" />
              Tips & Alerts
            </Link>
          </li>

          <li className="nav-item">
            <Link
              to="/admin/payments"
              className={`nav-link ${
                isActive("/admin/payments") ? "active-link" : ""
              }`}
              onClick={() => setIsOpen(false)}
            >
              <FaMoneyCheckDollar className="me-2" />
              Payments
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/admin/manage-banks-accounts"
              className={`nav-link ${
                isActive("/admin/manage-banks-accounts") ? "active-link" : ""
              }`}
              onClick={() => setIsOpen(false)}
            >
              <FaUniversity className="me-2" />
              Farmers Bank Accounts
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/admin/analytics"
              className={`nav-link ${
                isActive("/admin/analytics") ? "active-link" : ""
              }`}
              onClick={() => setIsOpen(false)}
            >
              <FaChartLine className="me-2" />
              Analytics
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/admin/reports"
              className={`nav-link ${
                isActive("/admin/reports") ? "active-link" : ""
              }`}
              onClick={() => setIsOpen(false)}
            >
              <FaBook className="me-2" />
              Reports
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/admin/settings"
              className={`nav-link ${
                isActive("/admin/settings") ? "active-link" : ""
              }`}
              onClick={() => setIsOpen(false)}
            >
              <FaCog className="me-2" />
              Settings
            </Link>
          </li>
        </ul>
        <div className="user-info mt-auto px-3 py-2">
          <FaUser className="me-2" />
          <div>
            <div className="fw-bold">{userName}</div>
            <div className="text-muted small">Admin</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
