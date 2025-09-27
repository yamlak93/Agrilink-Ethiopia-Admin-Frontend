import React, { useState, useEffect } from "react";
import "../Css/Devices.css";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import SummaryCard from "../components/SummaryCard";
import RecentActivity from "../components/RecentActivity";
import PendingDeliveries from "../components/PendingDeliveries";
import apiClient from "../api/api";

const Dashboard = () => {
  const [data, setData] = useState({
    totalFarmers: 0,
    totalBuyers: 0,
    totalProducts: 0,
    productPercentageChange: 0,
    totalOrders: 0,
    orderPercentageChange: 0,
    farmerPercentageChange: 0,
    buyerPercentageChange: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication required. Please log in.");
      window.location.href = "/admin/login"; // Redirect if no token
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    try {
      const [
        farmersResponse,
        buyersResponse,
        productsResponse,
        ordersResponse,
      ] = await Promise.all([
        apiClient.get("/users/total-farmers", { headers }),
        apiClient.get("/users/total-buyers", { headers }),
        apiClient.get("/products/total", { headers }),
        apiClient.get("/orders/total", { headers }),
      ]);

      setData({
        totalFarmers: farmersResponse.data.totalFarmers,
        farmerPercentageChange: farmersResponse.data.percentageChange,
        totalBuyers: buyersResponse.data.totalBuyers,
        buyerPercentageChange: buyersResponse.data.percentageChange,
        totalProducts: productsResponse.data.totalProducts,
        productPercentageChange: productsResponse.data.percentageChange,
        totalOrders: ordersResponse.data.totalOrders,
        orderPercentageChange: ordersResponse.data.percentageChange,
      });
    } catch (err) {
      console.error(
        "Failed to fetch dashboard data:",
        err.response?.data || err.message
      );
      setError("Failed to load dashboard data. Check server or token.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetchDashboardData().catch((err) => {
      if (isMounted) {
        console.error("Uncaught error in fetch:", err);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array ensures it runs only once on mount

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="alert alert-danger" role="alert">
          {error}
          <button className="btn btn-success ms-3" onClick={fetchDashboardData}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  const productSubtitle =
    data.productPercentageChange >= 0
      ? `+${data.productPercentageChange}% from last month`
      : `${data.productPercentageChange}% from last month`;

  const orderSubtitle =
    data.orderPercentageChange >= 0
      ? `+${data.orderPercentageChange}% from last month`
      : `${data.orderPercentageChange}% from last month`;

  const farmerSubtitle =
    data.farmerPercentageChange >= 0
      ? `+${data.farmerPercentageChange}% from last month`
      : `${data.farmerPercentageChange}% from last month`;

  const buyerSubtitle =
    data.buyerPercentageChange >= 0
      ? `+${data.buyerPercentageChange}% from last month`
      : `${data.buyerPercentageChange}% from last month`;

  return (
    <>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div
          className="container-fluid p-4 ms-md-250"
          style={{ marginTop: "60px" }}
        >
          <h2 className="fw-bold">Dashboard</h2>
          <p className="text-muted">
            Overview of the AgriLink Ethiopia platform
          </p>
          <div className="row mb-4">
            <SummaryCard
              title="Total Farmers"
              value={data.totalFarmers.toLocaleString()}
              subtitle={farmerSubtitle}
              icon="👨‍🌾"
            />
            <SummaryCard
              title="Total Buyers"
              value={data.totalBuyers.toLocaleString()}
              subtitle={buyerSubtitle}
              icon="🛍️"
            />
            <SummaryCard
              title="Total Products"
              value={data.totalProducts.toLocaleString()}
              subtitle={productSubtitle}
              icon="🛒"
            />
            <SummaryCard
              title="Total Orders"
              value={data.totalOrders.toLocaleString()}
              subtitle={orderSubtitle}
              icon="📋"
            />
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <RecentActivity />
            </div>
            <div className="col-md-6 mb-3">
              <PendingDeliveries />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
