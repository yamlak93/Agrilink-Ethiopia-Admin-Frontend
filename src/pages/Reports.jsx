import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import {
  BarChart3,
  Users,
  Package,
  ShoppingCart,
  Truck,
  Download,
  Calendar,
  Eye,
  FileText,
  DollarSign,
  UserCheck,
  Clock,
  MapPin,
  CreditCard,
} from "lucide-react";
import jsPDF from "jspdf";
import "../Css/Devices.css"; // Import Devices.css for ms-md-250
import "bootstrap/dist/css/bootstrap.min.css";

const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [selectedReport, setSelectedReport] = useState("overview");
  const [isReportGenerated, setIsReportGenerated] = useState(false);

  const reportData = {
    overview: {
      totalUsers: 15847,
      totalFarmers: 9234,
      totalBuyers: 6613,
      totalProducts: 3456,
      totalOrders: 8923,
      totalRevenue: 2456789,
      deliverySuccess: 94.2,
      userGrowth: 12.5,
    },
    users: {
      newRegistrations: 1234,
      activeUsers: 12456,
      topRegions: [
        { region: "Addis Ababa", users: 3456, growth: 15.2 },
        { region: "Oromia", users: 2890, growth: 12.8 },
        { region: "Amhara", users: 2234, growth: 8.9 },
        { region: "SNNP", users: 1876, growth: 11.3 },
        { region: "Tigray", users: 1543, growth: 6.7 },
      ],
    },
    products: {
      totalListings: 3456,
      activeListings: 2890,
      avgPrice: 145.67,
      topCategories: [
        { category: "Grains", listings: 1234, orders: 4567, revenue: 567890 },
        {
          category: "Vegetables",
          listings: 987,
          orders: 3456,
          revenue: 345678,
        },
        { category: "Fruits", listings: 654, orders: 2345, revenue: 234567 },
        {
          category: "Cash Crops",
          listings: 432,
          orders: 1890,
          revenue: 456789,
        },
        { category: "Legumes", listings: 321, orders: 1234, revenue: 123456 },
      ],
      productPerformance: [
        { product: "Teff", orders: 1234, salesPercentage: 28.5 },
        { product: "Coffee Beans", orders: 987, salesPercentage: 22.8 },
        { product: "Maize", orders: 876, salesPercentage: 20.2 },
        { product: "Tomatoes", orders: 654, salesPercentage: 15.1 },
        { product: "Onions", orders: 543, salesPercentage: 13.4 },
      ],
    },
    orders: {
      totalOrders: 8923,
      completedOrders: 8234,
      pendingOrders: 456,
      cancelledOrders: 233,
      avgOrderValue: 275.45,
      orderTrends: [
        { month: "Jan", orders: 1234, value: 340567 },
        { month: "Feb", orders: 1456, value: 401234 },
        { month: "Mar", orders: 1678, value: 462345 },
        { month: "Apr", orders: 1890, value: 520678 },
        { month: "May", orders: 2123, value: 584567 },
      ],
      paymentMethods: [
        { method: "Chapa", orders: 8923, totalPayments: 2456789 },
      ],
    },
    delivery: {
      pending: 234,
      inTransit: 456,
      delivered: 7890,
      cancelled: 123,
      averageDeliveryTime: 2.3,
      deliveryRegions: [
        { region: "Addis Ababa", deliveries: 2345, avgTime: 1.2 },
        { region: "Oromia", deliveries: 1890, avgTime: 2.8 },
        { region: "Amhara", deliveries: 1567, avgTime: 3.1 },
        { region: "SNNP", deliveries: 1234, avgTime: 2.9 },
        { region: "Tigray", deliveries: 987, avgTime: 3.5 },
      ],
    },
    financial: {
      totalRevenue: 2456789,
      platformFees: 123456,
      farmerEarnings: 2210345,
      avgTransactionFee: 12.45,
      revenueGrowth: 18.2,
      monthlyRevenue: [
        { month: "Jan", revenue: 340567, fees: 17028 },
        { month: "Feb", revenue: 401234, fees: 20062 },
        { month: "Mar", revenue: 462345, fees: 23117 },
        { month: "Apr", revenue: 520678, fees: 26034 },
        { month: "May", revenue: 584567, fees: 29228 },
      ],
      topEarningFarmers: [
        { name: "Farmer A", earnings: 45678, orders: 234 },
        { name: "Farmer B", earnings: 38901, orders: 198 },
        { name: "Farmer C", earnings: 34567, orders: 176 },
        { name: "Farmer D", earnings: 29876, orders: 145 },
        { name: "Farmer E", earnings: 27543, orders: 132 },
      ],
    },
    topProducts: [
      { name: "Teff", orders: 1234, revenue: 456789, category: "Grains" },
      {
        name: "Coffee Beans",
        orders: 987,
        revenue: 345678,
        category: "Cash Crops",
      },
      { name: "Maize", orders: 876, revenue: 234567, category: "Grains" },
      {
        name: "Tomatoes",
        orders: 654,
        revenue: 123456,
        category: "Vegetables",
      },
      { name: "Onions", orders: 543, revenue: 98765, category: "Vegetables" },
    ],
    regionalData: [
      { region: "Addis Ababa", farmers: 1234, buyers: 2345, orders: 3456 },
      { region: "Oromia", farmers: 2345, buyers: 1234, orders: 2345 },
      { region: "Amhara", farmers: 1876, buyers: 987, orders: 1876 },
      { region: "Tigray", farmers: 876, buyers: 654, orders: 987 },
      { region: "SNNP", farmers: 1098, buyers: 876, orders: 1234 },
    ],
  };

  const reportTypes = [
    { id: "overview", name: "Platform Overview", icon: BarChart3 },
    { id: "users", name: "User Analytics", icon: Users },
    { id: "products", name: "Product Performance", icon: Package },
    { id: "orders", name: "Order Analytics", icon: ShoppingCart },
    { id: "delivery", name: "Delivery Reports", icon: Truck },
    { id: "financial", name: "Financial Reports", icon: DollarSign },
  ];

  const generateReport = (type) => {
    console.log(`Generating ${type} report for ${selectedPeriod} period`);
    setIsReportGenerated(true);
  };

  const exportReport = (format) => {
    console.log(`Exporting ${selectedReport} report as ${format}`);
    const reportTitle = reportTypes.find(
      (type) => type.id === selectedReport
    ).name;
    const periodMap = {
      weekly: "Last 7 Days",
      monthly: "Last 30 Days",
      quarterly: "Last 3 Months",
      yearly: "Last Year",
    };
    const period = periodMap[selectedPeriod];

    if (format === "csv") {
      let csvContent = "data:text/csv;charset=utf-8,";
      if (selectedReport === "overview") {
        csvContent += "Metric,Value\n";
        csvContent += `Total Users,${reportData.overview.totalUsers}\n`;
        csvContent += `Total Farmers,${reportData.overview.totalFarmers}\n`;
        csvContent += `Total Buyers,${reportData.overview.totalBuyers}\n`;
        csvContent += `Total Products,${reportData.overview.totalProducts}\n`;
        csvContent += `Total Orders,${reportData.overview.totalOrders}\n`;
        csvContent += `Platform Revenue,${reportData.overview.totalRevenue}\n`;
        csvContent += `Delivery Success Rate,${reportData.overview.deliverySuccess}%\n`;
        csvContent += `User Growth,${reportData.overview.userGrowth}%\n`;
        csvContent += "\nTop Products,Orders,Revenue,Category\n";
        reportData.topProducts.forEach((product) => {
          csvContent += `${product.name},${product.orders},${product.revenue},${product.category}\n`;
        });
        csvContent += "\nRegion,Farmers,Buyers,Orders\n";
        reportData.regionalData.forEach((region) => {
          csvContent += `${region.region},${region.farmers},${region.buyers},${region.orders}\n`;
        });
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
        `${selectedReport}_report_${selectedPeriod}.csv`
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
        doc.text("Overview Metrics", 20, y);
        y += 10;
        doc.text(
          `Total Users: ${reportData.overview.totalUsers.toLocaleString()}`,
          20,
          y
        );
        y += 10;
        doc.text(
          `Total Farmers: ${reportData.overview.totalFarmers.toLocaleString()}`,
          20,
          y
        );
        y += 10;
        doc.text(
          `Total Buyers: ${reportData.overview.totalBuyers.toLocaleString()}`,
          20,
          y
        );
        y += 10;
        doc.text(
          `Total Products: ${reportData.overview.totalProducts.toLocaleString()}`,
          20,
          y
        );
        y += 10;
        doc.text(
          `Total Orders: ${reportData.overview.totalOrders.toLocaleString()}`,
          20,
          y
        );
        y += 10;
        doc.text(
          `Platform Revenue: ETB ${reportData.overview.totalRevenue.toLocaleString()}`,
          20,
          y
        );
        y += 10;
        doc.text(
          `Delivery Success Rate: ${reportData.overview.deliverySuccess}%`,
          20,
          y
        );
        y += 10;
        doc.text(`User Growth: ${reportData.overview.userGrowth}%`, 20, y);
        y += 20;

        doc.text("Top Products", 20, y);
        y += 10;
        reportData.topProducts.forEach((product) => {
          doc.text(
            `${product.name}, ${product.orders}, ${product.revenue}, ${product.category}`,
            20,
            y
          );
          y += 10;
        });
        y += 10;

        doc.text("Regional Data", 20, y);
        y += 10;
        reportData.regionalData.forEach((region) => {
          doc.text(
            `${region.region}, ${region.farmers}, ${region.buyers}, ${region.orders}`,
            20,
            y
          );
          y += 10;
        });
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

      doc.save(`${selectedReport}_report_${selectedPeriod}.pdf`);
    }
  };

  const renderOverviewReport = () => (
    <div className="mb-4">
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4 mb-4">
        <div className="col">
          <div className="card summary-card h-100">
            <div className="summary-card-header">
              <h6 className="summary-card-title">Total Users</h6>
              <Users size={24} className="summary-card-icon" />
            </div>
            <div className="summary-card-body">
              <h3 className="summary-card-value">
                {reportData.overview.totalUsers.toLocaleString()}
              </h3>
              <p className="summary-card-subtext text-success">
                +{reportData.overview.userGrowth}% from last month
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
                {reportData.overview.totalFarmers.toLocaleString()}
              </h3>
              <p className="summary-card-subtext text-muted">
                {(
                  (reportData.overview.totalFarmers /
                    reportData.overview.totalUsers) *
                  100
                ).toFixed(1)}
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
                {reportData.overview.totalOrders.toLocaleString()}
              </h3>
              <p className="summary-card-subtext text-muted">
                Avg.{" "}
                {(
                  reportData.overview.totalOrders /
                  reportData.overview.totalBuyers
                ).toFixed(1)}{" "}
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
                ETB {reportData.overview.totalRevenue.toLocaleString()}
              </h3>
              <p className="summary-card-subtext text-success">
                +18.2% from last month
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-header">
          <h5 className="card-title">Top Performing Products</h5>
          <p className="card-text text-muted">
            Most ordered agricultural products this month
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
                {reportData.topProducts.map((product, index) => (
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
            User and order distribution across Ethiopian regions
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
                {reportData.regionalData.map((region, index) => (
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

  const renderUserReport = () => (
    <div className="mb-4">
      <div className="row row-cols-1 row-cols-md-2 g-4 mb-4">
        <div className="col">
          <div className="card summary-card h-100">
            <div className="summary-card-header">
              <h6 className="summary-card-title">New Registrations</h6>
              <UserCheck size={24} className="summary-card-icon" />
            </div>
            <div className="summary-card-body">
              <h3 className="summary-card-value">
                {reportData.users.newRegistrations.toLocaleString()}
              </h3>
              <p className="summary-card-subtext text-muted">This month</p>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card summary-card h-100">
            <div className="summary-card-header">
              <h6 className="summary-card-title">Active Users</h6>
              <Users size={24} className="summary-card-icon" />
            </div>
            <div className="summary-card-body">
              <h3 className="summary-card-value">
                {reportData.users.activeUsers.toLocaleString()}
              </h3>
              <p className="summary-card-subtext text-muted">
                Monthly active users
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h5 className="card-title">Top Regions by User Growth</h5>
          <p className="card-text text-muted">
            Regional user registration trends
          </p>
        </div>
        <div className="card-body">
          {reportData.users.topRegions.map((region, index) => (
            <div
              key={index}
              className="d-flex justify-content-between align-items-center mb-3"
            >
              <div className="d-flex align-items-center">
                <MapPin size={16} className="text-muted me-2" />
                <span>{region.region}</span>
              </div>
              <div className="text-end">
                <div className="fw-bold">{region.users.toLocaleString()}</div>
                <div className="text-success small">+{region.growth}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProductReport = () => (
    <div className="mb-4">
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4 mb-4">
        <div className="col">
          <div className="card summary-card h-100">
            <div className="summary-card-header">
              <h6 className="summary-card-title">Total Listings</h6>
              <Package size={24} className="summary-card-icon" />
            </div>
            <div className="summary-card-body">
              <h3 className="summary-card-value">
                {reportData.products.totalListings.toLocaleString()}
              </h3>
              <p className="summary-card-subtext text-muted">
                All product listings
              </p>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card summary-card h-100">
            <div className="summary-card-header">
              <h6 className="summary-card-title">Active Listings</h6>
              <Package size={24} className="summary-card-icon" />
            </div>
            <div className="summary-card-body">
              <h3 className="summary-card-value">
                {reportData.products.activeListings.toLocaleString()}
              </h3>
              <p className="summary-card-subtext text-muted">
                {(
                  (reportData.products.activeListings /
                    reportData.products.totalListings) *
                  100
                ).toFixed(1)}
                % of total
              </p>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card summary-card h-100">
            <div className="summary-card-header">
              <h6 className="summary-card-title">Average Price</h6>
              <DollarSign size={24} className="summary-card-icon" />
            </div>
            <div className="summary-card-body">
              <h3 className="summary-card-value">
                ETB {reportData.products.avgPrice}
              </h3>
              <p className="summary-card-subtext text-muted">
                Per product listing
              </p>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card summary-card h-100">
            <div className="summary-card-header">
              <h6 className="summary-card-title">Categories</h6>
              <Package size={24} className="summary-card-icon" />
            </div>
            <div className="summary-card-body">
              <h3 className="summary-card-value">
                {reportData.products.topCategories.length}
              </h3>
              <p className="summary-card-subtext text-muted">
                Product categories
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="row row-cols-1 row-cols-lg-2 g-4">
        <div className="col">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Top Categories</h5>
              <p className="card-text text-muted">
                Performance by product category
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
                        Listings
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
                        Revenue
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.products.topCategories.map(
                      (category, index) => (
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
                            {category.category}
                          </td>
                          <td
                            style={{
                              fontSize: "14px",
                              color: "#212529",
                              padding: "12px",
                              textAlign: "right",
                            }}
                          >
                            {category.listings}
                          </td>
                          <td
                            style={{
                              fontSize: "14px",
                              color: "#212529",
                              padding: "12px",
                              textAlign: "right",
                            }}
                          >
                            {category.orders.toLocaleString()}
                          </td>
                          <td
                            style={{
                              fontSize: "14px",
                              color: "#212529",
                              padding: "12px",
                              textAlign: "right",
                            }}
                          >
                            ETB {category.revenue.toLocaleString()}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Product Performance</h5>
              <p className="card-text text-muted">
                Top products by sales percentage
              </p>
            </div>
            <div className="card-body">
              {reportData.products.productPerformance.map((product, index) => (
                <div
                  key={index}
                  className="d-flex justify-content-between align-items-center mb-3"
                >
                  <div>
                    <div className="fw-bold">{product.product}</div>
                    <div className="text-muted small">
                      {product.orders} orders
                    </div>
                  </div>
                  <div className="text-end">
                    <div className="text-success fw-bold">
                      {product.salesPercentage}%
                    </div>
                    <div className="text-muted small">of total sales</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOrderReport = () => (
    <div className="mb-4">
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4 mb-4">
        <div className="col">
          <div className="card summary-card h-100">
            <div className="summary-card-header">
              <h6 className="summary-card-title">Total Orders</h6>
              <ShoppingCart size={24} className="summary-card-icon" />
            </div>
            <div className="summary-card-body">
              <h3 className="summary-card-value">
                {reportData.orders.totalOrders.toLocaleString()}
              </h3>
              <p className="summary-card-subtext text-muted">All time orders</p>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card summary-card h-100">
            <div className="summary-card-header">
              <h6 className="summary-card-title">Completed Orders</h6>
              <ShoppingCart size={24} className="summary-card-icon" />
            </div>
            <div className="summary-card-body">
              <h3 className="summary-card-value">
                {reportData.orders.completedOrders.toLocaleString()}
              </h3>
              <p className="summary-card-subtext text-muted">
                {(
                  (reportData.orders.completedOrders /
                    reportData.orders.totalOrders) *
                  100
                ).toFixed(1)}
                % completion rate
              </p>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card summary-card h-100">
            <div className="summary-card-header">
              <h6 className="summary-card-title">Avg. Order Value</h6>
              <DollarSign size={24} className="summary-card-icon" />
            </div>
            <div className="summary-card-body">
              <h3 className="summary-card-value">
                ETB {reportData.orders.avgOrderValue}
              </h3>
              <p className="summary-card-subtext text-muted">Per order</p>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card summary-card h-100">
            <div className="summary-card-header">
              <h6 className="summary-card-title">Pending Orders</h6>
              <Clock size={24} className="summary-card-icon" />
            </div>
            <div className="summary-card-body">
              <h3 className="summary-card-value">
                {reportData.orders.pendingOrders}
              </h3>
              <p className="summary-card-subtext text-muted">
                Awaiting processing
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="row row-cols-1 row-cols-lg-2 g-4">
        <div className="col">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Monthly Order Trends</h5>
              <p className="card-text text-muted">
                Order volume and value over time
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
                        Month
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
                        Value (ETB)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.orders.orderTrends.map((trend, index) => (
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
                          {trend.month}
                        </td>
                        <td
                          style={{
                            fontSize: "14px",
                            color: "#212529",
                            padding: "12px",
                            textAlign: "right",
                          }}
                        >
                          {trend.orders.toLocaleString()}
                        </td>
                        <td
                          style={{
                            fontSize: "14px",
                            color: "#212529",
                            padding: "12px",
                            textAlign: "right",
                          }}
                        >
                          {trend.value.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Payment Methods</h5>
              <p className="card-text text-muted">
                Payment processing via Chapa gateway
              </p>
            </div>
            <div className="card-body">
              {reportData.orders.paymentMethods.map((method, index) => (
                <div key={index} className="mb-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <CreditCard size={16} className="text-muted me-2" />
                      <span>{method.method} Gateway</span>
                    </div>
                    <div className="text-end">
                      <div className="fw-bold">
                        {method.orders.toLocaleString()}
                      </div>
                      <div className="text-muted small">total orders</div>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mt-2">
                    <span className="text-muted">Total Payments Processed</span>
                    <span className="text-success fw-bold">
                      ETB {method.totalPayments.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDeliveryReport = () => (
    <div className="mb-4">
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4 mb-4">
        <div className="col">
          <div className="card summary-card h-100">
            <div className="summary-card-header">
              <h6 className="summary-card-title">Pending Deliveries</h6>
              <Truck size={24} className="summary-card-icon" />
            </div>
            <div className="summary-card-body">
              <h3 className="summary-card-value">
                {reportData.delivery.pending}
              </h3>
              <p className="summary-card-subtext text-muted">Awaiting pickup</p>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card summary-card h-100">
            <div className="summary-card-header">
              <h6 className="summary-card-title">In Transit</h6>
              <Truck size={24} className="summary-card-icon" />
            </div>
            <div className="summary-card-body">
              <h3 className="summary-card-value">
                {reportData.delivery.inTransit}
              </h3>
              <p className="summary-card-subtext text-muted">
                Currently being delivered
              </p>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card summary-card h-100">
            <div className="summary-card-header">
              <h6 className="summary-card-title">Delivered</h6>
              <Truck size={24} className="summary-card-icon" />
            </div>
            <div className="summary-card-body">
              <h3 className="summary-card-value">
                {reportData.delivery.delivered}
              </h3>
              <p className="summary-card-subtext text-muted">
                Successfully completed
              </p>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card summary-card h-100">
            <div className="summary-card-header">
              <h6 className="summary-card-title">Avg. Delivery Time</h6>
              <Calendar size={24} className="summary-card-icon" />
            </div>
            <div className="summary-card-body">
              <h3 className="summary-card-value">
                {reportData.delivery.averageDeliveryTime} days
              </h3>
              <p className="summary-card-subtext text-muted">
                From order to delivery
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="row row-cols-1 row-cols-lg-2 g-4">
        <div className="col">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Delivery Success Rate</h5>
              <p className="card-text text-muted">
                Overall delivery performance metrics
              </p>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span>Success Rate</span>
                <span className="text-success fw-bold h4">
                  {reportData.overview.deliverySuccess}%
                </span>
              </div>
              <div className="progress">
                <div
                  className="progress-bar bg-success"
                  role="progressbar"
                  style={{ width: `${reportData.overview.deliverySuccess}%` }}
                  aria-valuenow={reportData.overview.deliverySuccess}
                  aria-valuemin={0}
                  aria-valuemax={100}
                ></div>
              </div>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Regional Delivery Performance</h5>
              <p className="card-text text-muted">Delivery metrics by region</p>
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
                        Deliveries
                      </th>
                      <th
                        style={{
                          fontSize: "14px",
                          color: "#6c757d",
                          fontWeight: "normal",
                          textAlign: "right",
                        }}
                      >
                        Avg. Time
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.delivery.deliveryRegions.map(
                      (region, index) => (
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
                            {region.deliveries.toLocaleString()}
                          </td>
                          <td
                            style={{
                              fontSize: "14px",
                              color: "#212529",
                              padding: "12px",
                              textAlign: "right",
                            }}
                          >
                            {region.avgTime}d
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFinancialReport = () => (
    <div className="mb-4">
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4 mb-4">
        <div className="col">
          <div className="card summary-card h-100">
            <div className="summary-card-header">
              <h6 className="summary-card-title">Total Revenue</h6>
              <DollarSign size={24} className="summary-card-icon" />
            </div>
            <div className="summary-card-body">
              <h3 className="summary-card-value">
                ETB {reportData.financial.totalRevenue.toLocaleString()}
              </h3>
              <p className="summary-card-subtext text-success">
                +{reportData.financial.revenueGrowth}% from last month
              </p>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card summary-card h-100">
            <div className="summary-card-header">
              <h6 className="summary-card-title">Platform Fees</h6>
              <DollarSign size={24} className="summary-card-icon" />
            </div>
            <div className="summary-card-body">
              <h3 className="summary-card-value">
                ETB {reportData.financial.platformFees.toLocaleString()}
              </h3>
              <p className="summary-card-subtext text-muted">
                {(
                  (reportData.financial.platformFees /
                    reportData.financial.totalRevenue) *
                  100
                ).toFixed(1)}
                % of total revenue
              </p>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card summary-card h-100">
            <div className="summary-card-header">
              <h6 className="summary-card-title">Farmer Earnings</h6>
              <DollarSign size={24} className="summary-card-icon" />
            </div>
            <div className="summary-card-body">
              <h3 className="summary-card-value">
                ETB {reportData.financial.farmerEarnings.toLocaleString()}
              </h3>
              <p className="summary-card-subtext text-muted">
                Total farmer payouts
              </p>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card summary-card h-100">
            <div className="summary-card-header">
              <h6 className="summary-card-title">Avg. Transaction Fee</h6>
              <DollarSign size={24} className="summary-card-icon" />
            </div>
            <div className="summary-card-body">
              <h3 className="summary-card-value">
                ETB {reportData.financial.avgTransactionFee}
              </h3>
              <p className="summary-card-subtext text-muted">Per transaction</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row row-cols-1 row-cols-lg-2 g-4">
        <div className="col">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Monthly Revenue Trends</h5>
              <p className="card-text text-muted">
                Revenue and fee collection over time
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
                        Month
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
                      <th
                        style={{
                          fontSize: "14px",
                          color: "#6c757d",
                          fontWeight: "normal",
                          textAlign: "right",
                        }}
                      >
                        Fees (ETB)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.financial.monthlyRevenue.map((month, index) => (
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
                          {month.month}
                        </td>
                        <td
                          style={{
                            fontSize: "14px",
                            color: "#212529",
                            padding: "12px",
                            textAlign: "right",
                          }}
                        >
                          {month.revenue.toLocaleString()}
                        </td>
                        <td
                          style={{
                            fontSize: "14px",
                            color: "#212529",
                            padding: "12px",
                            textAlign: "right",
                          }}
                        >
                          {month.fees.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Top Earning Farmers</h5>
              <p className="card-text text-muted">
                Highest revenue generating farmers
              </p>
            </div>
            <div className="card-body">
              {reportData.financial.topEarningFarmers.map((farmer, index) => (
                <div
                  key={index}
                  className="d-flex justify-content-between align-items-center mb-3"
                >
                  <div>
                    <div className="fw-bold">{farmer.name}</div>
                    <div className="text-muted small">
                      {farmer.orders} orders
                    </div>
                  </div>
                  <div className="text-end">
                    <div className="text-success fw-bold">
                      ETB {farmer.earnings.toLocaleString()}
                    </div>
                    <div className="text-muted small">earnings</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

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
                <div className="col-12 col-md-3 mb-2 mb-md-0">
                  <label className="form-label small">Time Period</label>
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="form-select form-select-sm"
                    style={{ fontSize: "14px", padding: "6px 12px" }}
                  >
                    <option value="weekly">Last 7 Days</option>
                    <option value="monthly">Last 30 Days</option>
                    <option value="quarterly">Last 3 Months</option>
                    <option value="yearly">Last Year</option>
                  </select>
                </div>
                <div className="col-12 col-md-3 mb-2 mb-md-0">
                  <label className="form-label small">Report Type</label>
                  <select
                    value={selectedReport}
                    onChange={(e) => setSelectedReport(e.target.value)}
                    className="form-select form-select-sm"
                    style={{ fontSize: "14px", padding: "6px 12px" }}
                  >
                    {reportTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-12 col-md-6 d-flex align-items-end gap-2">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => generateReport(selectedReport)}
                    style={{ fontSize: "14px", padding: "6px 12px" }}
                  >
                    <Eye size={16} className="me-2" />
                    Generate Report
                  </button>
                  {isReportGenerated && (
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

          <div className="card">
            <div className="card-body">
              {selectedReport === "overview" && renderOverviewReport()}
              {selectedReport === "users" && renderUserReport()}
              {selectedReport === "products" && renderProductReport()}
              {selectedReport === "orders" && renderOrderReport()}
              {selectedReport === "delivery" && renderDeliveryReport()}
              {selectedReport === "financial" && renderFinancialReport()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
