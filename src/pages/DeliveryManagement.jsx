import React, { useState, useEffect } from "react";
import "../Css/Devices.css";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import DeliveryDetailModal from "../components/DeliveryDetailModal";
import StylishModal from "../components/StylishModal";
import { FaSearch, FaFilter } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import apiClient from "../api/api";

const DeliveryManagement = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState({ startDate: "" });
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showStylishModal, setShowStylishModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");
  const [editFormData, setEditFormData] = useState({
    productName: "",
    quantity: "",
    unit: "",
    farmerName: "",
    buyerName: "",
    status: "",
    deliveryDate: "",
    deliveryAddress: "",
    orderId: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchDeliveries = async () => {
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
        const response = await apiClient.get("/deliveries/allDeliveries", {
          headers,
        });
        console.log("Fetched all deliveries:", response.data.deliveries);
        const fetchedDeliveries = response.data.deliveries.map((delivery) => ({
          id: delivery.id,
          orderId: delivery.orderId || "N/A",
          productName: delivery.productName || "Unknown Product",
          quantity: delivery.quantity || 0,
          unit: delivery.unit || "",
          farmerName: delivery.farmerName || "Unknown Farmer",
          buyerName: delivery.buyerName || "Unknown Buyer",
          requestDate: delivery.requestDate
            ? delivery.requestDate.split("T")[0]
            : new Date().toISOString().split("T")[0],
          deliveryDate: delivery.deliveryDate
            ? delivery.deliveryDate.split("T")[0]
            : null,
          status: delivery.status || "pending",
          deliveryAddress: delivery.deliveryAddress || "Not specified",
          farmName: delivery.farmName || "Not specified",
          farmLocation: delivery.farmLocation || "Not specified",
        }));

        if (isMounted) {
          setDeliveries(fetchedDeliveries);
        }
      } catch (err) {
        console.error(
          "Failed to fetch all deliveries:",
          err.response?.data || err
        );
        if (err.response?.status === 401) {
          setError("Authentication failed. Please log in again.");
          window.location.href = "/admin/login";
        } else {
          setError(
            `Failed to load deliveries. ${
              err.response?.data?.message || err.message
            }`
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    fetchDeliveries().catch((err) => {
      if (isMounted) {
        console.error("Uncaught error in fetch:", err);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredDeliveries = deliveries.filter((delivery) => {
    const matchesSearch =
      delivery.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.buyerName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      delivery.status.toLowerCase() === statusFilter.toLowerCase();

    const startDate = dateFilter.startDate
      ? new Date(dateFilter.startDate)
      : null;
    const requestDate = new Date(delivery.requestDate);
    const matchesDate =
      !startDate || requestDate.toDateString() === startDate.toDateString();

    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleStatusChange = async (newStatus) => {
    const token = localStorage.getItem("token");
    try {
      await apiClient.put(
        `/deliveries/${selectedDelivery.id}/status`,
        {
          status: newStatus,
          deliveryDate: selectedDelivery.deliveryDate,
          deliveryAddress: selectedDelivery.deliveryAddress,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDeliveries((prev) =>
        prev.map((d) =>
          d.id === selectedDelivery.id
            ? {
                ...d,
                status: newStatus,
                deliveryDate: new Date().toISOString().split("T")[0],
              }
            : d
        )
      );
      setSelectedDelivery((prev) => ({
        ...prev,
        status: newStatus,
        deliveryDate: new Date().toISOString().split("T")[0],
      }));
      setModalMessage(
        `Delivery ${selectedDelivery.id} status updated to ${newStatus}.`
      );
      setModalType("success");
    } catch (err) {
      console.error(
        "Failed to update status:",
        err.response?.data || err.message
      );
      setModalMessage("Failed to update delivery status.");
      setModalType("danger");
    } finally {
      setShowStylishModal(true);
    }
  };

  const handleEditConfirm = async () => {
    const token = localStorage.getItem("token");
    try {
      await apiClient.put(
        `/deliveries/${selectedDelivery.id}/status`,
        {
          status: editFormData.status,
          deliveryDate: editFormData.deliveryDate,
          deliveryAddress: editFormData.deliveryAddress,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDeliveries((prev) =>
        prev.map((d) =>
          d.id === selectedDelivery.id
            ? {
                ...d,
                status: editFormData.status,
                deliveryDate: editFormData.deliveryDate,
                deliveryAddress: editFormData.deliveryAddress,
              }
            : d
        )
      );
      setSelectedDelivery((prev) => ({
        ...prev,
        status: editFormData.status,
        deliveryDate: editFormData.deliveryDate,
        deliveryAddress: editFormData.deliveryAddress,
      }));
      setShowEditModal(false);
      setModalMessage(`Delivery ${selectedDelivery.id} updated successfully.`);
      setModalType("success");
    } catch (err) {
      console.error(
        "Failed to update delivery:",
        err.response?.data || err.message
      );
      setModalMessage("Failed to update delivery.");
      setModalType("danger");
    } finally {
      setShowStylishModal(true);
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
    <>
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
                Delivery Management
              </h2>
              <p
                className="text-muted"
                style={{ fontSize: "14px", color: "#6c757d" }}
              >
                View and manage all delivery requests on the AgriLink Ethiopia
                platform
              </p>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title">All Deliveries</h5>
                  <p className="card-text text-muted">
                    Manage delivery requests and statuses
                  </p>
                </div>
                <div className="d-flex align-items-center gap-4">
                  <div className="search-container">
                    <FaSearch
                      size={16}
                      className="search-icon"
                      style={{ color: "#28a745" }}
                    />
                    <input
                      type="text"
                      className="form-control search-input"
                      placeholder="Search deliveries..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      aria-label="Search deliveries"
                    />
                  </div>
                  <div className="filter-container">
                    <FaFilter
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
                      <option value="All">All Status</option>
                      <option value="pending">pending</option>
                      <option value="accepted">accepted</option>
                      <option value="in transit">in transit</option>
                      <option value="delivered">delivered</option>
                      <option value="rejected">rejected</option>
                    </select>
                  </div>
                  <div className="filter-container">
                    <FaFilter
                      size={16}
                      className="filter-icon"
                      style={{ color: "#28a745" }}
                    />
                    <input
                      type="date"
                      className="form-control filter-select"
                      value={dateFilter.startDate}
                      onChange={(e) =>
                        setDateFilter({
                          ...dateFilter,
                          startDate: e.target.value,
                        })
                      }
                      aria-label="Filter by date"
                    />
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
                        Delivery ID
                      </th>
                      <th
                        style={{
                          fontSize: "14px",
                          color: "#6c757d",
                          fontWeight: "normal",
                        }}
                      >
                        Order ID
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
                        Quantity
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
                        Request Date
                      </th>
                      <th
                        style={{
                          fontSize: "14px",
                          color: "#6c757d",
                          fontWeight: "normal",
                        }}
                      >
                        Delivery Date
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
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDeliveries.length > 0 ? (
                      filteredDeliveries
                        .sort(
                          (a, b) =>
                            new Date(b.requestDate) - new Date(a.requestDate)
                        )
                        .map((delivery, index) => (
                          <tr key={delivery.id}>
                            <td style={{ fontSize: "14px", color: "#212529" }}>
                              {index + 1}
                            </td>
                            <td style={{ fontSize: "14px", color: "#212529" }}>
                              {delivery.id}
                            </td>
                            <td style={{ fontSize: "14px", color: "#212529" }}>
                              {delivery.orderId}
                            </td>
                            <td style={{ fontSize: "14px", color: "#212529" }}>
                              <div style={{ fontWeight: "bold" }}>
                                {delivery.productName}
                              </div>
                            </td>
                            <td style={{ fontSize: "14px", color: "#212529" }}>
                              {delivery.quantity} {delivery.unit}
                            </td>
                            <td style={{ fontSize: "14px", color: "#212529" }}>
                              {delivery.farmerName}
                            </td>
                            <td style={{ fontSize: "14px", color: "#212529" }}>
                              {delivery.buyerName}
                            </td>
                            <td style={{ fontSize: "14px", color: "#212529" }}>
                              {delivery.requestDate}
                            </td>
                            <td style={{ fontSize: "14px", color: "#212529" }}>
                              {delivery.deliveryDate || "Not set"}
                            </td>
                            <td>
                              <span
                                className={`badge ${
                                  delivery.status === "delivered"
                                    ? "bg-success"
                                    : delivery.status === "in transit"
                                    ? "bg-primary"
                                    : delivery.status === "pending"
                                    ? "bg-warning"
                                    : delivery.status === "accepted"
                                    ? "bg-info"
                                    : "bg-danger"
                                }`}
                                style={{
                                  fontSize: "12px",
                                  padding: "4px 8px",
                                  color: "#fff",
                                  borderRadius: "12px",
                                }}
                              >
                                {delivery.status}
                              </span>
                            </td>
                            <td style={{ fontSize: "14px", color: "#212529" }}>
                              <button
                                className="btn btn-sm btn-light"
                                style={{
                                  fontSize: "14px",
                                  padding: "4px 8px",
                                  borderRadius: "4px",
                                }}
                                onClick={() => {
                                  setSelectedDelivery(delivery);
                                  setShowDetailsModal(true);
                                }}
                              >
                                ⋮
                              </button>
                            </td>
                          </tr>
                        ))
                    ) : (
                      <tr>
                        <td
                          colSpan="10"
                          className="text-center"
                          style={{ fontSize: "14px", color: "#212529" }}
                        >
                          No deliveries found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Show detail modal */}
          {showDetailsModal && (
            <DeliveryDetailModal
              delivery={selectedDelivery}
              onClose={() => setShowDetailsModal(false)}
              onEdit={() => {
                setEditFormData({
                  productName: selectedDelivery.productName,
                  quantity: selectedDelivery.quantity,
                  unit: selectedDelivery.unit,
                  farmerName: selectedDelivery.farmerName,
                  buyerName: selectedDelivery.buyerName,
                  status: selectedDelivery.status,
                  deliveryDate: selectedDelivery.deliveryDate || "",
                  deliveryAddress: selectedDelivery.deliveryAddress,
                  orderId: selectedDelivery.orderId,
                });
                setShowDetailsModal(false);
                setShowEditModal(true);
              }}
              onStatusChange={handleStatusChange}
            />
          )}

          {/* Show edit modal */}
          {showEditModal && (
            <div
              className="modal show d-block"
              tabIndex="-1"
              style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            >
              <div
                className="modal-dialog modal-dialog-centered"
                style={{ maxWidth: "400px" }}
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
                      Edit Delivery: {selectedDelivery.productName}
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                      }}
                      onClick={() => setShowEditModal(false)}
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
                    <form>
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
                          style={{
                            fontSize: "14px",
                            color: "#495057",
                            borderColor: "#ced4da",
                            padding: "6px 12px",
                            borderRadius: "4px",
                            backgroundColor: "#e9ecef",
                          }}
                          value={editFormData.orderId}
                          readOnly
                        />
                      </div>
                      <div className="mb-3">
                        <label
                          className="form-label"
                          style={{ fontSize: "14px", color: "#6c757d" }}
                        >
                          Product Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          style={{
                            fontSize: "14px",
                            color: "#495057",
                            borderColor: "#ced4da",
                            padding: "6px 12px",
                            borderRadius: "4px",
                            backgroundColor: "#e9ecef",
                          }}
                          value={editFormData.productName}
                          readOnly
                        />
                      </div>
                      <div className="mb-3">
                        <label
                          className="form-label"
                          style={{ fontSize: "14px", color: "#6c757d" }}
                        >
                          Quantity
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          style={{
                            fontSize: "14px",
                            color: "#495057",
                            borderColor: "#ced4da",
                            padding: "6px 12px",
                            borderRadius: "4px",
                            backgroundColor: "#e9ecef",
                          }}
                          value={editFormData.quantity}
                          readOnly
                        />
                      </div>
                      <div className="mb-3">
                        <label
                          className="form-label"
                          style={{ fontSize: "14px", color: "#6c757d" }}
                        >
                          Unit
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          style={{
                            fontSize: "14px",
                            color: "#495057",
                            borderColor: "#ced4da",
                            padding: "6px 12px",
                            borderRadius: "4px",
                            backgroundColor: "#e9ecef",
                          }}
                          value={editFormData.unit}
                          readOnly
                        />
                      </div>
                      <div className="mb-3">
                        <label
                          className="form-label"
                          style={{ fontSize: "14px", color: "#6c757d" }}
                        >
                          Farmer Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          style={{
                            fontSize: "14px",
                            color: "#495057",
                            borderColor: "#ced4da",
                            padding: "6px 12px",
                            borderRadius: "4px",
                            backgroundColor: "#e9ecef",
                          }}
                          value={editFormData.farmerName}
                          readOnly
                        />
                      </div>
                      <div className="mb-3">
                        <label
                          className="form-label"
                          style={{ fontSize: "14px", color: "#6c757d" }}
                        >
                          Buyer Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          style={{
                            fontSize: "14px",
                            color: "#495057",
                            borderColor: "#ced4da",
                            padding: "6px 12px",
                            borderRadius: "4px",
                            backgroundColor: "#e9ecef",
                          }}
                          value={editFormData.buyerName}
                          readOnly
                        />
                      </div>
                      <div className="mb-3">
                        <label
                          className="form-label"
                          style={{ fontSize: "14px", color: "#6c757d" }}
                        >
                          Delivery Date
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          style={{
                            fontSize: "14px",
                            color: "#495057",
                            borderColor: "#ced4da",
                            padding: "6px 12px",
                            borderRadius: "4px",
                          }}
                          value={editFormData.deliveryDate}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              deliveryDate: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="mb-3">
                        <label
                          className="form-label"
                          style={{ fontSize: "14px", color: "#6c757d" }}
                        >
                          Delivery Address
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          style={{
                            fontSize: "14px",
                            color: "#495057",
                            borderColor: "#ced4da",
                            padding: "6px 12px",
                            borderRadius: "4px",
                          }}
                          value={editFormData.deliveryAddress}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              deliveryAddress: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="mb-3">
                        <label
                          className="form-label"
                          style={{ fontSize: "14px", color: "#6c757d" }}
                        >
                          Status
                        </label>
                        <select
                          className="form-select"
                          style={{
                            fontSize: "14px",
                            color: "#495057",
                            borderColor: "#ced4da",
                            padding: "6px 12px",
                            borderRadius: "4px",
                          }}
                          value={editFormData.status}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              status: e.target.value,
                            })
                          }
                        >
                          <option value="pending">pending</option>
                          <option value="accepted">accepted</option>
                          <option value="in transit">in transit</option>
                          <option value="delivered">delivered</option>
                          <option value="rejected">rejected</option>
                        </select>
                      </div>
                    </form>
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
                      className="btn btn-success"
                      style={{
                        fontSize: "14px",
                        padding: "6px 12px",
                        borderRadius: "4px",
                      }}
                      onClick={handleEditConfirm}
                    >
                      Confirm
                    </button>
                    <button
                      className="btn btn-secondary"
                      style={{
                        fontSize: "14px",
                        padding: "6px 12px",
                        borderRadius: "4px",
                      }}
                      onClick={() => setShowEditModal(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stylish Confirmation Modal */}
          <StylishModal
            isVisible={showStylishModal}
            message={modalMessage}
            type={modalType}
            onClose={() => setShowStylishModal(false)}
          />
        </div>
      </div>
    </>
  );
};

export default DeliveryManagement;
