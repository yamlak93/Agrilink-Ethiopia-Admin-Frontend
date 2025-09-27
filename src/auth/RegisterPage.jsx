import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoGreen from "../assets/logoGreen.png"; // Assuming logoGreen is available
import axios from "axios"; // Ensure axios is installed: npm install axios

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    adminName: "",
    email: "",
    phoneNumber: "",
    address: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Basic client-side validation
    if (!formData.adminName || formData.adminName.length < 2) {
      setError("Name must be at least 2 characters long");
      setLoading(false);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Invalid email format");
      setLoading(false);
      return;
    }
    if (!/^\d{10}$/.test(formData.phoneNumber)) {
      setError("Phone number must be 10 digits");
      setLoading(false);
      return;
    }
    if (!formData.address || formData.address.length < 2) {
      setError("Address must be at least 5 characters long");
      setLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin/register",
        {
          adminName: formData.adminName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          address: formData.address,
          password: formData.password,
        }
      );

      setSuccess(response.data.message);
      setTimeout(() => {
        navigate("/admin/login");
      }, 2000); // Redirect after 2 seconds to allow user to see success message
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e0f7fa, #ffffff)",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          background: "#fff",
          padding: "24px",
          borderRadius: "15px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "24px",
          }}
        >
          <img
            src={logoGreen}
            alt="AgriLink Logo"
            style={{
              width: "100px",
              maxWidth: "40%",
              height: "auto",
            }}
          />
          <h2
            style={{
              color: "#28a745",
              marginTop: "16px",
              fontSize: "clamp(1.5rem, 5vw, 1.8rem)",
            }}
          >
            Admin Registration
          </h2>
        </div>
        <form onSubmit={handleSubmit}>
          {error && (
            <div
              style={{
                background: "#f8d7da",
                color: "#721c24",
                padding: "10px",
                borderRadius: "5px",
                marginBottom: "16px",
                fontSize: "0.9rem",
                textAlign: "center",
              }}
            >
              {error}
            </div>
          )}
          {success && (
            <div
              style={{
                background: "#d4edda",
                color: "#155724",
                padding: "10px",
                borderRadius: "5px",
                marginBottom: "16px",
                fontSize: "0.9rem",
                textAlign: "center",
              }}
            >
              {success}
            </div>
          )}
          <div style={{ marginBottom: "16px" }}>
            <label
              htmlFor="adminName"
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "clamp(0.9rem, 2.5vw, 1rem)",
                color: "#333",
              }}
            >
              Full Name
            </label>
            <input
              type="text"
              id="adminName"
              name="adminName"
              placeholder="Enter full name"
              value={formData.adminName}
              onChange={handleChange}
              required
              disabled={loading}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                fontSize: "clamp(0.85rem, 2.5vw, 0.95rem)",
                boxSizing: "border-box",
                transition: "border-color 0.3s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#28a745")}
              onBlur={(e) => (e.target.style.borderColor = "#ccc")}
            />
          </div>
          <div style={{ marginBottom: "16px" }}>
            <label
              htmlFor="email"
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "clamp(0.9rem, 2.5vw, 1rem)",
                color: "#333",
              }}
            >
              Email address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                fontSize: "clamp(0.85rem, 2.5vw, 0.95rem)",
                boxSizing: "border-box",
                transition: "border-color 0.3s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#28a745")}
              onBlur={(e) => (e.target.style.borderColor = "#ccc")}
            />
          </div>
          <div style={{ marginBottom: "16px" }}>
            <label
              htmlFor="phoneNumber"
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "clamp(0.9rem, 2.5vw, 1rem)",
                color: "#333",
              }}
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              placeholder="Enter 10-digit phone number"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              disabled={loading}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                fontSize: "clamp(0.85rem, 2.5vw, 0.95rem)",
                boxSizing: "border-box",
                transition: "border-color 0.3s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#28a745")}
              onBlur={(e) => (e.target.style.borderColor = "#ccc")}
            />
          </div>
          <div style={{ marginBottom: "16px" }}>
            <label
              htmlFor="address"
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "clamp(0.9rem, 2.5vw, 1rem)",
                color: "#333",
              }}
            >
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              placeholder="Enter address"
              value={formData.address}
              onChange={handleChange}
              required
              disabled={loading}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                fontSize: "clamp(0.85rem, 2.5vw, 0.95rem)",
                boxSizing: "border-box",
                transition: "border-color 0.3s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#28a745")}
              onBlur={(e) => (e.target.style.borderColor = "#ccc")}
            />
          </div>
          <div style={{ marginBottom: "16px" }}>
            <label
              htmlFor="password"
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "clamp(0.9rem, 2.5vw, 1rem)",
                color: "#333",
              }}
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                fontSize: "clamp(0.85rem, 2.5vw, 0.95rem)",
                boxSizing: "border-box",
                transition: "border-color 0.3s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#28a745")}
              onBlur={(e) => (e.target.style.borderColor = "#ccc")}
            />
          </div>
          <div style={{ marginBottom: "16px" }}>
            <label
              htmlFor="confirmPassword"
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "clamp(0.9rem, 2.5vw, 1rem)",
                color: "#333",
              }}
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={loading}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                fontSize: "clamp(0.85rem, 2.5vw, 0.95rem)",
                boxSizing: "border-box",
                transition: "border-color 0.3s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#28a745")}
              onBlur={(e) => (e.target.style.borderColor = "#ccc")}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "10px",
              background: loading ? "#6c757d" : "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "25px",
              fontSize: "clamp(0.9rem, 2.5vw, 1rem)",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background 0.3s",
            }}
            onMouseOver={(e) =>
              !loading && (e.target.style.background = "#218838")
            }
            onMouseOut={(e) =>
              !loading && (e.target.style.background = "#28a745")
            }
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <p
          style={{
            textAlign: "center",
            marginTop: "16px",
            color: "#6c757d",
            fontSize: "clamp(0.85rem, 2.5vw, 0.9rem)",
          }}
        >
          Already have an account?{" "}
          <Link
            to="/admin/login"
            style={{
              color: "#28a745",
              textDecoration: "none",
            }}
            onMouseOver={(e) => (e.target.style.textDecoration = "underline")}
            onMouseOut={(e) => (e.target.style.textDecoration = "none")}
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
