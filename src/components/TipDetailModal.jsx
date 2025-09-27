import React from "react";
import { Leaf, Bell, BookOpen, ShoppingBag } from "lucide-react";

const TipDetailModal = ({ isOpen, onClose, tip }) => {
  if (!isOpen || !tip) return null;

  // Map tip types to their respective icons
  const getIconForType = (type) => {
    switch (type) {
      case "Farming Tips":
        return <Leaf size={24} className="text-success" />;
      case "Alert":
        return <Bell size={24} className="text-danger" />;
      case "Resources":
        return <BookOpen size={24} className="text-primary" />;
      case "Market Updates":
        return <ShoppingBag size={24} className="text-purple" />;
      default:
        return <Leaf size={24} className="text-success" />;
    }
  };

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div
          className="modal-content border-0 shadow-lg"
          style={{
            borderRadius: "12px",
            backgroundColor: "#ffffff",
            maxWidth: "500px",
          }}
        >
          <div className="modal-header border-bottom-0 p-4 d-flex align-items-center">
            {getIconForType(tip.type)}
            <h5
              className="modal-title fw-bold"
              style={{
                color: "#1a3c34",
                fontSize: "1.5rem",
                flexGrow: 1,
                marginLeft: "0.5rem",
              }}
            >
              {tip.title}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              style={{
                fontSize: "1.25rem",
                color: "#dc3545",
                backgroundColor: "transparent",
                border: "none",
                padding: "0.25rem",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => (e.target.style.color = "#a71d31")}
              onMouseOut={(e) => (e.target.style.color = "#dc3545")}
            ></button>
          </div>
          <div className="modal-body p-4">
            <div className="mb-4">
              <label className="text-muted mb-2" style={{ fontSize: "0.9rem" }}>
                Type
              </label>
              <p style={{ color: "#2c3e50", fontWeight: "500" }}>{tip.type}</p>
            </div>
            <div className="mb-4">
              <label className="text-muted mb-2" style={{ fontSize: "0.9rem" }}>
                Date
              </label>
              <p style={{ color: "#2c3e50", fontWeight: "500" }}>{tip.date}</p>
            </div>
            <div className="mb-4">
              <label className="text-muted mb-2" style={{ fontSize: "0.9rem" }}>
                Description
              </label>
              <p style={{ color: "#34495e", lineHeight: "1.6" }}>
                {tip.description}
              </p>
            </div>
            {tip.type === "Market Updates" && tip.marketDetails && (
              <>
                <div className="mb-4">
                  <label
                    className="text-muted mb-2"
                    style={{ fontSize: "0.9rem" }}
                  >
                    Product Name
                  </label>
                  <p style={{ color: "#2c3e50", fontWeight: "500" }}>
                    {tip.marketDetails.productName}
                  </p>
                </div>
                <div className="mb-4">
                  <label
                    className="text-muted mb-2"
                    style={{ fontSize: "0.9rem" }}
                  >
                    Price
                  </label>
                  <p style={{ color: "#2c3e50", fontWeight: "500" }}>
                    {tip.marketDetails.price}
                  </p>
                </div>
                <div className="mb-4">
                  <label
                    className="text-muted mb-2"
                    style={{ fontSize: "0.9rem" }}
                  >
                    Trend
                  </label>
                  <p style={{ color: "#2c3e50", fontWeight: "500" }}>
                    {tip.marketDetails.trend}
                  </p>
                </div>
              </>
            )}
          </div>
          <div className="modal-footer border-top-0 p-4">
            <button
              className="btn btn-outline-danger w-100"
              style={{
                borderRadius: "8px",
                fontWeight: "500",
                transition: "all 0.3s ease",
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

export default TipDetailModal;
