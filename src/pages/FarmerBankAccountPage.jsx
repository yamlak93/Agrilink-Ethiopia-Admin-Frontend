// src/pages/FarmerBankAccountPage.jsx
import { useState, useEffect, useMemo } from "react";
import {
  CheckCircle,
  XCircle,
  Search,
  Filter,
  MoreHorizontal,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "../Css/Devices.css";
import "bootstrap/dist/css/bootstrap.min.css";
import apiClient from "../api/api"; // Your axios instance

// Format date: Oct 29, 2025
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const FarmerBankAccountPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [verifiedFilter, setVerifiedFilter] = useState("all");
  const [bankAccounts, setBankAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  // FETCH DATA FROM BACKEND
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
        const { data } = await apiClient.get("/bank-accounts", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (data.success) {
          setBankAccounts(data.accounts || []);
        } else {
          setError("Failed to load accounts.");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to connect to server.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // FILTERED ACCOUNTS
  const filteredAccounts = useMemo(() => {
    let list = [...bankAccounts];

    if (verifiedFilter !== "all") {
      list = list.filter(
        (a) => a.is_verified === (verifiedFilter === "verified" ? 1 : 0)
      );
    }

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      list = list.filter((a) =>
        [
          a.farmer_name,
          a.farmer_id,
          a.account_number,
          a.account_name,
          a.phone,
          a.bank_name,
        ].some((v) =>
          String(v || "")
            .toLowerCase()
            .includes(q)
        )
      );
    }

    return list;
  }, [bankAccounts, verifiedFilter, searchTerm]);

  // SUMMARY STATS
  const liveSummary = useMemo(() => {
    const total = filteredAccounts.length;
    const verified = filteredAccounts.filter((a) => a.is_verified).length;
    const unverified = total - verified;

    return {
      verified,
      unverified,
      verifiedPercentage: total > 0 ? ((verified / total) * 100).toFixed(1) : 0,
    };
  }, [filteredAccounts]);

  // BADGE
  const getVerifiedBadge = (verified) => {
    return verified ? "bg-success" : "bg-warning text-dark";
  };

  // OPEN MODAL
  const handleOpenModal = (account) => {
    setSelectedAccount(account);
    setIsModalOpen(true);
  };

  // TOGGLE VERIFICATION → CALL API
  const handleToggleVerify = async () => {
    if (!selectedAccount) return;

    const token = localStorage.getItem("token");
    const newStatus = selectedAccount.is_verified === 1 ? 0 : 1;

    try {
      const { data } = await apiClient.patch(
        `/bank-accounts/toggle/${selectedAccount.id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        const now = new Date().toISOString();

        setBankAccounts((prev) =>
          prev.map((a) =>
            a.id === selectedAccount.id
              ? { ...a, is_verified: newStatus, updated_at: now }
              : a
          )
        );

        setSelectedAccount((prev) => ({
          ...prev,
          is_verified: newStatus,
          updated_at: now,
        }));
      }
    } catch (err) {
      alert("Failed to update verification status. Please try again.");
      console.error(err);
    }
  };

  // LOADING
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // ERROR
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
                Farmer Bank Accounts
              </h2>
              <p
                className="text-muted"
                style={{ fontSize: "14px", color: "#6c757d" }}
              >
                Manage farmer bank details and verification status
              </p>
            </div>
          </div>

          {/* 2 SUMMARY CARDS */}
          <div className="row row-cols-1 row-cols-md-2 g-4 mb-4">
            {/* Verified */}
            <div className="col">
              <div className="card summary-card h-100">
                <div className="summary-card-header">
                  <h6 className="summary-card-title">Verified Accounts</h6>
                  <CheckCircle size={24} className="summary-card-icon" />
                </div>
                <div className="summary-card-body">
                  <h3 className="summary-card-value">{liveSummary.verified}</h3>
                  <p className="summary-card-subtext text-success">
                    {liveSummary.verifiedPercentage}% of filtered
                  </p>
                </div>
              </div>
            </div>

            {/* Unverified */}
            <div className="col">
              <div className="card summary-card h-100">
                <div className="summary-card-header">
                  <h6 className="summary-card-title">Unverified Accounts</h6>
                  <XCircle size={24} className="summary-card-icon" />
                </div>
                <div className="summary-card-body">
                  <h3 className="summary-card-value">
                    {liveSummary.unverified}
                  </h3>
                  <p className="summary-card-subtext text-warning">
                    Needs verification
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
                  <h5 className="card-title">All Bank Accounts</h5>
                  <p className="card-text text-muted">
                    Farmer bank details linked with Chapa
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
                      placeholder="Search farmer, account, bank..."
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
                      value={verifiedFilter}
                      onChange={(e) => setVerifiedFilter(e.target.value)}
                    >
                      <option value="all">All Verification</option>
                      <option value="verified">Verified</option>
                      <option value="unverified">Unverified</option>
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
                        "Farmer ID",
                        "Farmer",
                        "Phone",
                        "Bank",
                        "Account Number",
                        "Account Name",
                        "Verified",
                        "Created",
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
                    {filteredAccounts.length > 0 ? (
                      filteredAccounts.map((acc, i) => (
                        <tr
                          key={acc.id}
                          className="bg-white shadow-sm"
                          style={{ border: "1px solid #e9ecef" }}
                        >
                          <td style={{ fontSize: "14px", padding: "12px" }}>
                            <strong>{i + 1}</strong>
                          </td>
                          <td style={{ fontSize: "14px", padding: "12px" }}>
                            <strong>{acc.farmer_id}</strong>
                          </td>
                          <td style={{ fontSize: "14px", padding: "12px" }}>
                            {acc.farmer_name}
                          </td>
                          <td style={{ fontSize: "14px", padding: "12px" }}>
                            {acc.phone}
                          </td>
                          <td style={{ fontSize: "14px", padding: "12px" }}>
                            <span className="badge bg-info">
                              {acc.bank_name}
                            </span>
                          </td>
                          <td style={{ fontSize: "14px", padding: "12px" }}>
                            <code>{acc.account_number}</code>
                          </td>
                          <td style={{ fontSize: "14px", padding: "12px" }}>
                            {acc.account_name}
                          </td>
                          <td style={{ padding: "12px" }}>
                            <span
                              className={`badge ${getVerifiedBadge(
                                acc.is_verified
                              )}`}
                              style={{
                                fontSize: "12px",
                                padding: "4px 8px",
                                color: "#fff",
                                borderRadius: "12px",
                              }}
                            >
                              {acc.is_verified ? "Verified" : "Unverified"}
                            </span>
                          </td>
                          <td style={{ fontSize: "12px", padding: "12px" }}>
                            {formatDate(acc.created_at)}
                          </td>
                          <td style={{ padding: "12px" }}>
                            <button
                              className="btn btn-sm btn-light"
                              onClick={() => handleOpenModal(acc)}
                            >
                              <MoreHorizontal size={16} />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={10}
                          className="text-center"
                          style={{ fontSize: "14px", color: "#212529" }}
                        >
                          No bank accounts match the selected filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* MODAL */}
          {isModalOpen && selectedAccount && (
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
                      Bank Account Details
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
                      { label: "Farmer ID", value: selectedAccount.farmer_id },
                      {
                        label: "Farmer Name",
                        value: selectedAccount.farmer_name,
                      },
                      { label: "Phone", value: selectedAccount.phone },
                      { label: "Bank", value: selectedAccount.bank_name },
                      {
                        label: "Account Number",
                        value: selectedAccount.account_number,
                      },
                      {
                        label: "Account Name",
                        value: selectedAccount.account_name,
                      },
                      {
                        label: "Created",
                        value: formatDate(selectedAccount.created_at),
                      },
                      {
                        label: "Last Updated",
                        value: formatDate(selectedAccount.updated_at),
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

                    <div className="mb-3">
                      <label
                        className="form-label"
                        style={{ fontSize: "14px", color: "#6c757d" }}
                      >
                        Verification Status
                      </label>
                      <div
                        className={`badge w-100 text-center py-2 ${
                          selectedAccount.is_verified
                            ? "bg-success"
                            : "bg-warning text-dark"
                        }`}
                        style={{ fontSize: "14px" }}
                      >
                        {selectedAccount.is_verified
                          ? "Verified"
                          : "Unverified"}
                      </div>
                    </div>

                    {/* TOGGLE BUTTON */}
                    <div className="text-center mt-4">
                      <button
                        className={`btn btn-sm ${
                          selectedAccount.is_verified === 1
                            ? "btn-outline-warning"
                            : "btn-outline-success"
                        }`}
                        onClick={handleToggleVerify}
                      >
                        {selectedAccount.is_verified === 1 ? (
                          <>
                            <AlertCircle size={16} className="me-2" />
                            Mark as Unverified
                          </>
                        ) : (
                          <>
                            <ShieldCheck size={16} className="me-2" />
                            Mark as Verified
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div
                    className="modal-footer"
                    style={{
                      borderTop: "none",
                      padding: "15px",
                      justifyContent: "flex-end",
                    }}
                  >
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

export default FarmerBankAccountPage;
