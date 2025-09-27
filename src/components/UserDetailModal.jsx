import React from "react";

const UserDetailModal = ({
  user,
  onClose,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  if (!user) return null;

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
              User Details: {user.name}
            </h5>
            <span
              style={{
                fontSize: "12px",
                padding: "4px 8px",
                borderRadius: "12px",
                color: user.status === "Blocked" ? "#fff" : "#28a745",
                backgroundColor:
                  user.status === "Blocked" ? "#dc3545" : "#e6ffe6",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              {user.status}
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
                Detailed information about the user
              </strong>
            </p>
            <p>
              <strong style={{ color: "#6c757d" }}>User ID:</strong> {user.id}
            </p>
            <p>
              <strong style={{ color: "#6c757d" }}>Full Name:</strong>{" "}
              {user.name}
            </p>
            <p>
              <strong style={{ color: "#6c757d" }}>Email:</strong> {user.email}
            </p>
            <p>
              <strong style={{ color: "#6c757d" }}>Phone:</strong> {user.phone}
            </p>
            <p>
              <strong style={{ color: "#6c757d" }}>Role:</strong> {user.role}
            </p>
            <p>
              <strong style={{ color: "#6c757d" }}>Address:</strong>{" "}
              {user.region}
            </p>
            <p>
              <strong style={{ color: "#6c757d" }}>Join Date:</strong>{" "}
              {user.joinDate}
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
                }}
                value={user.status}
                onChange={(e) => onStatusChange(e.target.value)}
              >
                <option value="Active">Active</option>
                <option value="Blocked">Blocked</option>
              </select>
            </div>
            <div style={{ display: "flex", gap: "15px" }}>
              <button
                className="btn btn-primary"
                style={{ fontSize: "14px", padding: "6px 12px" }}
                onClick={onEdit}
              >
                Edit
              </button>
              <button
                className="btn btn-danger"
                style={{ fontSize: "14px", padding: "6px 12px" }}
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

export default UserDetailModal;
