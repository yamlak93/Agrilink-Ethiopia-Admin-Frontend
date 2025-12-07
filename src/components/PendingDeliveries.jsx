import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import StylishModal from "./StylishModal";

const PendingDeliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [showStylishModal, setShowStylishModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("success");

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/admin/deliveries/pending",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const sorted = response.data.deliveries
        .sort(
          (a, b) =>
            new Date(b.createdAt || b.orderDate) -
            new Date(a.createdAt || a.orderDate)
        )
        .slice(0, 5);

      setDeliveries(sorted);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch pending deliveries:", err);
      setError("Failed to load pending deliveries. Check server or token.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const handleReviewClick = (delivery) => {
    setSelectedDelivery(delivery);
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  const handleDecision = async (accepted) => {
    setShowModal(false);
    const newStatus = accepted ? "Accepted" : "Rejected";
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/admin/deliveries/${selectedDelivery.id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatusType("success");
      setStatusMessage(
        `Delivery ${selectedDelivery.id} status updated to '${newStatus}'.`
      );
      setShowStylishModal(true);
      fetchDeliveries();
    } catch (err) {
      setStatusType("danger");
      setStatusMessage("Failed to update delivery status.");
      setShowStylishModal(true);
      console.error("Error updating delivery status:", err);
    }
  };

  if (loading) {
    return (
      <div className="card shadow-sm border-0 text-center py-5">
        <div
          className="spinner-border text-success"
          style={{ width: "3rem", height: "3rem" }}
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card shadow-sm border-0 text-center py-5 text-danger">
        <i className="bi bi-exclamation-triangle-fill fs-1 mb-3"></i>
        <p className="fw-semibold">{error}</p>
      </div>
    );
  }

  return (
    <>
      {/* ===== CARD ===== */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="card-header bg-success text-white py-3">
          <h5 className="mb-0 d-flex align-items-center">
            <i className="bi bi-truck me-2"></i>
            Pending Delivery Approvals
            <span className="badge bg-light text-success ms-2">
              {deliveries.length}
            </span>
          </h5>
        </div>

        <div className="card-body p-0">
          {deliveries.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="ps-4">ID</th>
                    <th>Product</th>
                    <th>Status</th>
                    <th className="text-end pe-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveries.map((delivery, index) => (
                    <tr
                      key={`${delivery.id}-${index}`}
                      className="align-middle"
                    >
                      <td className="ps-4 fw-medium text-success">
                        {delivery.id}
                      </td>
                      <td className="text-dark">{delivery.product}</td>
                      <td>
                        <span className="badge bg-warning text-dark px-3 py-2 rounded-pill">
                          {delivery.status}
                        </span>
                      </td>
                      <td className="text-end pe-4">
                        <button
                          className="btn btn-sm btn-outline-success rounded-pill px-3"
                          onClick={() => handleReviewClick(delivery)}
                        >
                          <i className="bi bi-eye me-1"></i> Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-check-circle fs-1 mb-3 text-success"></i>
              <p className="mb-0">No pending deliveries found.</p>
            </div>
          )}
        </div>
      </div>

      {/* ===== REVIEW MODAL ===== */}
      <Modal
        show={showModal}
        onHide={handleClose}
        centered
        size="lg"
        backdrop="static"
      >
        <Modal.Header closeButton className="bg-light border-0">
          <Modal.Title className="text-success">
            <i className="bi bi-file-check me-2"></i> Review Delivery
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {selectedDelivery && (
            <div className="row g-4">
              {/* Delivery Details */}
              <div className="col-md-6">
                <h6 className="text-success mb-3">
                  <i className="bi bi-box-seam me-2"></i> Delivery Details
                </h6>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <strong>ID:</strong>{" "}
                    <code className="text-success">{selectedDelivery.id}</code>
                  </li>
                  <li className="mb-2">
                    <strong>Status:</strong>{" "}
                    <span className="badge bg-warning text-dark px-3 py-1 rounded-pill">
                      {selectedDelivery.status}
                    </span>
                  </li>
                </ul>
              </div>

              {/* Order Info */}
              <div className="col-md-6">
                <h6 className="text-success mb-3">
                  <i className="bi bi-cart-check me-2"></i> Order Information
                </h6>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <strong>Date:</strong>{" "}
                    {new Date(selectedDelivery.orderDate).toLocaleDateString()}
                  </li>
                  <li className="mb-2">
                    <strong>Product(s):</strong> {selectedDelivery.product}
                  </li>
                  <li className="mb-2">
                    <strong>Buyer:</strong> {selectedDelivery.buyerName}
                  </li>
                  <li className="mb-2">
                    <strong>Address:</strong> {selectedDelivery.deliveryAddress}
                  </li>
                </ul>
              </div>

              {/* Farmer Info */}
              <div className="col-12">
                <hr className="my-4" />
                <h6 className="text-success mb-3">
                  <i className="bi bi-person-badge me-2"></i> Farmer Information
                </h6>
                <ul className="list-unstyled d-flex flex-wrap gap-4">
                  <li>
                    <strong>Farmer:</strong> {selectedDelivery.farmerName}
                  </li>

                  <li>
                    <strong>Farm Location:</strong>{" "}
                    {selectedDelivery.farmLocation}
                  </li>
                </ul>
              </div>

              <div className="col-12 text-center mt-4">
                <p className="text-muted">
                  Please review the details above and take an action.
                </p>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="bg-light border-0 justify-content-center gap-3">
          <Button
            variant="outline-danger"
            size="lg"
            className="px-4"
            onClick={() => handleDecision(false)}
          >
            <i className="bi bi-x-circle me-2"></i> Reject
          </Button>
          <Button
            variant="success"
            size="lg"
            className="px-4"
            onClick={() => handleDecision(true)}
          >
            <i className="bi bi-check-circle me-2"></i> Accept
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ===== SUCCESS / ERROR MODAL ===== */}
      <StylishModal
        isVisible={showStylishModal}
        message={statusMessage}
        type={statusType}
        onClose={() => setShowStylishModal(false)}
      />
    </>
  );
};

export default PendingDeliveries;
