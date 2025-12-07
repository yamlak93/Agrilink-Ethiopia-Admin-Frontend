import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoGreen from "../assets/logoGreen.png"; // Assuming logoGreen is available
import axios from "axios"; // Ensure axios is installed: npm install axios

const LoginPage = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Basic client-side validation
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
    const isValidPhone = /^\d{10}$/.test(identifier);
    if (!isValidEmail && !isValidPhone) {
      setError("Please enter a valid email or 10-digit phone number");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin/login",
        {
          identifier,
          password,
          role: "Admin",
        }
      );

      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/admin/dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
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
            Admin Login
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
          <div
            style={{
              marginBottom: "16px",
            }}
          >
            <label
              htmlFor="formIdentifier"
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "clamp(0.9rem, 2.5vw, 1rem)",
                color: "#333",
              }}
            >
              Email or Phone Number
            </label>
            <input
              type="text"
              id="formIdentifier"
              placeholder="Enter email or 10-digit phone number"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
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
          <div
            style={{
              marginBottom: "16px",
            }}
          >
            <label
              htmlFor="formPassword"
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
              id="formPassword"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            {loading ? "Logging in..." : "Login"}
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
          Forgot password?{" "}
          <Link
            to="/admin/forgot-password"
            style={{
              color: "#28a745",
              textDecoration: "none",
            }}
            onMouseOver={(e) => (e.target.style.textDecoration = "underline")}
            onMouseOut={(e) => (e.target.style.textDecoration = "none")}
          >
            Reset here
          </Link>
        </p>
        <p
          style={{
            textAlign: "center",
            marginTop: "8px",
            color: "#6c757d",
            fontSize: "clamp(0.85rem, 2.5vw, 0.9rem)",
          }}
        >
          Don't have an account?{" "}
          <Link
            to="/admin/register"
            style={{
              color: "#28a745",
              textDecoration: "none",
            }}
            onMouseOver={(e) => (e.target.style.textDecoration = "underline")}
            onMouseOut={(e) => (e.target.style.textDecoration = "none")}
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
