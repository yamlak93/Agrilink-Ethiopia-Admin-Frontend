import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaTractor } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

// Animation variants for the container
const containerVariants = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

// Animation variants for the tractor icon
const tractorVariants = {
  initial: { x: -100, opacity: 0 },
  animate: {
    x: 0,
    opacity: 1,
    transition: { duration: 1, ease: "easeOut" },
  },
  hover: {
    x: [0, 10, -10, 0],
    transition: { repeat: Infinity, duration: 2 },
  },
};

const PageNotFound = () => {
  const navigate = useNavigate();

  // Effect to handle redirection based on user role
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.role) {
      const dashboardPath =
        user.role === "Admin" ? "/admin/dashboard" : "/admin/login";
      navigate(dashboardPath);
    } else {
      // 👇 No user logged in → go to home
      navigate("/admin/login");
    }
    // If no user is logged in, the Link will still work as a fallback to "/"
  }, [navigate]);

  return (
    <motion.div
      className="min-vh-100 d-flex align-items-center justify-content-center bg-light p-3"
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      <div className="text-center col-12 col-md-8 col-lg-6 mx-auto">
        {/* Animated Tractor Icon */}
        <motion.div
          className="display-1 text-success mb-4"
          variants={tractorVariants}
          animate="animate"
          whileHover="hover"
        >
          <FaTractor />
        </motion.div>

        {/* Error Message */}
        <h1 className="display-4 font-weight-bold text-dark mb-3">
          404 - Page Not Found
        </h1>
        <p className="lead text-muted mb-4">
          Oops! Looks like this field hasn't been planted yet. Let's get you
          back to the farm!
        </p>

        {/* Back to Dashboard Button */}
        <button
          onClick={() => {
            const user = JSON.parse(localStorage.getItem("user"));
            if (user && user.role) {
              const dashboardPath =
                user.role === "Admin" ? "/admin/dashboard" : "/admin/login";
              navigate(dashboardPath);
            } else {
              navigate("/admin/login");
            }
          }}
          className="btn btn-success btn-lg font-weight-semibold"
        >
          Back to AgriLink Dashboard
        </button>

        {/* Decorative Elements */}
        <div className="mt-4 d-flex justify-content-center gap-3">
          <motion.div
            className="bg-success rounded-circle"
            style={{ width: "16px", height: "16px" }}
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
          <motion.div
            className="bg-success rounded-circle"
            style={{ width: "16px", height: "16px" }}
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
          />
          <motion.div
            className="bg-success rounded-circle"
            style={{ width: "16px", height: "16px" }}
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default PageNotFound;
