import React, { useState, useEffect } from "react";
import "../Css/Devices.css";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import SummaryCard from "../components/SummaryCard";
import { Line } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import apiClient from "../api/api";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AdminAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState({
    totalUsers: 0,
    activeUsers: 0,
    engagementRate: 0,
    buyerSatisfaction: 0,
    currentMonthReview: 0,
    lastMonthReview: 0,
    userPercentageChange: 0,
    activePercentageChange: 0,
    engagementPercentageChange: 0,
  });
  const [activityData, setActivityData] = useState({
    labels: [],
    datasets: [],
  });
  const [yieldData, setYieldData] = useState({
    labels: [],
    datasets: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication required. Please log in.");
        window.location.href = "/admin/login";
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      try {
        const [summaryResponse, activityResponse, yieldResponse] =
          await Promise.all([
            apiClient.get("/analytics/farmers-summary", { headers }),
            apiClient.get("/analytics/activities", { headers }),
            apiClient.get("/analytics/yield-by-crop", { headers }),
          ]);
        console.log("Fetched analytics data:", summaryResponse.data);
        console.log("Fetched activity data:", activityResponse.data);
        console.log("Fetched yield data:", yieldResponse.data);
        setAnalyticsData(summaryResponse.data);
        setActivityData(activityResponse.data);
        setYieldData(yieldResponse.data);
      } catch (err) {
        console.error("Failed to fetch data:", err.response?.data || err);
        if (err.response?.status === 401) {
          setError("Authentication failed. Please log in again.");
          window.location.href = "/admin/login";
        } else {
          setError(
            `Failed to load analytics. ${
              err.response?.data?.message || err.message
            }`
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  // Calculate satisfaction change percentage in frontend
  const satisfactionChange =
    analyticsData.lastMonthReview > 0
      ? parseFloat(
          (
            ((analyticsData.currentMonthReview -
              analyticsData.lastMonthReview) /
              analyticsData.lastMonthReview) *
            100
          ).toFixed(2)
        )
      : analyticsData.currentMonthReview > 0
      ? 100.0
      : 0.0;

  const activityOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "User Activity Trends (2025)" },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: "Activities" } },
    },
  };

  const yieldOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Yield by Crop Type" },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: "Yield (kg)" } },
    },
  };

  // Sample data for User Engagement (Pie Chart)
  const engagementData = {
    labels: ["Engaged", "Not Engaged"],
    datasets: [
      {
        data: [
          analyticsData.engagementRate,
          100 - analyticsData.engagementRate,
        ],
        backgroundColor: ["#36a2eb", "#ff6384"],
        borderColor: ["#fff"],
        borderWidth: 1,
      },
    ],
  };

  const engagementOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "User Engagement Status" },
    },
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

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="alert alert-danger" role="alert">
          {error}
          <button
            className="btn btn-success ms-3"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div
          className="container-fluid p-4 ms-md-250"
          style={{ marginTop: "60px" }}
        >
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h2>Admin Analytics</h2>
              <p className="text-muted">
                Overview of user activities and metrics
              </p>
            </div>
          </div>

          <div className="row my-4">
            <SummaryCard
              title="Total Users"
              value={analyticsData.totalUsers.toLocaleString()}
              subtitle={`${analyticsData.userPercentageChange >= 0 ? "+" : ""}${
                analyticsData.userPercentageChange
              }% from last month`}
              icon="👥"
            />
            <SummaryCard
              title="Active Users"
              value={analyticsData.activeUsers.toLocaleString()}
              subtitle={`${
                analyticsData.activePercentageChange >= 0 ? "+" : ""
              }${analyticsData.activePercentageChange}% from last month`}
              icon="🌱"
            />
            <SummaryCard
              title="Engagement Rate"
              value={`${analyticsData.engagementRate}%`}
              subtitle={`${
                analyticsData.engagementPercentageChange >= 0 ? "+" : ""
              }${analyticsData.engagementPercentageChange}% from last month`}
              icon="📈"
            />
            <SummaryCard
              title="Buyer Satisfaction"
              value={analyticsData.currentMonthReview.toFixed(1)}
              subtitle={`${
                satisfactionChange >= 0 ? "+" : ""
              }${satisfactionChange}% from last month`}
              icon="⭐"
            />
          </div>

          <div className="row">
            <div className="col-md-6 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Activity Trends</h5>
                  <p className="card-text">Monthly activity overview</p>
                  <p className="card-text">
                    Activities like product listing, orders placed, users review
                    on products.
                  </p>
                  <Line data={activityData} options={activityOptions} />
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Yield by Crop</h5>
                  <p className="card-text">Production by crop type</p>
                  <Bar data={yieldData} options={yieldOptions} />
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">User Engagement Status</h5>
                  <p className="card-text">Engaged vs Not Engaged users</p>
                  <Pie data={engagementData} options={engagementOptions} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminAnalytics;
