import React, { useState, useEffect, useRef } from "react";
import {
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  Download,
  FileText,
} from "lucide-react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import apiClient from "../api/api";
import jsPDF from "jspdf";
import "../Css/Devices.css";
import "bootstrap/dist/css/bootstrap.min.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const OverviewReport = ({ startDate, endDate }) => {
  const [data, setData] = useState({
    overview: {
      totalUsers: 0,
      totalFarmers: 0,
      totalBuyers: 0,
      totalProducts: 0,
      totalOrders: 0,
      platformRevenue: 0,
      deliverySuccess: 0,
      userGrowth: 0,
    },
    topProducts: [],
    regionalData: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartRef = useRef(null);

  const fetchOverviewData = async () => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication required. Please log in.");
      setLoading(false);
      return;
    }

    if (!startDate || !endDate) {
      setError("Please select both start and end dates.");
      setLoading(false);
      return;
    }

    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(startDate) ||
      !/^\d{4}-\d{2}-\d{2}$/.test(endDate)
    ) {
      setError("Invalid date format. Use YYYY-MM-DD.");
      setLoading(false);
      return;
    }

    try {
      const response = await apiClient.get("/reports/overview", {
        params: { startDate, endDate },
        headers: { Authorization: `Bearer ${token}` },
      });

      setData({
        overview: {
          totalUsers: response.data.totalUsers || 0,
          totalFarmers: response.data.totalFarmers || 0,
          totalBuyers: response.data.totalBuyers || 0,
          totalProducts: response.data.totalProducts || 0,
          totalOrders: response.data.totalOrders || 0,
          platformRevenue: response.data.platformRevenue || 0,
          deliverySuccess: response.data.deliverySuccess || 0,
          userGrowth: response.data.userGrowth || 0,
        },
        topProducts: response.data.topProducts || [],
        regionalData: response.data.regionalData || [],
      });
      console.log(`Fetched overview report from ${startDate} to ${endDate}`);
    } catch (err) {
      console.error("Error fetching overview report:", {
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

  useEffect(() => {
    let isMounted = true;
    fetchOverviewData().catch((err) => {
      if (isMounted) {
        console.error("Uncaught error in fetch:", err);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [startDate, endDate]);

  const exportReport = (format) => {
    if (!data.overview.totalUsers) {
      setError("Cannot export report. No data available.");
      return;
    }

    const reportTitle = "AGRILINK ETHIOPIA";
    const reportType = "Platform Overview Report";
    const period = `${startDate} to ${endDate}`;
    const filePeriod = `${startDate}_to_${endDate}`;
    const pageHeight = 297; // A4 height in mm
    const bottomMargin = 20; // Bottom margin for page
    const maxY = pageHeight - bottomMargin; // Max y before adding new page

    if (format === "csv") {
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "Metric,Value\n";
      csvContent += `Total Users,${data.overview.totalUsers}\n`;
      csvContent += `Total Farmers,${data.overview.totalFarmers}\n`;
      csvContent += `Total Buyers,${data.overview.totalBuyers}\n`;
      csvContent += `Total Products,${data.overview.totalProducts}\n`;
      csvContent += `Total Orders,${data.overview.totalOrders}\n`;
      csvContent += `Platform Revenue,${data.overview.platformRevenue}\n`;
      csvContent += `Delivery Success Rate,${data.overview.deliverySuccess}%\n`;
      csvContent += `User Growth,${data.overview.userGrowth}%\n`;
      csvContent += "\nTop Products,Orders,Revenue,Category\n";
      data.topProducts.forEach((product) => {
        csvContent += `${product.name},${product.orders},${product.revenue},${product.category}\n`;
      });
      csvContent += "\nRegion,Farmers,Buyers,Orders\n";
      data.regionalData.forEach((region) => {
        csvContent += `${region.region},${region.farmers},${region.buyers},${region.orders}\n`;
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `overview_report_${filePeriod}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (format === "pdf") {
      const doc = new jsPDF();
      let y = 20;

      // Helper function to add new page if content overflows
      const checkPageOverflow = () => {
        if (y > maxY) {
          doc.addPage();
          y = 20;
          addHeaderFooter(); // Add header/footer to new page
        }
      };

      // Helper function to add header and footer
      const addHeaderFooter = () => {
        // Footer: Page number and branding
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.setFont("helvetica", "normal");
        doc.text(
          `Page ${doc.internal.getNumberOfPages()}`,
          doc.internal.pageSize.width - 30,
          pageHeight - 10,
          { align: "right" }
        );
        doc.text("Generated by AgriLink Ethiopia", 20, pageHeight - 10);
      };

      // Initial header and footer
      addHeaderFooter();

      // Title: AGRILINK ETHIOPIA
      doc.setFontSize(28);
      doc.setTextColor(0, 128, 0); // Green
      doc.setFont("helvetica", "bold");
      doc.text(reportTitle, doc.internal.pageSize.width / 2, y, {
        align: "center",
      });
      y += 15;

      // Report Type
      doc.setFontSize(18);
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "bold");
      doc.text(reportType, doc.internal.pageSize.width / 2, y, {
        align: "center",
      });
      y += 10;

      // Period
      doc.setFontSize(14);
      doc.setFont("helvetica", "italic");
      doc.text(`Period: ${period}`, doc.internal.pageSize.width / 2, y, {
        align: "center",
      });
      y += 15;

      // Divider
      doc.setLineWidth(0.5);
      doc.setDrawColor(0, 128, 0);
      doc.line(20, y, doc.internal.pageSize.width - 20, y);
      y += 10;

      // Overview Metrics Section
      doc.setFontSize(16);
      doc.setTextColor(0, 128, 0);
      doc.setFont("helvetica", "bold");
      doc.text("Platform Performance Overview", 20, y);
      y += 8;

      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");
      doc.text(
        "Key metrics showcasing the growth and impact of AgriLink Ethiopia",
        20,
        y
      );
      y += 8;
      checkPageOverflow();

      doc.text(
        `Total Users: ${data.overview.totalUsers.toLocaleString()} (Farmers and Buyers combined)`,
        20,
        y
      );
      y += 8;
      checkPageOverflow();
      doc.text(
        `Total Farmers: ${data.overview.totalFarmers.toLocaleString()} (Active agricultural producers)`,
        20,
        y
      );
      y += 8;
      checkPageOverflow();
      doc.text(
        `Total Buyers: ${data.overview.totalBuyers.toLocaleString()} (Marketplace consumers)`,
        20,
        y
      );
      y += 8;
      checkPageOverflow();
      doc.text(
        `Total Products: ${data.overview.totalProducts.toLocaleString()} (Agricultural listings)`,
        20,
        y
      );
      y += 8;
      checkPageOverflow();
      doc.text(
        `Total Orders: ${data.overview.totalOrders.toLocaleString()} (Marketplace transactions)`,
        20,
        y
      );
      y += 8;
      checkPageOverflow();
      doc.text(
        `Platform Revenue: ETB ${data.overview.platformRevenue.toLocaleString()} (2% commission)`,
        20,
        y
      );
      y += 8;
      checkPageOverflow();
      doc.text(
        `Delivery Success Rate: ${data.overview.deliverySuccess}% (Successful deliveries)`,
        20,
        y
      );
      y += 8;
      checkPageOverflow();
      doc.text(
        `User Growth: ${data.overview.userGrowth}% (Change from previous period)`,
        20,
        y
      );
      y += 15;
      checkPageOverflow();

      // Divider
      doc.setLineWidth(0.5);
      doc.setDrawColor(0, 128, 0);
      doc.line(20, y, doc.internal.pageSize.width - 20, y);
      y += 10;
      checkPageOverflow();

      // Regional Distribution Section
      doc.setFontSize(16);
      doc.setTextColor(0, 128, 0);
      doc.setFont("helvetica", "bold");
      doc.text("Regional Distribution", 20, y);
      y += 8;
      checkPageOverflow();

      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");
      doc.text(
        "Distribution of farmers, buyers, and orders across Ethiopian regions, highlighting market reach",
        20,
        y
      );
      y += 8;
      checkPageOverflow();

      // Add the bar chart
      if (chartRef.current) {
        const chartImage = chartRef.current.toBase64Image();
        doc.addImage(chartImage, "PNG", 20, y, 170, 85); // Fit within page width
        y += 90;
        checkPageOverflow();
      } else {
        doc.text(
          "Regional distribution chart not available in this export.",
          20,
          y
        );
        y += 10;
        checkPageOverflow();
      }

      // Divider
      doc.setLineWidth(0.5);
      doc.setDrawColor(0, 128, 0);
      doc.line(20, y, doc.internal.pageSize.width - 20, y);
      y += 10;
      checkPageOverflow();

      // Top Products Section
      doc.setFontSize(16);
      doc.setTextColor(0, 128, 0);
      doc.setFont("helvetica", "bold");
      doc.text("Top Performing Products", 20, y);
      y += 8;
      checkPageOverflow();

      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");
      doc.text(
        "Most ordered agricultural products this month, driving marketplace success",
        20,
        y
      );
      y += 8;
      checkPageOverflow();

      // Table header for Top Products
      doc.setFont("helvetica", "bold");
      doc.text("Product", 20, y);
      doc.text("Orders", 90, y, { align: "right" });
      doc.text("Revenue (ETB)", 130, y, { align: "right" });
      doc.text("Category", 170, y, { align: "right" });
      y += 6;
      doc.setLineWidth(0.2);
      doc.line(20, y, 190, y);
      y += 4;
      checkPageOverflow();

      // Table rows for Top Products
      doc.setFont("helvetica", "normal");
      data.topProducts.forEach((product) => {
        doc.text(product.name, 20, y);
        doc.text(product.orders.toLocaleString(), 90, y, { align: "right" });
        doc.text(product.revenue.toLocaleString(), 130, y, { align: "right" });
        doc.text(product.category, 170, y, { align: "right" });
        y += 8;
        checkPageOverflow();
      });
      y += 10;
      checkPageOverflow();

      // Divider
      doc.setLineWidth(0.5);
      doc.setDrawColor(0, 128, 0);
      doc.line(20, y, doc.internal.pageSize.width - 20, y);
      y += 10;
      checkPageOverflow();

      // Regional Data Table Section
      doc.setFontSize(16);
      doc.setTextColor(0, 128, 0);
      doc.setFont("helvetica", "bold");
      doc.text("Regional Data Summary", 20, y);
      y += 8;
      checkPageOverflow();

      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");
      doc.text(
        "Detailed breakdown of farmers, buyers, and orders by region",
        20,
        y
      );
      y += 8;
      checkPageOverflow();

      // Table header for Regional Data
      doc.setFont("helvetica", "bold");
      doc.text("Region", 20, y);
      doc.text("Farmers", 90, y, { align: "right" });
      doc.text("Buyers", 130, y, { align: "right" });
      doc.text("Orders", 170, y, { align: "right" });
      y += 6;
      doc.setLineWidth(0.2);
      doc.line(20, y, 190, y);
      y += 4;
      checkPageOverflow();

      // Table rows for Regional Data
      doc.setFont("helvetica", "normal");
      data.regionalData.forEach((region) => {
        doc.text(region.region, 20, y);
        doc.text(region.farmers.toLocaleString(), 90, y, { align: "right" });
        doc.text(region.buyers.toLocaleString(), 130, y, { align: "right" });
        doc.text(region.orders.toLocaleString(), 170, y, { align: "right" });
        y += 8;
        checkPageOverflow();
      });

      doc.save(`overview_report_${filePeriod}.pdf`);
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

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="alert alert-danger" role="alert">
          {error}
          <button className="btn btn-success ms-3" onClick={fetchOverviewData}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { overview, topProducts, regionalData } = data;

  return (
    <div className="mb-4">
      <div className="d-flex justify-content-end gap-2 mb-4">
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
      </div>

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4 mb-4">
        <div className="col">
          <div className="card summary-card h-100">
            <div className="summary-card-header">
              <h6 className="summary-card-title">Total Users</h6>
              <Users size={24} className="summary-card-icon" />
            </div>
            <div className="summary-card-body">
              <h3 className="summary-card-value">
                {overview.totalUsers.toLocaleString()}
              </h3>
              <p className="summary-card-subtext text-success">
                +{overview.userGrowth}% from last month
              </p>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card summary-card h-100">
            <div className="summary-card-header">
              <h6 className="summary-card-title">Active Farmers</h6>
              <Package size={24} className="summary-card-icon" />
            </div>
            <div className="summary-card-body">
              <h3 className="summary-card-value">
                {data.overview.totalFarmers.toLocaleString()}
              </h3>
              <p className="summary-card-subtext text-muted">
                {data.overview.totalUsers
                  ? (
                      (data.overview.totalFarmers / data.overview.totalUsers) *
                      100
                    ).toFixed(1)
                  : 0}
                % of total users
              </p>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card summary-card h-100">
            <div className="summary-card-header">
              <h6 className="summary-card-title">Total Orders</h6>
              <ShoppingCart size={24} className="summary-card-icon" />
            </div>
            <div className="summary-card-body">
              <h3 className="summary-card-value">
                {data.overview.totalOrders.toLocaleString()}
              </h3>
              <p className="summary-card-subtext text-muted">
                Avg.{" "}
                {data.overview.totalBuyers
                  ? (
                      data.overview.totalOrders / data.overview.totalBuyers
                    ).toFixed(1)
                  : 0}{" "}
                orders per buyer
              </p>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card summary-card h-100">
            <div className="summary-card-header">
              <h6 className="summary-card-title">Platform Revenue</h6>
              <DollarSign size={24} className="summary-card-icon" />
            </div>
            <div className="summary-card-body">
              <h3 className="summary-card-value">
                ETB {data.overview.platformRevenue.toLocaleString()}
              </h3>
              <p className="summary-card-subtext text-success">
                +{data.overview.revenueGrowth || 0}% from last month
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-header">
          <h5 className="card-title">Regional Distribution</h5>
          <p className="card-text text-muted">
            Distribution of farmers by farm location, buyers by address, and
            orders by farm location across Ethiopian regions
          </p>
        </div>
        <div className="card-body">
          <Bar
            ref={chartRef}
            data={{
              labels: data.regionalData.map((region) => region.region),
              datasets: [
                {
                  label: "Farmers",
                  data: data.regionalData.map((region) => region.farmers),
                  backgroundColor: "rgba(75, 192, 192, 0.6)",
                  borderColor: "rgba(75, 192, 192, 1)",
                  borderWidth: 1,
                },
                {
                  label: "Buyers",
                  data: data.regionalData.map((region) => region.buyers),
                  backgroundColor: "rgba(153, 102, 255, 0.6)",
                  borderColor: "rgba(153, 102, 255, 1)",
                  borderWidth: 1,
                },
                {
                  label: "Orders",
                  data: data.regionalData.map((region) => region.orders),
                  backgroundColor: "rgba(255, 159, 64, 0.6)",
                  borderColor: "rgba(255, 159, 64, 1)",
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
                title: {
                  display: true,
                  text: "Regional Distribution of Users and Orders",
                },
              },
              scales: { y: { beginAtZero: true } },
            }}
          />
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-header">
          <h5 className="card-title">Top Performing Products</h5>
          <p className="card-text text-muted">
            Most ordered agricultural products this month with delivered status
          </p>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr style={{ backgroundColor: "#f8f9fa" }}>
                  <th
                    style={{
                      fontSize: "14px",
                      color: "#6c757d",
                      fontWeight: "normal",
                    }}
                  >
                    Product
                  </th>
                  <th
                    style={{
                      fontSize: "14px",
                      color: "#6c757d",
                      fontWeight: "normal",
                    }}
                  >
                    Category
                  </th>
                  <th
                    style={{
                      fontSize: "14px",
                      color: "#6c757d",
                      fontWeight: "normal",
                      textAlign: "right",
                    }}
                  >
                    Orders
                  </th>
                  <th
                    style={{
                      fontSize: "14px",
                      color: "#6c757d",
                      fontWeight: "normal",
                      textAlign: "right",
                    }}
                  >
                    Revenue (ETB)
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.topProducts.map((product, index) => (
                  <tr
                    key={index}
                    className="bg-white shadow-sm rounded-lg mb-2"
                    style={{ border: "1px solid #e9ecef" }}
                  >
                    <td
                      style={{
                        fontSize: "14px",
                        color: "#212529",
                        padding: "12px",
                      }}
                    >
                      {product.name}
                    </td>
                    <td
                      style={{
                        fontSize: "14px",
                        color: "#212529",
                        padding: "12px",
                      }}
                    >
                      <span
                        className="badge bg-secondary"
                        style={{
                          fontSize: "12px",
                          padding: "4px 8px",
                          borderRadius: "12px",
                        }}
                      >
                        {product.category}
                      </span>
                    </td>
                    <td
                      style={{
                        fontSize: "14px",
                        color: "#212529",
                        padding: "12px",
                        textAlign: "right",
                      }}
                    >
                      {product.orders.toLocaleString()}
                    </td>
                    <td
                      style={{
                        fontSize: "14px",
                        color: "#212529",
                        padding: "12px",
                        textAlign: "right",
                      }}
                    >
                      {product.revenue.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h5 className="card-title">Regional Distribution</h5>
          <p className="card-text text-muted">
            Distribution of farmers by farm location, buyers by address, and
            orders by farm location across Ethiopian regions
          </p>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr style={{ backgroundColor: "#f8f9fa" }}>
                  <th
                    style={{
                      fontSize: "14px",
                      color: "#6c757d",
                      fontWeight: "normal",
                    }}
                  >
                    Region
                  </th>
                  <th
                    style={{
                      fontSize: "14px",
                      color: "#6c757d",
                      fontWeight: "normal",
                      textAlign: "right",
                    }}
                  >
                    Farmers
                  </th>
                  <th
                    style={{
                      fontSize: "14px",
                      color: "#6c757d",
                      fontWeight: "normal",
                      textAlign: "right",
                    }}
                  >
                    Buyers
                  </th>
                  <th
                    style={{
                      fontSize: "14px",
                      color: "#6c757d",
                      fontWeight: "normal",
                      textAlign: "right",
                    }}
                  >
                    Orders
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.regionalData.map((region, index) => (
                  <tr
                    key={index}
                    className="bg-white shadow-sm rounded-lg mb-2"
                    style={{ border: "1px solid #e9ecef" }}
                  >
                    <td
                      style={{
                        fontSize: "14px",
                        color: "#212529",
                        padding: "12px",
                      }}
                    >
                      {region.region}
                    </td>
                    <td
                      style={{
                        fontSize: "14px",
                        color: "#212529",
                        padding: "12px",
                        textAlign: "right",
                      }}
                    >
                      {region.farmers.toLocaleString()}
                    </td>
                    <td
                      style={{
                        fontSize: "14px",
                        color: "#212529",
                        padding: "12px",
                        textAlign: "right",
                      }}
                    >
                      {region.buyers.toLocaleString()}
                    </td>
                    <td
                      style={{
                        fontSize: "14px",
                        color: "#212529",
                        padding: "12px",
                        textAlign: "right",
                      }}
                    >
                      {region.orders.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewReport;
