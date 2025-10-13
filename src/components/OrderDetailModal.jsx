import React from "react";

const OrderDetailModal = ({
  order,
  onClose,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  if (!order) return null;

  const getPaymentStatusStyle = () => {
    switch (order.paymentStatus || "Pending") {
      case "Paid":
        return {
          color: "#28a745",
          backgroundColor: "#e6ffe6",
          padding: "2px 6px",
          borderRadius: "4px",
        };
      case "Pending":
        return {
          color: "#ffc107",
          backgroundColor: "#fff3cd",
          padding: "2px 6px",
          borderRadius: "4px",
        };
      case "Failed":
      default:
        return {
          color: "#dc3545",
          backgroundColor: "#f8d7da",
          padding: "2px 6px",
          borderRadius: "4px",
        };
    }
  };

  return (
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
            style={{
              borderBottom: "none",
              padding: "15px",
              justifyContent: "space-between",
            }}
          >
            <h5
              className="modal-title"
              style={{ fontSize: "18px", color: "#1a2e5a", fontWeight: "600" }}
            >
              Order Details: {order.productName}
            </h5>
            <span
              style={{
                fontSize: "12px",
                padding: "4px 8px",
                borderRadius: "12px",
                color:
                  order.status === "cancelled" || order.status === "pending"
                    ? "#fff"
                    : "#28a745",
                backgroundColor:
                  order.status === "cancelled"
                    ? "#dc3545"
                    : order.status === "pending"
                    ? "#ffc107"
                    : order.status === "in transit"
                    ? "#007bff"
                    : order.status === "processing"
                    ? "#17a2b8"
                    : "#e6ffe6",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              {order.status}
              <button
                type="button"
                className="btn-close"
                style={{
                  fontSize: "12px",
                  width: "12px",
                  height: "12px",
                  padding: "0",
                  margin: "0",
                  lineHeight: "12px",
                }}
                onClick={onClose}
              ></button>
            </span>
          </div>
          <div
            className="modal-body"
            style={{ padding: "15px", fontSize: "14px", color: "#495057" }}
          >
            <p>
              <strong style={{ color: "#6c757d" }}>
                Detailed information about the order
              </strong>
            </p>
            <p>
              <strong style={{ color: "#6c757d" }}>Order ID:</strong> {order.id}
            </p>
            <p>
              <strong style={{ color: "#6c757d" }}>Product:</strong>{" "}
              {order.productName}
            </p>
            <p>
              <strong style={{ color: "#6c757d" }}>Quantity:</strong>{" "}
              {order.quantity}
            </p>
            <p>
              <strong style={{ color: "#6c757d" }}>Total Price:</strong> $
              {order.totalPrice.toFixed(2)}
            </p>
            <p>
              <strong style={{ color: "#6c757d" }}>Buyer Name:</strong>{" "}
              {order.buyerName}
            </p>
            <p>
              <strong style={{ color: "#6c757d" }}>Farmer Name:</strong>{" "}
              {order.farmerName}
            </p>
            <p>
              <strong style={{ color: "#6c757d" }}>Order Date:</strong>{" "}
              {order.orderDate}
            </p>
            <p>
              <strong style={{ color: "#6c757d" }}>Payment Status:</strong>{" "}
              <span style={getPaymentStatusStyle()}>
                {order.paymentStatus || "Pending"}
              </span>
            </p>
            <p>
              <strong style={{ color: "#6c757d" }}>Status Changed Date:</strong>{" "}
              {order.updatedAt || "Not updated yet"} {/* Display updatedAt */}
            </p>
          </div>
          <div
            className="modal-footer"
            style={{
              borderTop: "none",
              padding: "15px",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            <div>
              <label
                style={{
                  fontSize: "14px",
                  color: "#495057",
                  marginRight: "10px",
                }}
              >
                Status:
              </label>
              <select
                className="form-select"
                style={{
                  width: "150px",
                  fontSize: "14px",
                  color: "#495057",
                  borderColor: "#ced4da",
                  padding: "4px 8px",
                  display: "inline-block",
                  borderRadius: "4px",
                }}
                value={order.status}
                onChange={(e) => onStatusChange(e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="in transit">In Transit</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div style={{ display: "flex", gap: "15px" }}>
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
                className="btn btn-danger"
                style={{
                  fontSize: "14px",
                  padding: "6px 12px",
                  borderRadius: "4px",
                }}
                onClick={onDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
