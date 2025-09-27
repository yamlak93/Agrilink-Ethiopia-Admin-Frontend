import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const StatusChangeConfirmationModal = ({
  isVisible,
  userName,
  currentStatus,
  newStatus,
  onConfirm,
  onCancel,
}) => {
  if (!isVisible) return null;

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
              style={{ fontSize: "18px", color: "#1a2e5a", fontWeight: "600" }}
            >
              Confirm Status Change: {userName}
            </h5>
            <button
              type="button"
              className="btn-close"
              style={{ position: "absolute", top: "10px", right: "10px" }}
              onClick={onCancel}
            ></button>
          </div>
          <div
            className="modal-body"
            style={{ padding: "15px", fontSize: "14px", color: "#495057" }}
          >
            <p>
              <strong style={{ color: "#6c757d" }}>
                Are you sure you want to change the status of {userName} from{" "}
                {currentStatus} to {newStatus}?
              </strong>
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
              className="btn btn-success"
              style={{ fontSize: "14px", padding: "6px 12px" }}
              onClick={onConfirm}
            >
              Confirm
            </button>
            <button
              className="btn btn-secondary"
              style={{ fontSize: "14px", padding: "6px 12px" }}
              onClick={onCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusChangeConfirmationModal;
