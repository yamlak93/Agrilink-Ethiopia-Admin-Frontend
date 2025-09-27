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

const PaymentsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [transactions, setTransactions] = useState([
    {
      id: "PAY-001",
      orderId: "ORD-2024-001",
      farmer: "Alemayehu Tadesse",
      buyer: "Addis Market Co.",
      product: "Teff (White)",
      amount: 2500,
      method: "Chapa",
      status: "completed",
      date: "2024-01-15",
      transactionId: "TXN-CH-001234",
      type: "payment",
    },
    {
      id: "PAY-002",
      orderId: "ORD-2024-002",
      farmer: "Meseret Bekele",
      buyer: "Fresh Foods Ltd",
      product: "Coffee Beans",
      amount: 4200,
      method: "Chapa",
      status: "completed",
      date: "2024-01-15",
      transactionId: "TXN-CH-001235",
      type: "payment",
    },
    {
      id: "PAY-003",
      orderId: "ORD-2024-003",
      farmer: "Dawit Haile",
      buyer: "Green Valley Store",
      product: "Maize",
      amount: 1800,
      method: "Chapa",
      status: "pending",
      date: "2024-01-14",
      transactionId: "TXN-CH-001236",
      type: "payment",
    },
    {
      id: "REF-001",
      orderId: "ORD-2024-005",
      farmer: "Yohannes Mekonen",
      buyer: "Metro Supermarket",
      product: "Wheat",
      amount: 2800,
      method: "Chapa",
      status: "pending",
      date: "2024-01-13",
      transactionId: "REF-CH-001",
      type: "refund",
      reason: "Order cancelled by buyer - Product quality concerns",
      requestedBy: "buyer",
    },
    {
      id: "REF-002",
      orderId: "ORD-2024-006",
      farmer: "Hanna Girma",
      buyer: "Local Restaurant",
      product: "Onions",
      amount: 1200,
      method: "Chapa",
      status: "approved",
      date: "2024-01-12",
      transactionId: "REF-CH-002",
      type: "refund",
      reason: "Order cancelled by buyer - Product quality concerns",
      requestedBy: "buyer",
    },
    {
      id: "REF-003",
      orderId: "ORD-2024-007",
      farmer: "Solomon Tesfaye",
      buyer: "Wholesale Market",
      product: "Tomatoes",
      amount: 750,
      method: "Chapa",
      status: "processing",
      date: "2024-01-11",
      transactionId: "REF-CH-003",
      type: "refund",
      reason: "Partial order cancellation - Buyer reduced quantity",
      requestedBy: "buyer",
    },
    {
      id: "REF-004",
      orderId: "ORD-2024-008",
      farmer: "Birtukan Assefa",
      buyer: "Export Company",
      product: "Sesame Seeds",
      amount: 5200,
      method: "Chapa",
      status: "rejected",
      date: "2024-01-10",
      transactionId: "REF-CH-004",
      type: "refund",
      reason: "Order cancelled by buyer - Unable to meet delivery deadline",
      requestedBy: "buyer",
    },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [editedStatus, setEditedStatus] = useState("");

  // Mock payment summary data
  const paymentSummary = {
    totalPayments: 2847500,
    successfulPayments: 2698,
    pendingRefunds: 23,
    totalRefunded: 148500,
    averageOrderValue: 1055,
  };

  // Filter transactions based on search term and status
  useEffect(() => {
    let filtered = transactions;

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (transaction) => transaction.status === statusFilter
      );
    }

    if (searchTerm) {
      const lowercasedQuery = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (transaction) =>
          transaction.id.toLowerCase().includes(lowercasedQuery) ||
          transaction.orderId.toLowerCase().includes(lowercasedQuery) ||
          transaction.farmer.toLowerCase().includes(lowercasedQuery) ||
          transaction.buyer.toLowerCase().includes(lowercasedQuery) ||
          transaction.product.toLowerCase().includes(lowercasedQuery) ||
          transaction.transactionId.toLowerCase().includes(lowercasedQuery)
      );
    }

    setFilteredTransactions(filtered);
  }, [searchTerm, statusFilter, transactions]);

  const [filteredTransactions, setFilteredTransactions] =
    useState(transactions);

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

  const handleSaveChanges = () => {
    if (selectedTransaction) {
      setTransactions((prev) =>
        prev.map((transaction) =>
          transaction.id === selectedTransaction.id
            ? { ...transaction, status: editedStatus }
            : transaction
        )
      );
      setIsModalOpen(false);
    }
  };

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
                    +12.5% from last month
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
                    94.7% success rate
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
                    5.2% of total payments
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
                    +8.2% from last month
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
                <div className="d-flex gap-3 align-items-center">
                  <div className="row">
                    <div className="col-12 col-md-3 mb-2 mb-md-0">
                      <div
                        className="search-container"
                        style={{ paddingRight: "10px" }}
                      >
                        <Search size={20} className="search-icon" />
                        <input
                          type="text"
                          className="form-control search-input"
                          placeholder="Search transactions..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          aria-label="Search transactions"
                        />
                      </div>
                    </div>
                    <div className="col-12 col-md-3">
                      <div
                        className="filter-container"
                        style={{ paddingRight: "10px" }}
                      >
                        <Filter size={20} className="filter-icon" />
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
                      filteredTransactions.map((transaction) => (
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
                        Transaction ID
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={selectedTransaction.id}
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
                        value={selectedTransaction.orderId}
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
                        value={selectedTransaction.farmer}
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
                        value={selectedTransaction.buyer}
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
                        value={selectedTransaction.product}
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
                        value={`ETB ${selectedTransaction.amount.toLocaleString()}`}
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
                        value={selectedTransaction.method}
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
                        value={selectedTransaction.transactionId}
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
                        value={selectedTransaction.date}
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
                      <>
                        <div className="mb-3">
                          <label
                            className="form-label"
                            style={{ fontSize: "14px", color: "#6c757d" }}
                          >
                            Reason
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            value={selectedTransaction.reason || ""}
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
                            Requested By
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            value={selectedTransaction.requestedBy || ""}
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
                      </>
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
                        <option value="completed">Completed</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="processing">Processing</option>
                        <option value="failed">Failed</option>
                        <option value="rejected">Rejected</option>
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
