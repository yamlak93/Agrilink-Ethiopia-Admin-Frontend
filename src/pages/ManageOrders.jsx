import React, { useState, useEffect } from "react";
import "../Css/Devices.css";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import OrderDetailModal from "../components/OrderDetailModal";
import StylishModal from "../components/StylishModal";
import { FaSearch, FaFilter } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import apiClient from "../api/api";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState({ startDate: "" });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStylishModal, setShowStylishModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");
  const [editFormData, setEditFormData] = useState({
    totalPrice: "",
    status: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication required. Please log in.");
        window.location.href = "/admin/login";
        return;
      }

      try {
        const response = await apiClient.get("/orders/all", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const fetchedOrders = response.data.orders.map((order) => ({
          id: order.id,
          products: order.products,
          totalPrice: order.totalPrice,
          buyerName: order.buyerName,
          farmerName: order.farmerName,
          status: order.status,
          transactionStatus: order.transactionStatus,
          orderDate: order.orderDate,
          updatedAt: order.updatedAt,
        }));

        if (isMounted) setOrders(fetchedOrders);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/admin/login";
        } else {
          setError(
            `Failed to load orders. ${
              err.response?.data?.message || err.message
            }`
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchOrders();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.products.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.farmerName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || order.status === statusFilter;
    const matchesDate =
      !dateFilter.startDate || order.orderDate === dateFilter.startDate;

    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleStatusChange = async (newStatus) => {
    const token = localStorage.getItem("token");
    try {
      await apiClient.put(
        `/orders/update/${selectedOrder.id}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setOrders((prev) =>
        prev.map((o) =>
          o.id === selectedOrder.id ? { ...o, status: newStatus } : o
        )
      );
      setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
      setModalMessage("Order status updated successfully.");
      setModalType("success");
    } catch (err) {
      setModalMessage("Failed to update status.");
      setModalType("danger");
    } finally {
      setShowStylishModal(true);
    }
  };

  const handleEditConfirm = async () => {
    const token = localStorage.getItem("token");
    try {
      await apiClient.put(`/orders/update/${selectedOrder.id}`, editFormData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders((prev) =>
        prev.map((o) =>
          o.id === selectedOrder.id ? { ...o, ...editFormData } : o
        )
      );
      setSelectedOrder((prev) => ({ ...prev, ...editFormData }));
      setShowEditModal(false);
      setModalMessage("Order updated successfully.");
      setModalType("success");
    } catch (err) {
      setModalMessage("Failed to update order.");
      setModalType("danger");
    } finally {
      setShowStylishModal(true);
    }
  };

  const handleDeleteConfirm = async () => {
    const token = localStorage.getItem("token");
    try {
      await apiClient.delete(`/orders/delete/${selectedOrder.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders((prev) => prev.filter((o) => o.id !== selectedOrder.id));
      setShowDeleteModal(false);
      setModalMessage("Order deleted successfully.");
      setModalType("success");
    } catch (err) {
      setModalMessage("Failed to delete order.");
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
                Manage Orders
              </h2>
              <p
                className="text-muted"
                style={{ fontSize: "14px", color: "#6c757d" }}
              >
                View and manage platform orders
              </p>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title">All Orders</h5>
                  <p className="card-text text-muted">
                    Manage order details and statuses
                  </p>
                </div>
                <div className="d-flex align-items-center flex-wrap flex-lg-nowrap gap-3">
                  <div className="search-container">
                    <FaSearch
                      size={16}
                      className="search-icon"
                      style={{ color: "#28a745" }}
                    />
                    <input
                      type="text"
                      className="form-control search-input"
                      placeholder="Search orders..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      aria-label="Search orders"
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
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="in transit">In Transit</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
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
                        setDateFilter({ startDate: e.target.value })
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
                        Order ID
                      </th>
                      <th
                        style={{
                          fontSize: "14px",
                          color: "#6c757d",
                          fontWeight: "normal",
                        }}
                      >
                        Products
                      </th>
                      <th
                        style={{
                          fontSize: "14px",
                          color: "#6c757d",
                          fontWeight: "normal",
                        }}
                      >
                        Total Price
                      </th>
                      <th
                        style={{
                          fontSize: "14px",
                          color: "#6c757d",
                          fontWeight: "normal",
                        }}
                      >
                        Buyer Name
                      </th>
                      <th
                        style={{
                          fontSize: "14px",
                          color: "#6c757d",
                          fontWeight: "normal",
                        }}
                      >
                        Farmer Name
                      </th>
                      <th
                        style={{
                          fontSize: "14px",
                          color: "#6c757d",
                          fontWeight: "normal",
                        }}
                      >
                        Order Date
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
                    {filteredOrders.length > 0 ? (
                      filteredOrders
                        .sort(
                          (a, b) =>
                            new Date(b.orderDate) - new Date(a.orderDate)
                        )
                        .map((order, index) => (
                          /* UNIQUE KEY */
                          <tr key={`${order.id}-${index}`}>
                            <td style={{ fontSize: "14px", color: "#212529" }}>
                              {index + 1}
                            </td>
                            <td style={{ fontSize: "14px", color: "#212529" }}>
                              {order.id}
                            </td>
                            <td style={{ fontSize: "14px", color: "#212529" }}>
                              <div style={{ fontWeight: "bold" }}>
                                {order.products}
                              </div>
                            </td>
                            <td style={{ fontSize: "14px", color: "#212529" }}>
                              ${order.totalPrice.toFixed(2)}
                            </td>
                            <td style={{ fontSize: "14px", color: "#212529" }}>
                              {order.buyerName}
                            </td>
                            <td style={{ fontSize: "14px", color: "#212529" }}>
                              {order.farmerName}
                            </td>
                            <td style={{ fontSize: "14px", color: "#212529" }}>
                              {order.orderDate}
                            </td>
                            <td>
                              <span
                                className={`badge ${
                                  order.status === "delivered"
                                    ? "bg-success"
                                    : order.status === "in transit"
                                    ? "bg-primary"
                                    : order.status === "pending"
                                    ? "bg-warning"
                                    : order.status === "processing"
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
                                {order.status}
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
                                  setSelectedOrder(order);
                                  setShowDetailsModal(true);
                                }}
                              >
                                ...
                              </button>
                            </td>
                          </tr>
                        ))
                    ) : (
                      <tr>
                        <td
                          colSpan="9"
                          className="text-center"
                          style={{ fontSize: "14px", color: "#212529" }}
                        >
                          No orders found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Details Modal */}
          {showDetailsModal && (
            <OrderDetailModal
              order={selectedOrder}
              onClose={() => setShowDetailsModal(false)}
              onEdit={() => {
                setEditFormData({
                  totalPrice: selectedOrder.totalPrice,
                  status: selectedOrder.status,
                });
                setShowDetailsModal(false);
                setShowEditModal(true);
              }}
              onDelete={() => {
                setShowDetailsModal(false);
                setShowDeleteModal(true);
              }}
              onStatusChange={handleStatusChange}
            />
          )}

          {/* Edit Modal */}
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
                      Edit Order: {selectedOrder.id}
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
                          Products
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={selectedOrder.products}
                          disabled
                          style={{
                            fontSize: "14px",
                            color: "#495057",
                            borderColor: "#ced4da",
                            padding: "6px 12px",
                            borderRadius: "4px",
                          }}
                        />
                      </div>
                      <div className="mb-3">
                        <label
                          className="form-label"
                          style={{ fontSize: "14px", color: "#6c757d" }}
                        >
                          Total Price
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={editFormData.totalPrice}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              totalPrice: e.target.value,
                            })
                          }
                          style={{
                            fontSize: "14px",
                            color: "#495057",
                            borderColor: "#ced4da",
                            padding: "6px 12px",
                            borderRadius: "4px",
                          }}
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
                          value={editFormData.status}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              status: e.target.value,
                            })
                          }
                          style={{
                            fontSize: "14px",
                            color: "#495057",
                            borderColor: "#ced4da",
                            padding: "6px 12px",
                            borderRadius: "4px",
                          }}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="in transit">In Transit</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
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

          {/* Delete Modal */}
          {showDeleteModal && (
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
                      Confirm Delete
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                      }}
                      onClick={() => setShowDeleteModal(false)}
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
                    <p>
                      <strong style={{ color: "#6c757d" }}>
                        Are you sure you want to delete this order?
                      </strong>
                    </p>
                    <p>
                      <strong style={{ color: "#6c757d" }}>ID:</strong>{" "}
                      {selectedOrder.id}
                    </p>
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
                      className="btn btn-danger"
                      style={{
                        fontSize: "14px",
                        padding: "6px 12px",
                        borderRadius: "4px",
                      }}
                      onClick={handleDeleteConfirm}
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
                      onClick={() => setShowDeleteModal(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Success/Error Modal */}
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

export default ManageOrders;
