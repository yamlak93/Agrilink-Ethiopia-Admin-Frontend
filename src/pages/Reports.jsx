import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import {
  BarChart3,
  Users,
  Package,
  ShoppingCart,
  Truck,
  Eye,
  DollarSign,
} from "lucide-react";
import apiClient from "../api/api";
import OverviewReport from "../components/OverviewReport";
import UserReport from "../components/UserReport";
import ProductReport from "../components/ProductReport";
import OrderReport from "../components/OrderReport";
import DeliveryReport from "../components/DeliveryReport";
import FinancialReport from "../components/FinancialReport";
import "../Css/Devices.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Reports = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedReport, setSelectedReport] = useState("overview");
  const [isReportGenerated, setIsReportGenerated] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState(null);

  const reportTypes = [
    { id: "overview", name: "Platform Overview", icon: BarChart3 },
    { id: "users", name: "User Analytics", icon: Users },
    { id: "products", name: "Product Performance", icon: Package },
    { id: "orders", name: "Order Analytics", icon: ShoppingCart },
    { id: "delivery", name: "Delivery Reports", icon: Truck },
    { id: "financial", name: "Financial Reports", icon: DollarSign },
  ];

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("No JWT token found. Redirecting to login.");
        setIsAuthenticated(false);
        setError("Authentication required. Please log in to view reports.");
        setLoading(false);
        return;
      }
      setIsAuthenticated(true);
      setError(null);
      setLoading(false);
    };

    checkAuth();
  }, []);

  const generateReport = async (type) => {
    if (!isAuthenticated) {
      setError("Cannot generate report. Authentication failed.");
      return;
    }
    if (!startDate || !endDate) {
      setError("Please select both start and end dates.");
      return;
    }
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(startDate) ||
      !/^\d{4}-\d{2}-\d{2}$/.test(endDate)
    ) {
      setError("Invalid date format. Use YYYY-MM-DD.");
      return;
    }

    if (type === "overview") {
      setIsReportGenerated(true);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");
    try {
      const response = await apiClient.get(`/reports/${type}`, {
        params: { startDate, endDate },
        headers: { Authorization: `Bearer ${token}` },
      });

      setReportData(response.data);
      setIsReportGenerated(true);
      console.log(`Fetched ${type} report from ${startDate} to ${endDate}`);
    } catch (err) {
      console.error(`Error fetching ${type} report:`, err);
      if (err.response?.status === 401) {
        setError("Session expired. Redirecting to login...");
        setTimeout(() => (window.location.href = "/admin/login"), 2000);
      } else if (err.response?.status === 400) {
        setError(
          err.response.data.message ||
            "Invalid date range. Please check your inputs."
        );
      } else {
        setError(
          err.response?.data?.details ||
            err.response?.data?.message ||
            "Failed to fetch report. Please try again later."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error && !isAuthenticated) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="alert alert-danger" role="alert">
          {error}
          <button
            className="btn btn-success ms-3"
            onClick={() => (window.location.href = "/admin/login")}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light">
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div
          className="container-fluid p-4 ms-md-250"
          style={{ marginTop: "60px" }}
        >
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2
                className="fw-bold"
                style={{ fontSize: "24px", color: "#1a2e5a" }}
              >
                Reports
              </h2>
              <p
                className="text-muted"
                style={{ fontSize: "14px", color: "#6c757d" }}
              >
                Comprehensive insights into AgriLink Ethiopia platform
                performance
              </p>
            </div>
          </div>

          {/* === DATE & REPORT SELECTOR === */}
          <div className="card mb-4">
            <div className="card-body">
              <div className="row">
                <div className="col-12 col-md-4 mb-2 mb-md-0">
                  <label className="form-label small">Date Range</label>
                  <div className="d-flex gap-2">
                    <input
                      type="date"
                      className="form-control form-control-sm"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      style={{ fontSize: "14px", padding: "6px 12px" }}
                      disabled={!isAuthenticated}
                    />
                    <input
                      type="date"
                      className="form-control form-control-sm"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      style={{ fontSize: "14px", padding: "6px 12px" }}
                      disabled={!isAuthenticated}
                    />
                  </div>
                </div>
                <div className="col-12 col-md-4 mb-2 mb-md-0">
                  <label className="form-label small">Report Type</label>
                  <select
                    value={selectedReport}
                    onChange={(e) => setSelectedReport(e.target.value)}
                    className="form-select form-select-sm"
                    style={{ fontSize: "14px", padding: "6px 12px" }}
                    disabled={!isAuthenticated}
                  >
                    {reportTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-12 col-md-4 d-flex align-items-end gap-2">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => generateReport(selectedReport)}
                    style={{ fontSize: "14px", padding: "6px 12px" }}
                    disabled={!isAuthenticated}
                  >
                    <Eye size={16} className="me-2" />
                    Generate Report
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* === ERROR ALERT === */}
          {error && isAuthenticated && (
            <div
              className="alert alert-danger d-flex align-items-center justify-content-between"
              role="alert"
            >
              <span>{error}</span>
              <button
                className="btn btn-success btn-sm"
                onClick={() => setError(null)}
              >
                Clear
              </button>
            </div>
          )}

          {/* === REPORT CONTENT === */}
          <div className="card">
            <div className="card-body">
              {isReportGenerated && !error && isAuthenticated ? (
                <>
                  {selectedReport === "overview" && (
                    <OverviewReport startDate={startDate} endDate={endDate} />
                  )}
                  {selectedReport === "users" && reportData && (
                    <UserReport
                      users={reportData.users}
                      startDate={startDate}
                      endDate={endDate}
                    />
                  )}
                  {selectedReport === "products" && reportData && (
                    <ProductReport
                      products={reportData.products}
                      startDate={startDate}
                      endDate={endDate}
                    />
                  )}
                  {selectedReport === "orders" && reportData && (
                    <OrderReport
                      orders={reportData.orders}
                      startDate={startDate}
                      endDate={endDate}
                    />
                  )}
                  {selectedReport === "delivery" && reportData.delivery && (
                    <DeliveryReport
                      delivery={reportData.delivery}
                      startDate={startDate}
                      endDate={endDate}
                    />
                  )}
                  {selectedReport === "financial" && reportData && (
                    <FinancialReport
                      financial={reportData.financial}
                      startDate={startDate}
                      endDate={endDate}
                    />
                  )}
                </>
              ) : (
                /* === EMPTY STATE – NO REPORT SELECTED === */
                <div className="text-center py-5">
                  <BarChart3 size={64} className="text-muted mb-3" />
                  <h4 className="text-muted fw-normal">No Report Selected</h4>
                  <p className="text-muted small">
                    Select a report type and date range above, then click{" "}
                    <strong>Generate Report</strong> to view insights.
                  </p>
                  <button
                    className="btn btn-outline-primary btn-sm mt-2"
                    onClick={() => generateReport(selectedReport)}
                    disabled={!startDate || !endDate}
                  >
                    <Eye size={16} className="me-1" />
                    Generate Now
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
