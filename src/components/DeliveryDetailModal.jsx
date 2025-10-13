import React from "react";

const DeliveryDetailModal = ({ delivery, onClose, onEdit, onStatusChange }) => {
  if (!delivery) return null;

  return (
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
              Delivery Details: {delivery.id}
            </h5>
            <button
              type="button"
              className="btn-close"
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
              }}
              onClick={onClose}
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
              <strong style={{ color: "#6c757d" }}>Order ID:</strong>{" "}
              {delivery.orderId}
            </p>
            <p>
              <strong style={{ color: "#6c757d" }}>Product:</strong>{" "}
              {delivery.productName}
            </p>
            <p>
              <strong style={{ color: "#6c757d" }}>Quantity:</strong>{" "}
              {delivery.quantity} {delivery.unit}
            </p>
            <p>
              <strong style={{ color: "#6c757d" }}>Farmer:</strong>{" "}
              {delivery.farmerName}
            </p>
            <p>
              <strong style={{ color: "#6c757d" }}>Buyer:</strong>{" "}
              {delivery.buyerName}
            </p>
            <p>
              <strong style={{ color: "#6c757d" }}>Request Date:</strong>{" "}
              {delivery.requestDate}
            </p>
            <p>
              <strong style={{ color: "#6c757d" }}>Delivery Date:</strong>{" "}
              {delivery.deliveryDate || "Not set"}
            </p>
            <p>
              <strong style={{ color: "#6c757d" }}>Delivery Address:</strong>{" "}
              {delivery.deliveryAddress}
            </p>
            <p>
              <strong style={{ color: "#6c757d" }}>Farm Name:</strong>{" "}
              {delivery.farmName}
            </p>
            <p>
              <strong style={{ color: "#6c757d" }}>Farm Location:</strong>{" "}
              {delivery.farmLocation}
            </p>
            <p>
              <strong style={{ color: "#6c757d" }}>Status:</strong>{" "}
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
            </p>
            <div className="mt-3">
              <label
                className="form-label"
                style={{ fontSize: "14px", color: "#6c757d" }}
              >
                Change Status
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
                onChange={(e) => onStatusChange(e.target.value)}
                value={delivery.status}
              >
                <option value="pending">pending</option>
                <option value="accepted">accepted</option>
                <option value="in transit">in transit</option>
                <option value="delivered">delivered</option>
                <option value="rejected">rejected</option>
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
              onClick={onEdit}
            >
              Edit
            </button>
            <button
              className="btn btn-secondary"
              style={{
                fontSize: "14px",
                padding: "6px 12px",
                borderRadius: "4px",
              }}
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryDetailModal;
