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

  // Fetch pending deliveries from the backend
  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/admin/deliveries/pending",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDeliveries(response.data.deliveries);
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

  // Handle accepting or rejecting a delivery
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
      // Re-fetch the list to show the updated data
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
      <div className="card shadow-sm border-0 text-center py-4">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card shadow-sm border-0 text-center py-4 text-danger">
        {error}
      </div>
    );
  }

  return (
    <>
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <h5 className="card-title">Pending Delivery Approvals</h5>
          {deliveries.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-borderless align-middle mb-0">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Product</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveries.map((delivery) => (
                    <tr key={delivery.id}>
                      <td>{delivery.id}</td>
                      <td>{delivery.product}</td>
                      <td>
                        <span className="badge bg-warning text-dark">
                          {delivery.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleReviewClick(delivery)}
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted text-center mt-3">
              No pending deliveries found.
            </p>
          )}
        </div>
      </div>

      {/* Review Modal */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Review Delivery</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDelivery && (
            <div className="modal-body-content">
              <h5>Delivery Details</h5>
              <p>
                <strong>ID:</strong> {selectedDelivery.id}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span className="badge bg-warning text-dark">
                  {selectedDelivery.status}
                </span>
              </p>
              <hr />
              <h5>Order Information</h5>
              <p>
                <strong>Order Date:</strong>{" "}
                {new Date(selectedDelivery.orderDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Product(s):</strong> {selectedDelivery.product}
              </p>
              <p>
                <strong>Buyer:</strong> {selectedDelivery.buyerName}
              </p>
              <p>
                <strong>Delivery Address:</strong>{" "}
                {selectedDelivery.deliveryAddress}
              </p>
              <hr />
              <h5>Farmer Information</h5>
              <p>
                <strong>Farmer:</strong> {selectedDelivery.farmerName}
              </p>
              <p>
                <strong>Farm Name:</strong> {selectedDelivery.farmName}
              </p>
              <p>
                <strong>Farm Location:</strong> {selectedDelivery.farmLocation}
              </p>
              <hr />
              <p>Please review the details above and take an action.</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => handleDecision(false)}>
            Reject
          </Button>
          <Button variant="success" onClick={() => handleDecision(true)}>
            Accept
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Stylish Confirmation Modal */}
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
