import React, { useRef } from "react";
import { DollarSign, Download, FileText } from "lucide-react";
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
import jsPDF from "jspdf";
import "jspdf-autotable";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const FinancialReport = ({ financial = {}, startDate, endDate }) => {
  const {
    totalIncome = 0,
    farmersEarning = 0,
    totalRefund = 0,
    platformFee = 0,
    deliveryFee = 0,
    averageTransactionFee = 0,
    monthlyRevenue = [],
    topEarningFarmers = [],
  } = financial;

  const chartRef = useRef(null);

  // === Chart: Income, Platform Fee, Delivery Fee, Farmer Earnings ===
  const chartData = {
    labels: ["Total Income", "Platform Fee", "Delivery Fee", "Farmer Earnings"],
    datasets: [
      {
        label: "Amount (ETB)",
        data: [totalIncome, platformFee, deliveryFee, farmersEarning],
        backgroundColor: [
          "rgba(34, 139, 34, 0.6)", // Green
          "rgba(70, 130, 180, 0.6)", // SteelBlue
          "rgba(30, 144, 255, 0.6)", // DodgerBlue
          "rgba(255, 140, 0, 0.6)", // Orange
        ],
        borderColor: [
          "rgba(34, 139, 34, 1)",
          "rgba(70, 130, 180, 1)",
          "rgba(30, 144, 255, 1)",
          "rgba(255, 140, 0, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Financial Breakdown" },
    },
    scales: { y: { beginAtZero: true } },
  };

  // === PDF Export ===
  const downloadPDF = () => {
    if (
      !totalIncome &&
      !platformFee &&
      !deliveryFee &&
      !farmersEarning &&
      !totalRefund &&
      !averageTransactionFee &&
      monthlyRevenue.length === 0 &&
      topEarningFarmers.length === 0
    ) {
      alert("No data to export.");
      return;
    }

    const doc = new jsPDF();
    let y = 20;
    const pageHeight = 297;
    const maxY = pageHeight - 20;

    const checkPageOverflow = () => {
      if (y > maxY) {
        doc.addPage();
        y = 20;
      }
    };

    // Header
    doc.setFontSize(28);
    doc.setTextColor(0, 128, 0);
    doc.text("AGRILINK ETHIOPIA", 105, y, { align: "center" });
    y += 15;

    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    doc.text("Financial Report", 105, y, { align: "center" });
    y += 10;

    doc.setFontSize(14);
    doc.setFont("helvetica", "italic");
    doc.text(`Period: ${startDate} to ${endDate}`, 105, y, { align: "center" });
    y += 15;

    doc.setFontSize(12);
    doc.text(`Generated: ${new Date().toLocaleDateString("en-GB")}`, 105, y, {
      align: "center",
    });
    y += 15;

    doc.setLineWidth(0.5);
    doc.setDrawColor(0, 128, 0);
    doc.line(20, y, 190, y);
    y += 10;

    // === Financial Summary ===
    doc.setFontSize(16);
    doc.setTextColor(0, 128, 0);
    doc.text("Financial Summary", 20, y);
    y += 8;

    const metrics = [
      `Total Income: ETB ${totalIncome.toLocaleString()}`,
      `Platform Fee (20%): ETB ${platformFee.toLocaleString()}`,
      `Delivery Fee (80%): ETB ${deliveryFee.toLocaleString()}`,
      `Farmer Earnings: ETB ${farmersEarning.toLocaleString()}`,
      `Total Refunds: ETB ${totalRefund.toLocaleString()}`,
      `Avg. Transaction Fee: ETB ${parseFloat(averageTransactionFee).toFixed(
        2
      )}`,
    ];

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    metrics.forEach((m) => {
      doc.text(m, 20, y);
      y += 8;
      checkPageOverflow();
    });

    if (chartRef.current) {
      doc.addImage(chartRef.current.toBase64Image(), "PNG", 20, y, 170, 85);
      y += 90;
      checkPageOverflow();
    }

    doc.setLineWidth(0.5);
    doc.setDrawColor(0, 128, 0);
    doc.line(20, y, 190, y);
    y += 10;

    // === Monthly Trends ===
    doc.setFontSize(16);
    doc.setTextColor(0, 128, 0);
    doc.text("Monthly Trends", 20, y);
    y += 8;

    doc.setFont("helvetica", "bold");
    doc.text("Month", 20, y);
    doc.text("Income", 90, y, { align: "right" });
    doc.text("Net Profit", 160, y, { align: "right" });
    y += 6;
    doc.setLineWidth(0.2);
    doc.line(20, y, 190, y);
    y += 6;

    doc.setFont("helvetica", "normal");
    monthlyRevenue.forEach((m) => {
      doc.text(m.month, 20, y);
      doc.text(m.income.toLocaleString(), 90, y, { align: "right" });
      doc.text(m.netProfit.toLocaleString(), 160, y, { align: "right" });
      y += 8;
      checkPageOverflow();
    });

    doc.setLineWidth(0.5);
    doc.setDrawColor(0, 128, 0);
    doc.line(20, y, 190, y);
    y += 10;

    // === Top Earning Farmers ===
    doc.setFontSize(16);
    doc.setTextColor(0, 128, 0);
    doc.text("Top Earning Farmers", 20, y);
    y += 8;

    doc.setFont("helvetica", "bold");
    doc.text("Farmer", 20, y);
    doc.text("Earnings", 120, y, { align: "right" });
    doc.text("Orders", 170, y, { align: "right" });
    y += 6;
    doc.setLineWidth(0.2);
    doc.line(20, y, 190, y);
    y += 6;

    doc.setFont("helvetica", "normal");
    topEarningFarmers.forEach((f) => {
      doc.text(f.name, 20, y);
      doc.text(f.earnings.toLocaleString(), 120, y, { align: "right" });
      doc.text(f.orders.toString(), 170, y, { align: "right" });
      y += 8;
      checkPageOverflow();
    });

    doc.save(`agri_financial_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  // === CSV Export ===
  const downloadCSV = () => {
    let csv = "data:text/csv;charset=utf-8,";
    csv += "Metric,Value\n";
    csv += `Total Income,ETB ${totalIncome.toLocaleString()}\n`;
    csv += `Platform Fee (20%),ETB ${platformFee.toLocaleString()}\n`;
    csv += `Delivery Fee (80%),ETB ${deliveryFee.toLocaleString()}\n`;
    csv += `Farmer Earnings,ETB ${farmersEarning.toLocaleString()}\n`;
    csv += `Total Refunds,ETB ${totalRefund.toLocaleString()}\n`;
    csv += `Avg. Transaction Fee,ETB ${parseFloat(
      averageTransactionFee
    ).toFixed(2)}\n\n`;

    if (monthlyRevenue.length > 0) {
      csv += "Month,Income (ETB),Net Profit (ETB)\n";
      monthlyRevenue.forEach((m) => {
        csv += `${
          m.month
        },${m.income.toLocaleString()},${m.netProfit.toLocaleString()}\n`;
      });
      csv += "\n";
    }

    if (topEarningFarmers.length > 0) {
      csv += "Farmer Name,Earnings (ETB),Orders\n";
      topEarningFarmers.forEach((f) => {
        csv += `${f.name},${f.earnings.toLocaleString()},${f.orders}\n`;
      });
    }

    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csv));
    link.setAttribute(
      "download",
      `agri_financial_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="mb-4">
      {/* Export Buttons */}
      <div className="d-flex justify-content-end gap-2 mb-4">
        <button
          className="btn btn-primary btn-sm"
          onClick={downloadPDF}
          style={{ fontSize: "14px", padding: "6px 12px" }}
        >
          <Download size={16} className="me-1" /> Export PDF
        </button>
        <button
          className="btn btn-primary btn-sm"
          onClick={downloadCSV}
          style={{ fontSize: "14px", padding: "6px 12px" }}
        >
          <FileText size={16} className="me-1" /> Export CSV
        </button>
      </div>

      {/* === TOP ROW: 3 CARDS === */}
      <div className="row row-cols-1 row-cols-md-3 g-4 mb-4">
        {/* 1. Total Income */}
        <div className="col">
          <div className="card summary-card h-100 border-success">
            <div className="summary-card-header">
              <h6 className="summary-card-title">Total Income</h6>
              <DollarSign
                size={24}
                className="summary-card-icon text-success"
              />
            </div>
            <div className="summary-card-body">
              <h3 className="summary-card-value">
                ETB {totalIncome.toLocaleString()}
              </h3>
              <p className="summary-card-subtext text-success">
                Completed payments
              </p>
            </div>
          </div>
        </div>

        {/* 2. Platform Fee */}
        <div className="col">
          <div className="card summary-card h-100 border-info">
            <div className="summary-card-header">
              <h6 className="summary-card-title">Platform Fee</h6>
              <DollarSign size={24} className="summary-card-icon text-info" />
            </div>
            <div className="summary-card-body">
              <h3 className="summary-card-value">
                ETB {platformFee.toLocaleString()}
              </h3>
              <p className="summary-card-subtext text-info">
                20% of delivery fee
              </p>
            </div>
          </div>
        </div>

        {/* 3. Delivery Fee */}
        <div className="col">
          <div className="card summary-card h-100 border-primary">
            <div className="summary-card-header">
              <h6 className="summary-card-title">Delivery Fee</h6>
              <DollarSign
                size={24}
                className="summary-card-icon text-primary"
              />
            </div>
            <div className="summary-card-body">
              <h3 className="summary-card-value">
                ETB {deliveryFee.toLocaleString()}
              </h3>
              <p className="summary-card-subtext text-primary">
                80% of delivery fee
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* === BOTTOM ROW: 3 CARDS === */}
      <div className="row row-cols-1 row-cols-md-3 g-4 mb-4">
        {/* 4. Farmer Earnings */}
        <div className="col">
          <div className="card summary-card h-100 border-warning">
            <div className="summary-card-header">
              <h6 className="summary-card-title">Farmer Earnings</h6>
              <DollarSign
                size={24}
                className="summary-card-icon text-warning"
              />
            </div>
            <div className="summary-card-body">
              <h3 className="summary-card-value">
                ETB {farmersEarning.toLocaleString()}
              </h3>
              <p className="summary-card-subtext text-muted">Total payouts</p>
            </div>
          </div>
        </div>

        {/* 5. Total Refunds */}
        <div className="col">
          <div className="card summary-card h-100 border-danger">
            <div className="summary-card-header">
              <h6 className="summary-card-title">Total Refunds</h6>
              <DollarSign size={24} className="summary-card-icon text-danger" />
            </div>
            <div className="summary-card-body">
              <h3 className="summary-card-value">
                ETB {totalRefund.toLocaleString()}
              </h3>
              <p className="summary-card-subtext text-danger">
                Approved refunds
              </p>
            </div>
          </div>
        </div>

        {/* 6. Average Transaction Fee */}
        <div className="col">
          <div className="card summary-card h-100 border-secondary">
            <div className="summary-card-header">
              <h6 className="summary-card-title">Avg. Transaction Fee</h6>
              <DollarSign
                size={24}
                className="summary-card-icon text-secondary"
              />
            </div>
            <div className="summary-card-body">
              <h3 className="summary-card-value">
                ETB {parseFloat(averageTransactionFee).toFixed(2)}
              </h3>
              <p className="summary-card-subtext text-muted">Per transaction</p>
            </div>
          </div>
        </div>
      </div>

      {/* === Financial Chart === */}
      <div className="card mb-4" style={{ overflowX: "auto" }}>
        <div className="card-header">
          <h5 className="card-title">Financial Breakdown</h5>
          <p className="card-text text-muted">Income vs Fees vs Earnings</p>
        </div>
        <div className="card-body">
          <div style={{ minWidth: "300px" }}>
            <Bar ref={chartRef} data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* === Monthly Trends + Top Farmers === */}
      <div className="row row-cols-1 row-cols-lg-2 g-4">
        {/* Monthly Trends */}
        <div className="col">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Monthly Trends</h5>
              <p className="card-text text-muted">Income and profit</p>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Month</th>
                      <th style={{ textAlign: "right" }}>Income (ETB)</th>
                      <th style={{ textAlign: "right" }}>Profit (ETB)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyRevenue.map((m, i) => (
                      <tr key={i}>
                        <td>{m.month}</td>
                        <td style={{ textAlign: "right" }}>
                          {m.income.toLocaleString()}
                        </td>
                        <td style={{ textAlign: "right" }}>
                          {m.netProfit.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Top Earning Farmers */}
        <div className="col">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Top Earning Farmers</h5>
              <p className="card-text text-muted">Highest earners</p>
            </div>
            <div className="card-body">
              {topEarningFarmers.length > 0 ? (
                topEarningFarmers.map((f, i) => (
                  <div
                    key={i}
                    className="d-flex justify-content-between align-items-center mb-3"
                  >
                    <div>
                      <div className="fw-bold">{f.name}</div>
                      <div className="text-muted small">{f.orders} orders</div>
                    </div>
                    <div className="text-end">
                      <div className="text-success fw-bold">
                        ETB {f.earnings.toLocaleString()}
                      </div>
                      <div className="text-muted small">earnings</div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted">No data available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialReport;
