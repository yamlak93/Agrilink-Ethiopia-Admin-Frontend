import React, { useState } from "react";
import "../Css/Devices.css"; // Import Devices.css for ms-md-250
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import OrderDetailModal from "../components/OrderDetailModal";
import StylishModal from "../components/StylishModal";
import { FaSearch, FaFilter } from "react-icons/fa"; // Import icons from react-icons
import "bootstrap/dist/css/bootstrap.min.css";

const ManageOrders = () => {
  const initialOrders = [
    {
      id: "ORD-001",
      productName: "Organic Coffee Beans",
      quantity: 2,
      price: "25.00",
      buyerName: "Abebe Kebede",
      farmerName: "Hailu Tadesse",
      status: "Pending",
      orderDate: "2023-01-15",
    },
    {
      id: "ORD-002",
      productName: "Teff Flour",
      quantity: 5,
      price: "15.00",
      buyerName: "Tigist Haile",
      farmerName: "Aynalem Bekele",
      status: "Shipped",
      orderDate: "2023-02-20",
    },
    {
      id: "ORD-003",
      productName: "Spice Mix",
      quantity: 3,
      price: "10.00",
      buyerName: "Addis Grocery",
      farmerName: "Zewde Asfaw",
      status: "Delivered",
      orderDate: "2023-01-10",
    },
    {
      id: "ORD-004",
      productName: "Injera Starter",
      quantity: 1,
      price: "8.00",
      buyerName: "Buna Exports",
      farmerName: "Mulugeta Alem",
      status: "Cancelled",
      orderDate: "2023-03-05",
    },
    {
      id: "ORD-005",
      productName: "Honey Jar",
      quantity: 4,
      price: "12.00",
      buyerName: "Dawit Mengistu",
      farmerName: "Selamawit Yohannes",
      status: "Pending",
      orderDate: "2023-04-12",
    },
  ];

  const [orders, setOrders] = useState(initialOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState({
    startDate: "",
  });

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStylishModal, setShowStylishModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");
  const [editFormData, setEditFormData] = useState({
    productName: "",
    quantity: "",
    price: "",
    buyerName: "",
    farmerName: "",
    status: "",
  });

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.price.includes(searchTerm);

    const matchesStatus =
      statusFilter === "All" || order.status === statusFilter;

    const startDate = dateFilter.startDate
      ? new Date(dateFilter.startDate)
      : null;
    const orderDate = new Date(order.orderDate);
    const matchesDate =
      !startDate || orderDate.toDateString() === startDate.toDateString();

    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleStatusChange = (newStatus) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === selectedOrder.id ? { ...o, status: newStatus } : o
      )
    );
    setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
  };

  const handleEditConfirm = () => {
    setShowEditModal(false);
    setModalMessage("Order details updated successfully.");
    setModalType("success");
    setShowStylishModal(true);
  };

  const handleDeleteConfirm = () => {
    setOrders((prev) => prev.filter((o) => o.id !== selectedOrder.id));
    setShowDeleteModal(false);
    setModalMessage("Order deleted successfully.");
    setModalType("success");
    setShowStylishModal(true);
  };

  return (
    <>
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
                <div className="d-flex gap-3 align-items-center">
                  <div className="row">
                    <div className="col-12 col-md-3 mb-2 mb-md-0">
                      <div
                        className="search-container"
                        style={{ paddingRight: "10px" }} // Add padding to prevent overlap
                      >
                        <FaSearch size={20} className="search-icon" />
                        <input
                          type="text"
                          className="form-control search-input"
                          placeholder="Search orders..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          aria-label="Search orders"
                        />
                      </div>
                    </div>
                    <div className="col-12 col-md-3 mb-2 mb-md-0">
                      <div
                        className="filter-container"
                        style={{ paddingRight: "10px" }} // Add padding to prevent overlap
                      >
                        <FaFilter size={20} className="filter-icon" />
                        <select
                          className="form-select filter-select"
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          aria-label="Filter by status"
                        >
                          <option value="All">All Status</option>
                          <option value="Pending">Pending</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-12 col-md-3">
                      <div
                        className="filter-container"
                        style={{ paddingRight: "10px" }} // Add padding to prevent overlap
                      >
                        <FaFilter size={20} className="filter-icon" />
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
                        Products
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
                        Price
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
                      filteredOrders.map((order) => (
                        <tr key={order.id}>
                          <td style={{ fontSize: "14px", color: "#212529" }}>
                            <div style={{ fontWeight: "bold" }}>
                              {order.productName}
                            </div>
                            <div style={{ fontSize: "12px", color: "#6c757d" }}>
                              {order.id}
                            </div>
                          </td>
                          <td style={{ fontSize: "14px", color: "#212529" }}>
                            {order.quantity}
                          </td>
                          <td style={{ fontSize: "14px", color: "#212529" }}>
                            ${order.price}
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
                                order.status === "Delivered"
                                  ? "bg-success"
                                  : order.status === "Shipped"
                                  ? "bg-primary"
                                  : order.status === "Pending"
                                  ? "bg-warning"
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
                              ⋮
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="8"
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

          {/* Show detail modal */}
          {showDetailsModal && (
            <OrderDetailModal
              order={selectedOrder}
              onClose={() => setShowDetailsModal(false)}
              onEdit={() => {
                setEditFormData({
                  productName: selectedOrder.productName,
                  quantity: selectedOrder.quantity,
                  price: selectedOrder.price,
                  buyerName: selectedOrder.buyerName,
                  farmerName: selectedOrder.farmerName,
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
                      Edit Order: {selectedOrder.productName}
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
                          }}
                          value={editFormData.productName}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              productName: e.target.value,
                            })
                          }
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
                          }}
                          value={editFormData.quantity}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              quantity: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="mb-3">
                        <label
                          className="form-label"
                          style={{ fontSize: "14px", color: "#6c757d" }}
                        >
                          Price
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
                          value={editFormData.price}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              price: e.target.value,
                            })
                          }
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
                          }}
                          value={editFormData.buyerName}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              buyerName: e.target.value,
                            })
                          }
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
                          }}
                          value={editFormData.farmerName}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              farmerName: e.target.value,
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
                          <option value="Pending">Pending</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
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
                      onClick={() => {
                        setOrders((prev) =>
                          prev.map((o) =>
                            o.id === selectedOrder.id
                              ? { ...o, ...editFormData }
                              : o
                          )
                        );
                        setShowEditModal(false);
                        setModalMessage("Order details updated successfully.");
                        setModalType("success");
                        setShowStylishModal(true);
                      }}
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
                      Confirm Delete: {selectedOrder.productName}
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
                      <strong style={{ color: "#6c757d" }}>Product:</strong>{" "}
                      {selectedOrder.productName}
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

export default ManageOrders;
