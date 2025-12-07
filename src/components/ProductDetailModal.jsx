import React from "react";

const ProductDetailModal = ({
  product,
  onClose,
  onEdit,
  onDelete,
  onAvailabilityChange,
}) => {
  if (!product) return null;

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
              Product Details: {product.name}
            </h5>
            <span
              style={{
                fontSize: "12px",
                padding: "4px 8px",
                borderRadius: "12px",
                color:
                  product.availability === "Out of Stock" ? "#fff" : "#28a745",
                backgroundColor:
                  product.availability === "Out of Stock"
                    ? "#dc3545"
                    : "#e6ffe6",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              {product.availability}
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
            <div
              style={{
                marginBottom: "15px",
                textAlign: "center",
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              {product.image ? (
                <img
                  src={`data:image/jpeg;base64,${product.image}`} // Adjust to PNG if needed
                  alt={product.name}
                  style={{
                    width: "100%",
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: "4px",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "150px",
                    backgroundColor: "#ced4da",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#6c757d",
                  }}
                >
                  No Image Available
                </div>
              )}
            </div>
            <p>
              <strong style={{ color: "#6c757d" }}>
                Detailed information about the product
              </strong>
            </p>
            <p>
              <strong style={{ color: "#6c757d" }}>Product ID:</strong>{" "}
              {product.id}
            </p>
            <p>
              <strong style={{ color: "#6c757d" }}>Name:</strong> {product.name}
            </p>
            <p>
              <strong style={{ color: "#6c757d" }}>Description:</strong>{" "}
              {product.description}
            </p>
            <p>
              <strong style={{ color: "#6c757d" }}>Price:</strong> $
              {product.price}
            </p>
            <p>
              <strong style={{ color: "#6c757d" }}>Category:</strong>{" "}
              {product.category}
            </p>
            <p>
              <strong style={{ color: "#6c757d" }}>Stock:</strong>{" "}
              {product.stock}
              {" " + product.unit}
            </p>
            <p>
              <strong style={{ color: "#6c757d" }}>Added Date:</strong>{" "}
              {new Date(product.addedDate).toLocaleDateString()}
            </p>
          </div>
          <div
            className="modal-footer"
            style={{
              borderTop: "none",
              padding: "15px",
              justifyContent: "space-between",
              gap: "10px",
            }}
          >
            <div>
              <label
                style={{
                  fontSize: "14px",
                  color: "#495057",
                  marginRight: "10px",
                  alignSelf: "center",
                }}
              >
                Availability:
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
                value={product.availability}
                onChange={(e) => onAvailabilityChange(e.target.value)}
              >
                <option value="Available">Available</option>
                <option value="Out of Stock">Out of Stock</option>
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

export default ProductDetailModal;
