import React from "react";
import "../Css/Devices.css"; // Added: Import Devices.css for the responsive margin class
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
  // Sample data for Activity Trends (Line Chart)
  const activityData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
    datasets: [
      {
        label: "Total Activities",
        data: [150, 180, 200, 220, 250, 230, 270, 300],
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const activityOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Farmer Activity Trends (2025)" },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: "Activities" } },
    },
  };

  // Sample data for Yield by Crop (Bar Chart)
  const yieldData = {
    labels: ["Teff", "Maize", "Wheat", "Barley"],
    datasets: [
      {
        label: "Yield (kg)",
        data: [5000, 4500, 3000, 2500],
        backgroundColor: ["#ff6384", "#36a2eb", "#ffcd56", "#4bc0c0"],
        borderColor: ["#ff6384", "#36a2eb", "#ffcd56", "#4bc0c0"],
        borderWidth: 1,
      },
    ],
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

  // Sample data for Farmer Engagement (Pie Chart)
  const engagementData = {
    labels: ["Active", "Inactive"],
    datasets: [
      {
        data: [82, 18],
        backgroundColor: ["#ff6384", "#36a2eb"],
        borderColor: ["#fff"],
        borderWidth: 1,
      },
    ],
  };

  const engagementOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Farmer Engagement Status" },
    },
  };

  return (
    <>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        {/* Changed this div to use the imported CSS class for responsiveness */}
        <div
          className="container-fluid p-4 ms-md-250"
          style={{ marginTop: "60px" }}
        >
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h2>Admin Analytics</h2>
              <p className="text-muted">
                Overview of farmer activities and metrics
              </p>
            </div>
          </div>

          <div className="row my-4">
            <SummaryCard
              title="Total Farmers"
              value="1,245"
              subtitle="+10% from last month"
              icon="👨‍🌾"
            />
            <SummaryCard
              title="Active Farms"
              value="920"
              subtitle="+7% from last month"
              icon="🌾"
            />
            <SummaryCard
              title="Total Yield"
              value="15,500 kg"
              subtitle="+12% from last month"
              icon="🌱"
            />
            <SummaryCard
              title="Engagement Rate"
              value="82%"
              subtitle="+5% from last month"
              icon="📊"
            />
          </div>

          <div className="row">
            <div className="col-md-6 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Activity Trends</h5>
                  <p className="card-text">Monthly activity overview</p>
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
                  <h5 className="card-title">Farmer Engagement</h5>
                  <p className="card-text">Active vs Inactive farmers</p>
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
