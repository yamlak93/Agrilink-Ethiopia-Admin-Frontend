import { useState, useEffect } from "react";
import {
  CreditCard,
  RefreshCw,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  MoreHorizontal,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "../Css/Devices.css"; // Import Devices.css for ms-md-250
import "../Css/PaymentsPage.css";
import "bootstrap/dist/css/bootstrap.min.css";
import apiClient from "../api/api";

const PaymentsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [editedStatus, setEditedStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Calculate payment summary dynamically based on current and previous month
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // September (9)
  const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1; // August (8) or December (12) if January
  const lastYear = currentMonth === 1 ? currentYear - 1 : currentYear;

  const currentStart = new Date(`${currentYear}-${currentMonth}-01`);
  const currentEnd = new Date(currentDate);
  const lastStart = new Date(`${lastYear}-${lastMonth}-01`);
  const lastEnd = new Date(lastYear, lastMonth, 0); // Last day of previous month

  const currentTransactions = transactions.filter(
    (t) => new Date(t.date) >= currentStart && new Date(t.date) <= currentEnd
  );
  const lastTransactions = transactions.filter(
    (t) => new Date(t.date) >= lastStart && new Date(t.date) <= lastEnd
  );

  const currentCompletedPayments = currentTransactions.filter(
    (t) => t.type === "payment" && t.status === "completed"
  );
  const lastCompletedPayments = lastTransactions.filter(
    (t) => t.type === "payment" && t.status === "completed"
  );
  const currentTotalPayments = currentCompletedPayments.reduce(
    (sum, t) => sum + (t.amount || 0),
    0
  );
  const lastTotalPayments = lastCompletedPayments.reduce(
    (sum, t) => sum + (t.amount || 0),
    0
  );
  const totalPaymentsChange =
    lastTotalPayments > 0
      ? ((currentTotalPayments - lastTotalPayments) / lastTotalPayments) * 100
      : currentTotalPayments > 0
      ? 100
      : 0;

  const currentSuccessfulPayments = currentCompletedPayments.length;
  const lastSuccessfulPayments = lastCompletedPayments.length;
  const successfulPaymentsChange =
    lastSuccessfulPayments > 0
      ? ((currentSuccessfulPayments - lastSuccessfulPayments) /
          lastSuccessfulPayments) *
        100
      : currentSuccessfulPayments > 0
      ? 100
      : 0;
  const successfulPaymentsPercentage =
    currentTotalPayments > 0
      ? (
          (currentSuccessfulPayments /
            currentTransactions.filter((t) => t.type === "payment").length) *
          100
        ).toFixed(1)
      : 0;

  const currentPendingRefunds = currentTransactions.filter(
    (t) => t.type === "refund" && t.status === "pending"
  ).length;

  const currentTotalRefunded = currentTransactions
    .filter((t) => t.type === "refund" && t.status === "approved")
    .reduce((sum, t) => sum + (t.amount || 0), 0);
  const refundedPercentage =
    currentTotalPayments > 0
      ? ((currentTotalRefunded / currentTotalPayments) * 100).toFixed(1)
      : 0;

  const currentAvgOrderValue =
    currentCompletedPayments.length > 0
      ? currentTotalPayments / currentCompletedPayments.length
      : 0;
  const lastAvgOrderValue =
    lastCompletedPayments.length > 0
      ? lastTotalPayments / lastCompletedPayments.length
      : 0;
  const avgOrderValueChange =
    lastAvgOrderValue > 0
      ? ((currentAvgOrderValue - lastAvgOrderValue) / lastAvgOrderValue) * 100
      : currentAvgOrderValue > 0
      ? 100
      : 0;

  const paymentSummary = {
    totalPayments: currentTotalPayments,
    successfulPayments: currentSuccessfulPayments,
    pendingRefunds: currentPendingRefunds,
    totalRefunded: currentTotalRefunded,
    averageOrderValue: currentAvgOrderValue,
    totalPaymentsChange: totalPaymentsChange.toFixed(2),
    successfulPaymentsChange: successfulPaymentsChange.toFixed(2),
    successfulPaymentsPercentage: successfulPaymentsPercentage,
    refundedPercentage: refundedPercentage,
    avgOrderValueChange: avgOrderValueChange.toFixed(2),
  };

  // Fetch transactions from backend
  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/admin/login";
        return;
      }
      try {
        const response = await apiClient.get("/payments/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTransactions(response.data.transactions || []);
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
        setError("Failed to load transactions. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  // Filter transactions based on search term, status, and type
  useEffect(() => {
    let filtered = transactions;

    if (typeFilter !== "all") {
      filtered = filtered.filter(
        (transaction) => transaction.type === typeFilter
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (transaction) => transaction.status === statusFilter
      );
    }

    if (searchTerm) {
      const lowercasedQuery = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (transaction) =>
          (transaction.id ? transaction.id.toLowerCase() : "").includes(
            lowercasedQuery
          ) ||
          (transaction.orderId
            ? transaction.orderId.toLowerCase()
            : ""
          ).includes(lowercasedQuery) ||
          (transaction.farmer ? transaction.farmer.toLowerCase() : "").includes(
            lowercasedQuery
          ) ||
          (transaction.buyer ? transaction.buyer.toLowerCase() : "").includes(
            lowercasedQuery
          ) ||
          (transaction.product
            ? transaction.product.toLowerCase()
            : ""
          ).includes(lowercasedQuery) ||
          (transaction.transactionId
            ? transaction.transactionId.toLowerCase()
            : ""
          ).includes(lowercasedQuery)
      );
    }

    setFilteredTransactions(filtered);
  }, [searchTerm, statusFilter, typeFilter, transactions]);

  const [filteredTransactions, setFilteredTransactions] = useState([]);

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-success";
      case "pending":
        return "bg-warning";
      case "processing":
        return "bg-primary";
      case "approved":
        return "bg-info";
      case "failed":
        return "bg-danger";
      case "rejected":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle size={16} />;
      case "pending":
        return <AlertCircle size={16} />;
      case "processing":
        return <RefreshCw size={16} />;
      case "approved":
        return <CheckCircle size={16} />;
      case "failed":
        return <XCircle size={16} />;
      case "rejected":
        return <XCircle size={16} />;
      default:
        return <AlertCircle size={16} />;
    }
  };

  const handleOpenModal = (transaction) => {
    setSelectedTransaction(transaction);
    setEditedStatus(transaction.status);
    setIsModalOpen(true);
  };

  const handleSaveChanges = async () => {
    if (selectedTransaction) {
      const token = localStorage.getItem("token");
      try {
        console.log("Updating transaction:", {
          transactionId: selectedTransaction.id,
          status: editedStatus,
        }); // Debug log
        const response = await apiClient.put(
          `/payments/update-status/${selectedTransaction.id}`,
          { status: editedStatus },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Update response:", response.data); // Debug log
        setTransactions((prev) =>
          prev.map((transaction) =>
            transaction.id === selectedTransaction.id
              ? { ...transaction, status: editedStatus }
              : transaction
          )
        );
        setIsModalOpen(false);
      } catch (err) {
        const errorMessage = err.response
          ? err.response.data.message || err.response.data
          : err.message;
        console.error(
          "Failed to update status:",
          err.response ? err.response.data : err
        );
        setError(
          `Failed to update transaction status. Details: ${errorMessage}`
        );
      }
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
    <div className="min-vh-100 bg-light">
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div
          className="container-fluid p-4 ms-md-250"
          style={{ marginTop: "60px" }} // Keep marginTop for navbar offset
        >
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2
                className="fw-bold"
                style={{ fontSize: "24px", color: "#1a2e5a" }}
              >
                Payments & Refunds
              </h2>
              <p
                className="text-muted"
                style={{ fontSize: "14px", color: "#6c757d" }}
              >
                Manage payment transactions and refund requests
              </p>
            </div>
          </div>

          {/* Payment Summary Cards */}
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-5 g-4 mb-4">
            <div className="col">
              <div className="card summary-card h-100">
                <div className="summary-card-header">
                  <h6 className="summary-card-title">Total Payments</h6>
                  <DollarSign size={24} className="summary-card-icon" />
                </div>
                <div className="summary-card-body">
                  <h3 className="summary-card-value">
                    ETB {paymentSummary.totalPayments.toLocaleString()}
                  </h3>
                  <p className="summary-card-subtext text-success">
                    {paymentSummary.totalPaymentsChange >= 0
                      ? `+${paymentSummary.totalPaymentsChange}%`
                      : `${paymentSummary.totalPaymentsChange}%`}{" "}
                    from last month
                  </p>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card summary-card h-100">
                <div className="summary-card-header">
                  <h6 className="summary-card-title">Successful Payments</h6>
                  <CheckCircle size={24} className="summary-card-icon" />
                </div>
                <div className="summary-card-body">
                  <h3 className="summary-card-value">
                    {paymentSummary.successfulPayments.toLocaleString()}
                  </h3>
                  <p className="summary-card-subtext text-success">
                    {paymentSummary.successfulPaymentsPercentage}% of total
                    payments (
                    {paymentSummary.successfulPaymentsChange >= 0
                      ? `+${paymentSummary.successfulPaymentsChange}%`
                      : `${paymentSummary.successfulPaymentsChange}%`}{" "}
                    from last month)
                  </p>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card summary-card h-100">
                <div className="summary-card-header">
                  <h6 className="summary-card-title">Pending Refunds</h6>
                  <RefreshCw size={24} className="summary-card-icon" />
                </div>
                <div className="summary-card-body">
                  <h3 className="summary-card-value">
                    {paymentSummary.pendingRefunds.toLocaleString()}
                  </h3>
                  <p className="summary-card-subtext text-warning">
                    Awaiting processing
                  </p>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card summary-card h-100">
                <div className="summary-card-header">
                  <h6 className="summary-card-title">Total Refunded</h6>
                  <XCircle size={24} className="summary-card-icon" />
                </div>
                <div className="summary-card-body">
                  <h3 className="summary-card-value">
                    ETB {paymentSummary.totalRefunded.toLocaleString()}
                  </h3>
                  <p className="summary-card-subtext text-danger">
                    {paymentSummary.refundedPercentage}% of total payments
                  </p>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card summary-card h-100">
                <div className="summary-card-header">
                  <h6 className="summary-card-title">Avg Order Value</h6>
                  <TrendingUp size={24} className="summary-card-icon" />
                </div>
                <div className="summary-card-body">
                  <h3 className="summary-card-value">
                    ETB {paymentSummary.averageOrderValue.toLocaleString()}
                  </h3>
                  <p className="summary-card-subtext text-success">
                    {paymentSummary.avgOrderValueChange >= 0
                      ? `+${paymentSummary.avgOrderValueChange}%`
                      : `${paymentSummary.avgOrderValueChange}%`}{" "}
                    from last month
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title">All Transactions</h5>
                  <p className="card-text text-muted">
                    Payment transactions and refund requests via Chapa
                  </p>
                </div>
                <div className="d-flex align-items-center gap-4">
                  <div className="search-container">
                    <Search
                      size={16}
                      className="search-icon"
                      style={{ color: "#28a745" }}
                    />
                    <input
                      type="text"
                      className="form-control search-input"
                      placeholder="Search transactions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      aria-label="Search transactions"
                    />
                  </div>
                  <div className="filter-container">
                    <Filter
                      size={16}
                      className="filter-icon"
                      style={{ color: "#28a745" }}
                    />
                    <select
                      className="form-select filter-select"
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      aria-label="Filter by type"
                    >
                      <option value="all">All Types</option>
                      <option value="payment">Payment</option>
                      <option value="refund">Refund</option>
                    </select>
                  </div>
                  <div className="filter-container">
                    <Filter
                      size={16}
                      className="filter-icon"
                      style={{ color: "#28a745" }}
                    />
                    <select
                      className="form-select filter-select"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      aria-label="Filter by status"
                    >
                      <option value="all">All Status</option>
                      <option value="completed">Completed</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="processing">Processing</option>
                      <option value="failed">Failed</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>
              </div>
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
                        #
                      </th>
                      <th
                        style={{
                          fontSize: "14px",
                          color: "#6c757d",
                          fontWeight: "normal",
                        }}
                      >
                        Transaction ID
                      </th>
                      <th
                        style={{
                          fontSize: "14px",
                          color: "#6c757d",
                          fontWeight: "normal",
                        }}
                      >
                        Type
                      </th>
                      <th
                        style={{
                          fontSize: "14px",
                          color: "#6c757d",
                          fontWeight: "normal",
                        }}
                      >
                        Order
                      </th>
                      <th
                        style={{
                          fontSize: "14px",
                          color: "#6c757d",
                          fontWeight: "normal",
                        }}
                      >
                        Farmer
                      </th>
                      <th
                        style={{
                          fontSize: "14px",
                          color: "#6c757d",
                          fontWeight: "normal",
                        }}
                      >
                        Buyer
                      </th>
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
                        Amount
                      </th>
                      <th
                        style={{
                          fontSize: "14px",
                          color: "#6c757d",
                          fontWeight: "normal",
                        }}
                      >
                        Method
                      </th>
                      <th
                        style={{
                          fontSize: "14px",
                          color: "#6c757d",
                          fontWeight: "normal",
                        }}
                      >
                        Status
                      </th>
                      <th
                        style={{
                          fontSize: "14px",
                          color: "#6c757d",
                          fontWeight: "normal",
                        }}
                      >
                        Date
                      </th>
                      <th
                        style={{
                          fontSize: "14px",
                          color: "#6c757d",
                          fontWeight: "normal",
                        }}
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.length > 0 ? (
                      filteredTransactions.map((transaction, index) => (
                        <tr
                          key={transaction.id}
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
                            <div style={{ fontWeight: "bold" }}>
                              {index + 1}
                            </div>
                          </td>
                          <td
                            style={{
                              fontSize: "14px",
                              color: "#212529",
                              padding: "12px",
                            }}
                          >
                            <div style={{ fontWeight: "bold" }}>
                              {transaction.id}
                            </div>
                          </td>
                          <td
                            style={{
                              fontSize: "14px",
                              color: "#212529",
                              padding: "12px",
                            }}
                          >
                            <span
                              className={`badge ${
                                transaction.type === "payment"
                                  ? "bg-primary"
                                  : "bg-danger"
                              }`}
                              style={{
                                fontSize: "12px",
                                padding: "4px 8px",
                                color: "#fff",
                                borderRadius: "12px",
                              }}
                            >
                              {transaction.type}
                            </span>
                          </td>
                          <td
                            style={{
                              fontSize: "14px",
                              color: "#212529",
                              padding: "12px",
                            }}
                          >
                            <div style={{ fontWeight: "bold" }}>
                              {transaction.orderId}
                            </div>
                          </td>
                          <td
                            style={{
                              fontSize: "14px",
                              color: "#212529",
                              padding: "12px",
                            }}
                          >
                            {transaction.farmer}
                          </td>
                          <td
                            style={{
                              fontSize: "14px",
                              color: "#212529",
                              padding: "12px",
                            }}
                          >
                            {transaction.buyer}
                          </td>
                          <td
                            style={{
                              fontSize: "14px",
                              color: "#212529",
                              padding: "12px",
                            }}
                          >
                            {transaction.product}
                          </td>
                          <td
                            style={{
                              fontSize: "14px",
                              color: "#212529",
                              padding: "12px",
                            }}
                          >
                            <div style={{ fontWeight: "bold" }}>
                              ETB {transaction.amount.toLocaleString()}
                            </div>
                          </td>
                          <td
                            style={{
                              fontSize: "14px",
                              color: "#212529",
                              padding: "12px",
                            }}
                          >
                            <div className="d-flex align-items-center">
                              <CreditCard
                                size={16}
                                className="me-2 text-primary"
                              />
                              {transaction.method}
                            </div>
                          </td>
                          <td style={{ padding: "12px" }}>
                            <span
                              className={`badge ${getStatusColor(
                                transaction.status
                              )}`}
                              style={{
                                fontSize: "12px",
                                padding: "4px 8px",
                                color: "#fff",
                                borderRadius: "12px",
                              }}
                            >
                              {transaction.status}
                            </span>
                          </td>
                          <td
                            style={{
                              fontSize: "12px",
                              color: "#212529",
                              padding: "12px",
                            }}
                          >
                            {transaction.date}
                          </td>
                          <td
                            style={{
                              fontSize: "14px",
                              color: "#212529",
                              padding: "12px",
                            }}
                          >
                            <button
                              className="btn btn-sm btn-light"
                              style={{
                                fontSize: "14px",
                                padding: "4px 8px",
                                borderRadius: "4px",
                              }}
                              onClick={() => handleOpenModal(transaction)}
                            >
                              <MoreHorizontal size={16} />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={11}
                          className="text-center"
                          style={{ fontSize: "14px", color: "#212529" }}
                        >
                          No transactions match the selected filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Transaction Details Modal */}
          {isModalOpen && selectedTransaction && (
            <div
              className="modal show d-block"
              tabIndex="-1"
              style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            >
              <div
                className="modal-dialog modal-dialog-centered"
                style={{ maxWidth: "500px" }}
              >
                <div
                  className="modal-content"
                  style={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  }}
                >
                  <div
                    className="modal-header"
                    style={{ borderBottom: "none", padding: "15px" }}
                  >
                    <h5
                      className="modal-title"
                      style={{
                        fontSize: "18px",
                        color: "#1a2e5a",
                        fontWeight: "600",
                      }}
                    >
                      Transaction Details - {selectedTransaction.id}
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                      }}
                      onClick={() => setIsModalOpen(false)}
                    ></button>
                  </div>
                  <div
                    className="modal-body"
                    style={{
                      padding: "15px",
                      fontSize: "14px",
                      color: "#495057",
                    }}
                  >
                    <div className="mb-3">
                      <label
                        className="form-label"
                        style={{ fontSize: "14px", color: "#6c757d" }}
                      >
                        Ref ID
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={selectedTransaction.refId || "N/A"}
                        readOnly
                        style={{
                          fontSize: "14px",
                          color: "#495057",
                          borderColor: "#ced4da",
                          padding: "6px 12px",
                          borderRadius: "4px",
                          backgroundColor: "#e9ecef",
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <label
                        className="form-label"
                        style={{ fontSize: "14px", color: "#6c757d" }}
                      >
                        Order ID
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={selectedTransaction.orderId || "N/A"}
                        readOnly
                        style={{
                          fontSize: "14px",
                          color: "#495057",
                          borderColor: "#ced4da",
                          padding: "6px 12px",
                          borderRadius: "4px",
                          backgroundColor: "#e9ecef",
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <label
                        className="form-label"
                        style={{ fontSize: "14px", color: "#6c757d" }}
                      >
                        Farmer
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={selectedTransaction.farmer || "Unknown Farmer"}
                        readOnly
                        style={{
                          fontSize: "14px",
                          color: "#495057",
                          borderColor: "#ced4da",
                          padding: "6px 12px",
                          borderRadius: "4px",
                          backgroundColor: "#e9ecef",
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <label
                        className="form-label"
                        style={{ fontSize: "14px", color: "#6c757d" }}
                      >
                        Buyer
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={selectedTransaction.buyer || "Unknown Buyer"}
                        readOnly
                        style={{
                          fontSize: "14px",
                          color: "#495057",
                          borderColor: "#ced4da",
                          padding: "6px 12px",
                          borderRadius: "4px",
                          backgroundColor: "#e9ecef",
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <label
                        className="form-label"
                        style={{ fontSize: "14px", color: "#6c757d" }}
                      >
                        Product
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={selectedTransaction.product || "Unknown Product"}
                        readOnly
                        style={{
                          fontSize: "14px",
                          color: "#495057",
                          borderColor: "#ced4da",
                          padding: "6px 12px",
                          borderRadius: "4px",
                          backgroundColor: "#e9ecef",
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <label
                        className="form-label"
                        style={{ fontSize: "14px", color: "#6c757d" }}
                      >
                        Amount
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={`ETB ${(
                          selectedTransaction.amount || 0
                        ).toLocaleString()}`}
                        readOnly
                        style={{
                          fontSize: "14px",
                          color: "#495057",
                          borderColor: "#ced4da",
                          padding: "6px 12px",
                          borderRadius: "4px",
                          backgroundColor: "#e9ecef",
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <label
                        className="form-label"
                        style={{ fontSize: "14px", color: "#6c757d" }}
                      >
                        Method
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={selectedTransaction.method || "N/A"}
                        readOnly
                        style={{
                          fontSize: "14px",
                          color: "#495057",
                          borderColor: "#ced4da",
                          padding: "6px 12px",
                          borderRadius: "4px",
                          backgroundColor: "#e9ecef",
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <label
                        className="form-label"
                        style={{ fontSize: "14px", color: "#6c757d" }}
                      >
                        Transaction ID
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={selectedTransaction.transactionId || "N/A"}
                        readOnly
                        style={{
                          fontSize: "14px",
                          color: "#495057",
                          borderColor: "#ced4da",
                          padding: "6px 12px",
                          borderRadius: "4px",
                          backgroundColor: "#e9ecef",
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <label
                        className="form-label"
                        style={{ fontSize: "14px", color: "#6c757d" }}
                      >
                        Date
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={selectedTransaction.date || "N/A"}
                        readOnly
                        style={{
                          fontSize: "14px",
                          color: "#495057",
                          borderColor: "#ced4da",
                          padding: "6px 12px",
                          borderRadius: "4px",
                          backgroundColor: "#e9ecef",
                        }}
                      />
                    </div>
                    {selectedTransaction.type === "refund" && (
                      <div className="mb-3">
                        <label
                          className="form-label"
                          style={{ fontSize: "14px", color: "#6c757d" }}
                        >
                          Reason
                        </label>
                        <textarea
                          className="form-control"
                          value={selectedTransaction.reason || "N/A"}
                          readOnly
                          style={{
                            fontSize: "14px",
                            color: "#495057",
                            borderColor: "#ced4da",
                            padding: "6px 12px",
                            borderRadius: "4px",
                            backgroundColor: "#e9ecef",
                            minHeight: "80px",
                          }}
                        />
                      </div>
                    )}
                    {selectedTransaction.type === "refund" && (
                      <div className="mb-3">
                        <label
                          className="form-label"
                          style={{ fontSize: "14px", color: "#6c757d" }}
                        >
                          Requested By
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={`${selectedTransaction.buyer} (ID: ${selectedTransaction.buyerId})`}
                          readOnly
                          style={{
                            fontSize: "14px",
                            color: "#495057",
                            borderColor: "#ced4da",
                            padding: "6px 12px",
                            borderRadius: "4px",
                            backgroundColor: "#e9ecef",
                          }}
                        />
                      </div>
                    )}
                    <div className="mb-3">
                      <label
                        className="form-label"
                        style={{ fontSize: "14px", color: "#6c757d" }}
                      >
                        Status
                      </label>
                      <select
                        id="status"
                        className="form-select"
                        value={editedStatus}
                        onChange={(e) => setEditedStatus(e.target.value)}
                        style={{
                          fontSize: "14px",
                          color: "#495057",
                          borderColor: "#ced4da",
                          padding: "6px 12px",
                          borderRadius: "4px",
                        }}
                      >
                        {selectedTransaction.type === "payment" ? (
                          <>
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="completed">Completed</option>
                            <option value="failed">Failed</option>
                          </>
                        ) : (
                          <>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                          </>
                        )}
                      </select>
                    </div>
                  </div>
                  <div
                    className="modal-footer"
                    style={{
                      borderTop: "none",
                      padding: "15px",
                      justifyContent: "flex-end",
                      gap: "10px",
                    }}
                  >
                    <button
                      className="btn btn-primary"
                      style={{
                        fontSize: "14px",
                        padding: "6px 12px",
                        borderRadius: "4px",
                      }}
                      onClick={handleSaveChanges}
                    >
                      Save Changes
                    </button>
                    <button
                      className="btn btn-secondary"
                      style={{
                        fontSize: "14px",
                        padding: "6px 12px",
                        borderRadius: "4px",
                      }}
                      onClick={() => setIsModalOpen(false)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;
