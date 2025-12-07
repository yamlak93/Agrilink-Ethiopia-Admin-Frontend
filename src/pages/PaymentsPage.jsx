import { useState, useEffect, useMemo } from "react";
import {
  CreditCard,
  RefreshCw,
  DollarSign,
  TrendingUp,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  MoreHorizontal,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "../Css/Devices.css";
import "../Css/PaymentsPage.css";
import "bootstrap/dist/css/bootstrap.min.css";
import apiClient from "../api/api";

// Format date: Oct 29, 2025
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const PaymentsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [transactions, setTransactions] = useState([]);
  const [backendSummary, setBackendSummary] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [editedStatus, setEditedStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/admin/login";
        return;
      }
      try {
        const { data } = await apiClient.get("/payments/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTransactions(data.transactions || []);
        setBackendSummary(data.paymentSummary);
      } catch (err) {
        console.error(err);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // FILTERED TRANSACTIONS
  const filteredTransactions = useMemo(() => {
    let list = [...transactions];
    if (typeFilter !== "all") list = list.filter((t) => t.type === typeFilter);
    if (statusFilter !== "all")
      list = list.filter((t) => t.status === statusFilter);
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      list = list.filter((t) =>
        [t.id, t.orderId, t.farmer, t.buyer, t.product].some((v) =>
          String(v || "")
            .toLowerCase()
            .includes(q)
        )
      );
    }
    return list;
  }, [transactions, typeFilter, statusFilter, searchTerm]);

  // LIVE SUMMARY FOR FILTERED ROWS
  const liveSummary = useMemo(() => {
    const completedPayments = filteredTransactions.filter(
      (t) =>
        (t.type === "payment" || t.type === "paymentToFarmer") &&
        t.status === "completed"
    );

    const totalPayments = completedPayments.reduce(
      (s, t) => s + (t.amount || 0),
      0
    );
    const successfulPayments = completedPayments.length;
    const pendingRefunds = filteredTransactions.filter(
      (t) => t.type === "refund" && t.status === "pending"
    ).length;
    const totalRefunded = filteredTransactions
      .filter((t) => t.type === "refund" && t.status === "approved")
      .reduce((s, t) => s + (t.amount || 0), 0);
    const averageOrderValue =
      successfulPayments > 0 ? totalPayments / successfulPayments : 0;

    const successfulPaymentsPercentage =
      totalPayments > 0
        ? ((successfulPayments / completedPayments.length) * 100).toFixed(1)
        : 0;
    const refundedPercentage =
      totalPayments > 0
        ? ((totalRefunded / totalPayments) * 100).toFixed(1)
        : 0;

    return {
      totalPayments,
      successfulPayments,
      pendingRefunds,
      totalRefunded,
      averageOrderValue: Number(averageOrderValue.toFixed(2)),
      successfulPaymentsPercentage,
      refundedPercentage,
      totalPaymentsChange: backendSummary?.totalPaymentsChange ?? 0,
      successfulPaymentsChange: backendSummary?.successfulPaymentsChange ?? 0,
      averageOrderValueChange: backendSummary?.averageOrderValueChange ?? 0,
    };
  }, [filteredTransactions, backendSummary]);

  // BADGE COLORS
  const getTypeColor = (type) => {
    const map = {
      payment: "bg-primary",
      refund: "bg-danger",
      paymentToFarmer: "bg-success",
    };
    return map[type] ?? "bg-secondary";
  };

  const getStatusColor = (status) => {
    const map = {
      completed: "bg-success",
      pending: "bg-warning",
      processing: "bg-primary",
      approved: "bg-info",
      failed: "bg-danger",
      rejected: "bg-danger",
    };
    return map[status] ?? "bg-secondary";
  };

  // MODAL
  const handleOpenModal = (tx) => {
    setSelectedTransaction(tx);
    setEditedStatus(tx.status);
    setIsModalOpen(true);
  };

  const handleSaveChanges = async () => {
    if (!selectedTransaction) return;
    const token = localStorage.getItem("token");
    try {
      await apiClient.put(
        `/payments/update-status/${selectedTransaction.id}`,
        { status: editedStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTransactions((prev) =>
        prev.map((t) =>
          t.id === selectedTransaction.id ? { ...t, status: editedStatus } : t
        )
      );
      setIsModalOpen(false);
    } catch (err) {
      setError("Update failed.");
    }
  };

  // LOADING / ERROR
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
          style={{ marginTop: "60px" }}
        >
          {/* Header */}
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
                Manage payments, farmer payouts, and refunds
              </p>
            </div>
          </div>

          {/* 5 SUMMARY CARDS */}
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-5 g-4 mb-4">
            {/* 1. Total Payments */}
            <div className="col">
              <div className="card summary-card h-100">
                <div className="summary-card-header">
                  <h6 className="summary-card-title">Total Payments</h6>
                  <DollarSign size={24} className="summary-card-icon" />
                </div>
                <div className="summary-card-body">
                  <h3 className="summary-card-value">
                    ETB {Number(liveSummary.totalPayments).toLocaleString()}
                  </h3>
                  <p
                    className={`summary-card-subtext ${
                      liveSummary.totalPaymentsChange >= 0
                        ? "text-success"
                        : "text-danger"
                    }`}
                  >
                    {liveSummary.totalPaymentsChange >= 0 ? "+" : ""}
                    {liveSummary.totalPaymentsChange}% from last month
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Successful Payments */}
            <div className="col">
              <div className="card summary-card h-100">
                <div className="summary-card-header">
                  <h6 className="summary-card-title">Successful Payments</h6>
                  <CheckCircle size={24} className="summary-card-icon" />
                </div>
                <div className="summary-card-body">
                  <h3 className="summary-card-value">
                    {liveSummary.successfulPayments}
                  </h3>
                  <p className="summary-card-subtext text-success">
                    {liveSummary.successfulPaymentsPercentage}% of total (
                    {liveSummary.successfulPaymentsChange >= 0 ? "+" : ""}
                    {liveSummary.successfulPaymentsChange}% from last month)
                  </p>
                </div>
              </div>
            </div>

            {/* 3. Pending Refunds */}
            <div className="col">
              <div className="card summary-card h-100">
                <div className="summary-card-header">
                  <h6 className="summary-card-title">Pending Refunds</h6>
                  <RefreshCw size={24} className="summary-card-icon" />
                </div>
                <div className="summary-card-body">
                  <h3 className="summary-card-value">
                    {liveSummary.pendingRefunds}
                  </h3>
                  <p className="summary-card-subtext text-warning">
                    Awaiting processing
                  </p>
                </div>
              </div>
            </div>

            {/* 4. Total Refunded */}
            <div className="col">
              <div className="card summary-card h-100">
                <div className="summary-card-header">
                  <h6 className="summary-card-title">Total Refunded</h6>
                  <XCircle size={24} className="summary-card-icon" />
                </div>
                <div className="summary-card-body">
                  <h3 className="summary-card-value">
                    ETB {Number(liveSummary.totalRefunded).toLocaleString()}
                  </h3>
                  <p className="summary-card-subtext text-danger">
                    {liveSummary.refundedPercentage}% of total payments
                  </p>
                </div>
              </div>
            </div>

            {/* 5. Avg Order Value */}
            <div className="col">
              <div className="card summary-card h-100">
                <div className="summary-card-header">
                  <h6 className="summary-card-title">Avg Order Value</h6>
                  <TrendingUp size={24} className="summary-card-icon" />
                </div>
                <div className="summary-card-body">
                  <h3 className="summary-card-value">
                    ETB{" "}
                    {Number(liveSummary.averageOrderValue).toLocaleString(
                      undefined,
                      { maximumFractionDigits: 0 }
                    )}
                  </h3>
                  <p
                    className={`summary-card-subtext ${
                      liveSummary.averageOrderValueChange >= 0
                        ? "text-success"
                        : "text-danger"
                    }`}
                  >
                    {liveSummary.averageOrderValueChange >= 0 ? "+" : ""}
                    {liveSummary.averageOrderValueChange}% from last month
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* TABLE */}
          <div className="card">
            <div className="card-header">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title">All Transactions</h5>
                  <p className="card-text text-muted">
                    Payments, farmer payouts, and refund requests via Chapa
                  </p>
                </div>

                <div className="d-flex align-items-center flex-wrap flex-lg-nowrap gap-3">
                  <div className="search-container">
                    <Search
                      size={16}
                      className="search-icon"
                      style={{ color: "#28a745" }}
                    />
                    <input
                      type="text"
                      className="form-control search-input"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
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
                    >
                      <option value="all">All Types</option>
                      <option value="payment">Payment</option>
                      <option value="paymentToFarmer">Farmer Payout</option>
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
                  <thead style={{ backgroundColor: "#f8f9fa" }}>
                    <tr>
                      {[
                        "#",
                        "Transaction ID",
                        "Type",
                        "Order",
                        "Farmer",
                        "Buyer",
                        "Product",
                        "Amount",
                        "Method",
                        "Status",
                        "Date",
                        "Actions",
                      ].map((h) => (
                        <th
                          key={h}
                          style={{
                            fontSize: "14px",
                            color: "#6c757d",
                            fontWeight: "normal",
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.length > 0 ? (
                      filteredTransactions.map((t, i) => (
                        <tr
                          key={t.id}
                          className="bg-white shadow-sm"
                          style={{ border: "1px solid #e9ecef" }}
                        >
                          <td style={{ fontSize: "14px", padding: "12px" }}>
                            <strong>{i + 1}</strong>
                          </td>
                          <td style={{ fontSize: "14px", padding: "12px" }}>
                            <strong>{t.id}</strong>
                          </td>
                          <td style={{ padding: "12px" }}>
                            <span
                              className={`badge ${getTypeColor(t.type)}`}
                              style={{
                                fontSize: "12px",
                                padding: "4px 8px",
                                color: "#fff",
                                borderRadius: "12px",
                              }}
                            >
                              {t.type === "paymentToFarmer"
                                ? "Farmer Payout"
                                : t.type}
                            </span>
                          </td>
                          <td style={{ fontSize: "14px", padding: "12px" }}>
                            <strong>{t.orderId}</strong>
                          </td>
                          <td style={{ fontSize: "14px", padding: "12px" }}>
                            {t.farmer}
                          </td>
                          <td style={{ fontSize: "14px", padding: "12px" }}>
                            {t.buyer}
                          </td>
                          <td style={{ fontSize: "14px", padding: "12px" }}>
                            {t.product}
                          </td>
                          <td style={{ fontSize: "14px", padding: "12px" }}>
                            <strong>
                              ETB {Number(t.amount).toLocaleString()}
                            </strong>
                          </td>
                          <td style={{ padding: "12px" }}>
                            <div className="d-flex align-items-center">
                              <CreditCard
                                size={16}
                                className="me-2 text-primary"
                              />
                              {t.method}
                            </div>
                          </td>
                          <td style={{ padding: "12px" }}>
                            <span
                              className={`badge ${getStatusColor(t.status)}`}
                              style={{
                                fontSize: "12px",
                                padding: "4px 8px",
                                color: "#fff",
                                borderRadius: "12px",
                              }}
                            >
                              {t.status}
                            </span>
                          </td>
                          <td style={{ fontSize: "12px", padding: "12px" }}>
                            {formatDate(t.date)}
                          </td>
                          <td style={{ padding: "12px" }}>
                            <button
                              className="btn btn-sm btn-light"
                              onClick={() => handleOpenModal(t)}
                            >
                              <MoreHorizontal size={16} />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={12}
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

          {/* MODAL */}
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
                    />
                  </div>

                  <div
                    className="modal-body"
                    style={{ padding: "15px", fontSize: "14px" }}
                  >
                    {[
                      {
                        label: "Transaction ID",
                        value: selectedTransaction.id,
                      },
                      {
                        label: "Ref ID",
                        value: selectedTransaction.refId || "N/A",
                      },
                      {
                        label: "Order ID",
                        value: selectedTransaction.orderId || "N/A",
                      },
                      {
                        label: "Farmer",
                        value: selectedTransaction.farmer || "Unknown",
                      },
                      {
                        label: "Buyer",
                        value: selectedTransaction.buyer || "Unknown",
                      },
                      {
                        label: "Amount",
                        value: `ETB ${Number(
                          selectedTransaction.amount || 0
                        ).toLocaleString()}`,
                      },
                      {
                        label: "Method",
                        value: selectedTransaction.method || "N/A",
                      },
                      {
                        label: "Date",
                        value: formatDate(selectedTransaction.date),
                      },
                    ].map((f) => (
                      <div className="mb-3" key={f.label}>
                        <label
                          className="form-label"
                          style={{ fontSize: "14px", color: "#6c757d" }}
                        >
                          {f.label}
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={f.value}
                          readOnly
                          style={{ backgroundColor: "#e9ecef" }}
                        />
                      </div>
                    ))}

                    {/* FULL PRODUCT LIST */}
                    {selectedTransaction.productList?.length > 0 && (
                      <div className="mb-3">
                        <label
                          className="form-label"
                          style={{ fontSize: "14px", color: "#6c757d" }}
                        >
                          Products
                        </label>
                        <ul
                          className="list-unstyled mb-0"
                          style={{ fontSize: "14px" }}
                        >
                          {selectedTransaction.productList.map((p, i) => (
                            <li key={i}>
                              • <strong>{p.name}</strong> — {p.quantity}{" "}
                              {p.unit} @ ETB {p.price} = ETB {p.total}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedTransaction.reason && (
                      <div className="mb-3">
                        <label
                          className="form-label"
                          style={{ fontSize: "14px", color: "#6c757d" }}
                        >
                          {selectedTransaction.type === "refund"
                            ? "Reason"
                            : "Payout Note"}
                        </label>
                        <textarea
                          className="form-control"
                          value={selectedTransaction.reason}
                          readOnly
                          style={{
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
                          value={`${selectedTransaction.buyer} (ID: ${
                            selectedTransaction.buyerId || "N/A"
                          })`}
                          readOnly
                          style={{ backgroundColor: "#e9ecef" }}
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
                        className="form-select"
                        value={editedStatus}
                        onChange={(e) => setEditedStatus(e.target.value)}
                      >
                        {["payment", "paymentToFarmer"].includes(
                          selectedTransaction.type
                        ) ? (
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
                      onClick={handleSaveChanges}
                    >
                      Save Changes
                    </button>
                    <button
                      className="btn btn-secondary"
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
