import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import {
  BarChart3,
  Users,
  Package,
  ShoppingCart,
  Truck,
  Download,
  Eye,
  FileText,
  DollarSign,
} from "lucide-react";
import apiClient from "../api/api";
import jsPDF from "jspdf";
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

    // Skip data fetching for overview report, handled by OverviewReport.jsx
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
      console.error(`Error fetching ${type} report:`, {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        stack: err.stack,
      });
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

  const exportReport = (format) => {
    if (!isAuthenticated || !isReportGenerated) {
      setError(
        "Cannot export report. No report generated or authentication failed."
      );
      return;
    }

    const reportTitle = reportTypes.find(
      (type) => type.id === selectedReport
    ).name;
    const period = `${startDate} to ${endDate}`;
    const filePeriod = `${startDate}_to_${endDate}`;

    if (format === "csv") {
      let csvContent = "data:text/csv;charset=utf-8,";
      if (selectedReport === "overview") {
        setError(
          "CSV export for Overview Report must be handled within the component."
        );
        return;
      } else if (selectedReport === "users") {
        csvContent += "Metric,Value\n";
        csvContent += `New Registrations,${reportData.users.newRegistrations}\n`;
        csvContent += `Active Users,${reportData.users.activeUsers}\n`;
        csvContent += "\nRegion,Users,Growth (%)\n";
        reportData.users.topRegions.forEach((region) => {
          csvContent += `${region.region},${region.users},${region.growth}\n`;
        });
      } else if (selectedReport === "products") {
        csvContent += "Metric,Value\n";
        csvContent += `Total Listings,${reportData.products.totalListings}\n`;
        csvContent += `Active Listings,${reportData.products.activeListings}\n`;
        csvContent += `Average Price,${reportData.products.avgPrice}\n`;
        csvContent += "\nCategory,Listings,Orders,Revenue\n";
        reportData.products.topCategories.forEach((category) => {
          csvContent += `${category.category},${category.listings},${category.orders},${category.revenue}\n`;
        });
        csvContent += "\nProduct,Orders,Sales Percentage\n";
        reportData.products.productPerformance.forEach((product) => {
          csvContent += `${product.product},${product.orders},${product.salesPercentage}\n`;
        });
      } else if (selectedReport === "orders") {
        csvContent += "Metric,Value\n";
        csvContent += `Total Orders,${reportData.orders.totalOrders}\n`;
        csvContent += `Completed Orders,${reportData.orders.completedOrders}\n`;
        csvContent += `Pending Orders,${reportData.orders.pendingOrders}\n`;
        csvContent += `Cancelled Orders,${reportData.orders.cancelledOrders}\n`;
        csvContent += `Average Order Value,${reportData.orders.avgOrderValue}\n`;
        csvContent += "\nMonth,Orders,Value\n";
        reportData.orders.orderTrends.forEach((trend) => {
          csvContent += `${trend.month},${trend.orders},${trend.value}\n`;
        });
        csvContent += "\nPayment Method,Orders,Total Payments\n";
        reportData.orders.paymentMethods.forEach((method) => {
          csvContent += `${method.method},${method.orders},${method.totalPayments}\n`;
        });
      } else if (selectedReport === "delivery") {
        csvContent += "Metric,Value\n";
        csvContent += `Pending Deliveries,${reportData.delivery.pending}\n`;
        csvContent += `In Transit,${reportData.delivery.inTransit}\n`;
        csvContent += `Delivered,${reportData.delivery.delivered}\n`;
        csvContent += `Cancelled,${reportData.delivery.cancelled}\n`;
        csvContent += `Average Delivery Time,${reportData.delivery.averageDeliveryTime}\n`;
        csvContent += "\nRegion,Deliveries,Average Time (days)\n";
        reportData.delivery.deliveryRegions.forEach((region) => {
          csvContent += `${region.region},${region.deliveries},${region.avgTime}\n`;
        });
      } else if (selectedReport === "financial") {
        csvContent += "Metric,Value\n";
        csvContent += `Total Revenue,${reportData.financial.totalRevenue}\n`;
        csvContent += `Platform Fees,${reportData.financial.platformFees}\n`;
        csvContent += `Farmer Earnings,${reportData.financial.farmerEarnings}\n`;
        csvContent += `Average Transaction Fee,${reportData.financial.avgTransactionFee}\n`;
        csvContent += `Revenue Growth,${reportData.financial.revenueGrowth}%\n`;
        csvContent += "\nMonth,Revenue,Fees\n";
        reportData.financial.monthlyRevenue.forEach((month) => {
          csvContent += `${month.month},${month.revenue},${month.fees}\n`;
        });
        csvContent += "\nFarmer,Earnings,Orders\n";
        reportData.financial.topEarningFarmers.forEach((farmer) => {
          csvContent += `${farmer.name},${farmer.earnings},${farmer.orders}\n`;
        });
      }

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute(
        "download",
        `${selectedReport}_report_${filePeriod}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (format === "pdf") {
      const doc = new jsPDF();
      let y = 20;

      doc.setFontSize(16);
      doc.text(`${reportTitle} - ${period}`, 20, y);
      y += 10;

      doc.setFontSize(12);
      if (selectedReport === "overview") {
        setError(
          "PDF export for Overview Report must be handled within the component."
        );
        return;
      } else if (selectedReport === "users") {
        doc.text("User Metrics", 20, y);
        y += 10;
        doc.text(
          `New Registrations: ${reportData.users.newRegistrations.toLocaleString()}`,
          20,
          y
        );
        y += 10;
        doc.text(
          `Active Users: ${reportData.users.activeUsers.toLocaleString()}`,
          20,
          y
        );
        y += 20;
        doc.text("Top Regions", 20, y);
        y += 10;
        reportData.users.topRegions.forEach((region) => {
          doc.text(
            `${region.region}, ${region.users}, ${region.growth}%`,
            20,
            y
          );
          y += 10;
        });
      } else if (selectedReport === "products") {
        doc.text("Product Metrics", 20, y);
        y += 10;
        doc.text(
          `Total Listings: ${reportData.products.totalListings.toLocaleString()}`,
          20,
          y
        );
        y += 10;
        doc.text(
          `Active Listings: ${reportData.products.activeListings.toLocaleString()}`,
          20,
          y
        );
        y += 10;
        doc.text(`Average Price: ETB ${reportData.products.avgPrice}`, 20, y);
        y += 20;
        doc.text("Top Categories", 20, y);
        y += 10;
        reportData.products.topCategories.forEach((category) => {
          doc.text(
            `${category.category}, ${category.listings}, ${category.orders}, ${category.revenue}`,
            20,
            y
          );
          y += 10;
        });
        y += 10;
        doc.text("Product Performance", 20, y);
        y += 10;
        reportData.products.productPerformance.forEach((product) => {
          doc.text(
            `${product.product}, ${product.orders}, ${product.salesPercentage}%`,
            20,
            y
          );
          y += 10;
        });
      } else if (selectedReport === "orders") {
        doc.text("Order Metrics", 20, y);
        y += 10;
        doc.text(
          `Total Orders: ${reportData.orders.totalOrders.toLocaleString()}`,
          20,
          y
        );
        y += 10;
        doc.text(
          `Completed Orders: ${reportData.orders.completedOrders.toLocaleString()}`,
          20,
          y
        );
        y += 10;
        doc.text(`Pending Orders: ${reportData.orders.pendingOrders}`, 20, y);
        y += 10;
        doc.text(
          `Cancelled Orders: ${reportData.orders.cancelledOrders}`,
          20,
          y
        );
        y += 10;
        doc.text(
          `Average Order Value: ETB ${reportData.orders.avgOrderValue}`,
          20,
          y
        );
        y += 20;
        doc.text("Order Trends", 20, y);
        y += 10;
        reportData.orders.orderTrends.forEach((trend) => {
          doc.text(`${trend.month}, ${trend.orders}, ${trend.value}`, 20, y);
          y += 10;
        });
        y += 10;
        doc.text("Payment Methods", 20, y);
        y += 10;
        reportData.orders.paymentMethods.forEach((method) => {
          doc.text(
            `${method.method}, ${method.orders}, ${method.totalPayments}`,
            20,
            y
          );
          y += 10;
        });
      } else if (selectedReport === "delivery") {
        doc.text("Delivery Metrics", 20, y);
        y += 10;
        doc.text(`Pending Deliveries: ${reportData.delivery.pending}`, 20, y);
        y += 10;
        doc.text(`In Transit: ${reportData.delivery.inTransit}`, 20, y);
        y += 10;
        doc.text(`Delivered: ${reportData.delivery.delivered}`, 20, y);
        y += 10;
        doc.text(`Cancelled: ${reportData.delivery.cancelled}`, 20, y);
        y += 10;
        doc.text(
          `Average Delivery Time: ${reportData.delivery.averageDeliveryTime} days`,
          20,
          y
        );
        y += 20;
        doc.text("Delivery Regions", 20, y);
        y += 10;
        reportData.delivery.deliveryRegions.forEach((region) => {
          doc.text(
            `${region.region}, ${region.deliveries}, ${region.avgTime} days`,
            20,
            y
          );
          y += 10;
        });
      } else if (selectedReport === "financial") {
        doc.text("Financial Metrics", 20, y);
        y += 10;
        doc.text(
          `Total Revenue: ETB ${reportData.financial.totalRevenue.toLocaleString()}`,
          20,
          y
        );
        y += 10;
        doc.text(
          `Platform Fees: ETB ${reportData.financial.platformFees.toLocaleString()}`,
          20,
          y
        );
        y += 10;
        doc.text(
          `Farmer Earnings: ETB ${reportData.financial.farmerEarnings.toLocaleString()}`,
          20,
          y
        );
        y += 10;
        doc.text(
          `Average Transaction Fee: ETB ${reportData.financial.avgTransactionFee}`,
          20,
          y
        );
        y += 10;
        doc.text(
          `Revenue Growth: ${reportData.financial.revenueGrowth}%`,
          20,
          y
        );
        y += 20;
        doc.text("Monthly Revenue", 20, y);
        y += 10;
        reportData.financial.monthlyRevenue.forEach((month) => {
          doc.text(`${month.month}, ${month.revenue}, ${month.fees}`, 20, y);
          y += 10;
        });
        y += 10;
        doc.text("Top Earning Farmers", 20, y);
        y += 10;
        reportData.financial.topEarningFarmers.forEach((farmer) => {
          doc.text(
            `${farmer.name}, ${farmer.earnings}, ${farmer.orders}`,
            20,
            y
          );
          y += 10;
        });
      }

      doc.save(`${selectedReport}_report_${filePeriod}.pdf`);
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
                  {isReportGenerated && isAuthenticated && (
                    <>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => exportReport("pdf")}
                        style={{ fontSize: "14px", padding: "6px 12px" }}
                      >
                        <Download size={16} className="me-2" />
                        Export PDF
                      </button>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => exportReport("csv")}
                        style={{ fontSize: "14px", padding: "6px 12px" }}
                      >
                        <FileText size={16} className="me-2" />
                        Export CSV
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

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

          <div className="card">
            <div className="card-body">
              {isReportGenerated && !error && isAuthenticated && (
                <>
                  {selectedReport === "overview" && (
                    <OverviewReport startDate={startDate} endDate={endDate} />
                  )}
                  {selectedReport === "users" && reportData && (
                    <UserReport users={reportData.users} />
                  )}
                  {selectedReport === "products" && reportData && (
                    <ProductReport products={reportData.products} />
                  )}
                  {selectedReport === "orders" && reportData && (
                    <OrderReport orders={reportData.orders} />
                  )}
                  {selectedReport === "delivery" && reportData && (
                    <DeliveryReport delivery={reportData.delivery} />
                  )}
                  {selectedReport === "financial" && reportData && (
                    <FinancialReport financial={reportData.financial} />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
