import React, { useState, useEffect } from "react";
import "../Css/Devices.css"; // Import Devices.css for ms-md-250
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Search, Filter, MoreHorizontal } from "lucide-react";

// Mock data for the delivery table
const mockDeliveries = [
  {
    id: "DEL-001",
    product: "Organic Teff",
    quantity: "500 kg",
    farmer: "Abebe Kebede",
    buyer: "Addis Grocery",
    requestDate: "2023-05-15",
    deliveryDate: "2023-05-20",
    status: "Pending",
  },
  {
    id: "DEL-002",
    product: "Coffee Beans",
    quantity: "200 kg",
    farmer: "Tigist Haile",
    buyer: "Buna Exports",
    requestDate: "2023-05-16",
    deliveryDate: "2023-05-22",
    status: "Accepted",
  },
  {
    id: "DEL-003",
    product: "Wheat",
    quantity: "1000 kg",
    farmer: "Dawit Mengistu",
    buyer: "Sheger Bakery",
    requestDate: "2023-05-14",
    deliveryDate: "2023-05-19",
    status: "Shipped",
  },
  {
    id: "DEL-004",
    product: "Honey",
    quantity: "50 kg",
    farmer: "Solomon Tadesse",
    buyer: "Organic Market",
    requestDate: "2023-05-10",
    deliveryDate: "2023-05-15",
    status: "Delivered",
  },
  {
    id: "DEL-005",
    product: "Sesame Seeds",
    quantity: "300 kg",
    farmer: "Hiwot Alemu",
    buyer: "Export Company",
    requestDate: "2023-05-17",
    deliveryDate: "2023-05-23",
    status: "Rejected",
  },
  {
    id: "DEL-006",
    product: "Barley",
    quantity: "400 kg",
    farmer: "Kebede Tadesse",
    buyer: "Local Brewery",
    requestDate: "2023-05-18",
    deliveryDate: "2023-05-25",
    status: "Pending",
  },
  {
    id: "DEL-007",
    product: "Maize",
    quantity: "750 kg",
    farmer: "Tigist Mekonnen",
    buyer: "Food Processors Inc.",
    requestDate: "2023-05-19",
    deliveryDate: "2023-05-24",
    status: "Accepted",
  },
];

// Map status to a Tailwind CSS color for the badge
const statusColors = {
  Pending: "bg-yellow-100 text-yellow-800",
  Accepted: "bg-blue-100 text-blue-800",
  Shipped: "bg-purple-100 text-purple-800",
  Delivered: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800",
};

/**
 * Main Delivery Management page component.
 */
const DeliveryManagement = () => {
  // State for all deliveries
  const [deliveries, setDeliveries] = useState(mockDeliveries);
  // State for the filtered list of deliveries to display
  const [filteredDeliveries, setFilteredDeliveries] = useState(mockDeliveries);
  // State for search input value
  const [searchQuery, setSearchQuery] = useState("");
  // State for status filter dropdown value
  const [statusFilter, setStatusFilter] = useState("All Status");
  // State for modal visibility and selected delivery
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [editedDeliveryDate, setEditedDeliveryDate] = useState("");
  const [editedStatus, setEditedStatus] = useState("");

  // useEffect hook to handle filtering whenever the search query or status filter changes
  useEffect(() => {
    let filtered = deliveries;

    // Filter by status first
    if (statusFilter !== "All Status") {
      filtered = filtered.filter(
        (delivery) => delivery.status === statusFilter
      );
    }

    // Then filter by search query
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (delivery) =>
          delivery.id.toLowerCase().includes(lowercasedQuery) ||
          delivery.product.toLowerCase().includes(lowercasedQuery) ||
          delivery.farmer.toLowerCase().includes(lowercasedQuery) ||
          delivery.buyer.toLowerCase().includes(lowercasedQuery)
      );
    }

    setFilteredDeliveries(filtered);
  }, [searchQuery, statusFilter, deliveries]);

  // Handle modal open with selected delivery data
  const handleOpenModal = (delivery) => {
    setSelectedDelivery(delivery);
    setEditedDeliveryDate(delivery.deliveryDate);
    setEditedStatus(delivery.status);
    setIsModalOpen(true);
  };

  // Handle save changes
  const handleSaveChanges = () => {
    if (selectedDelivery) {
      setDeliveries(
        deliveries.map((delivery) =>
          delivery.id === selectedDelivery.id
            ? {
                ...delivery,
                deliveryDate: editedDeliveryDate,
                status: editedStatus,
              }
            : delivery
        )
      );
      setIsModalOpen(false);
    }
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
                <div className="d-flex gap-3 align-items-center">
                  <div className="row">
                    <div className="col-12 col-md-3 mb-2 mb-md-0">
                      <div
                        className="search-container"
                        style={{ paddingRight: "10px" }} // Add padding to prevent overlap
                      >
                        <Search size={20} className="search-icon" />
                        <input
                          type="text"
                          className="form-control search-input"
                          placeholder="Search deliveries..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          aria-label="Search deliveries"
                        />
                      </div>
                    </div>
                    <div className="col-12 col-md-3">
                      <div
                        className="filter-container"
                        style={{ paddingRight: "10px" }} // Add padding to prevent overlap
                      >
                        <Filter size={20} className="filter-icon" />
                        <select
                          className="form-select filter-select"
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          aria-label="Filter by status"
                        >
                          <option value="All Status">All Status</option>
                          <option value="Pending">Pending</option>
                          <option value="Accepted">Accepted</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Rejected">Rejected</option>
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
                        ID
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
                      filteredDeliveries.map((delivery) => (
                        <tr
                          key={delivery.id}
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
                              {delivery.id}
                            </div>
                          </td>
                          <td
                            style={{
                              fontSize: "14px",
                              color: "#212529",
                              padding: "12px",
                            }}
                          >
                            {delivery.product}
                          </td>
                          <td
                            style={{
                              fontSize: "14px",
                              color: "#212529",
                              padding: "12px",
                            }}
                          >
                            {delivery.quantity}
                          </td>
                          <td
                            style={{
                              fontSize: "14px",
                              color: "#212529",
                              padding: "12px",
                            }}
                          >
                            {delivery.farmer}
                          </td>
                          <td
                            style={{
                              fontSize: "14px",
                              color: "#212529",
                              padding: "12px",
                            }}
                          >
                            {delivery.buyer}
                          </td>
                          <td
                            style={{
                              fontSize: "12px",
                              color: "#212529",
                              padding: "12px",
                            }}
                          >
                            {delivery.requestDate}
                          </td>
                          <td
                            style={{
                              fontSize: "12px",
                              color: "#212529",
                              padding: "12px",
                            }}
                          >
                            {delivery.deliveryDate}
                          </td>
                          <td style={{ padding: "12px" }}>
                            <span
                              className={`badge ${
                                delivery.status === "Pending"
                                  ? "bg-warning"
                                  : delivery.status === "Accepted"
                                  ? "bg-primary"
                                  : delivery.status === "Shipped"
                                  ? "bg-info"
                                  : delivery.status === "Delivered"
                                  ? "bg-success"
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
                              onClick={() => handleOpenModal(delivery)}
                            >
                              ⋮
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
                          No deliveries found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Detail Modal */}
          {isModalOpen && selectedDelivery && (
            <div
              className="modal show d-block"
              tabIndex="-1"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            >
              <div className="modal-dialog modal-dialog-centered">
                <div
                  className="modal-content"
                  style={{ backgroundColor: "#fff", borderRadius: "8px" }}
                >
                  <div className="modal-header">
                    <h5
                      className="modal-title"
                      style={{ fontSize: "18px", color: "#1a2e5a" }}
                    >
                      Delivery Details - {selectedDelivery.id}
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setIsModalOpen(false)}
                      style={{ fontSize: "1.5rem" }}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label style={{ fontSize: "14px", color: "#212529" }}>
                        Product
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={selectedDelivery.product}
                        readOnly
                        style={{
                          fontSize: "14px",
                          padding: "6px",
                          backgroundColor: "#e9ecef",
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <label style={{ fontSize: "14px", color: "#212529" }}>
                        Quantity
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={selectedDelivery.quantity}
                        readOnly
                        style={{
                          fontSize: "14px",
                          padding: "6px",
                          backgroundColor: "#e9ecef",
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <label style={{ fontSize: "14px", color: "#212529" }}>
                        Farmer
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={selectedDelivery.farmer}
                        readOnly
                        style={{
                          fontSize: "14px",
                          padding: "6px",
                          backgroundColor: "#e9ecef",
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <label style={{ fontSize: "14px", color: "#212529" }}>
                        Buyer
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={selectedDelivery.buyer}
                        readOnly
                        style={{
                          fontSize: "14px",
                          padding: "6px",
                          backgroundColor: "#e9ecef",
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <label style={{ fontSize: "14px", color: "#212529" }}>
                        Request Date
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={selectedDelivery.requestDate}
                        readOnly
                        style={{
                          fontSize: "14px",
                          padding: "6px",
                          backgroundColor: "#e9ecef",
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <label
                        htmlFor="deliveryDate"
                        style={{ fontSize: "14px", color: "#212529" }}
                      >
                        Delivery Date
                      </label>
                      <input
                        type="date"
                        id="deliveryDate"
                        className="form-control"
                        value={editedDeliveryDate}
                        onChange={(e) => setEditedDeliveryDate(e.target.value)}
                        style={{ fontSize: "14px", padding: "6px" }}
                      />
                    </div>
                    <div className="mb-3">
                      <label
                        htmlFor="status"
                        style={{ fontSize: "14px", color: "#212529" }}
                      >
                        Status
                      </label>
                      <select
                        id="status"
                        className="form-select"
                        value={editedStatus}
                        onChange={(e) => setEditedStatus(e.target.value)}
                        style={{ fontSize: "14px", padding: "6px" }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleSaveChanges}
                      style={{ fontSize: "14px", padding: "6px 12px" }}
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setIsModalOpen(false)}
                      style={{ fontSize: "14px", padding: "6px 12px" }}
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
    </>
  );
};

export default DeliveryManagement;
