import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const TipsModal = ({ isOpen, onClose, onSave, initialTip }) => {
  const [tip, setTip] = useState({
    type: initialTip?.type || "",
    title: initialTip?.title || "",
    description: initialTip?.description || "",
    productName: initialTip?.productName || "",
    price: initialTip?.price?.replace(/ ETB\/.*/, "") || "", // Strip unit for editing
    unit: initialTip?.unit || "",
  });

  const categories = [
    { value: "farmingTips", label: "Farming Tips" },
    { value: "alert", label: "Alert" },
    { value: "resources", label: "Resources" },
    { value: "market updates", label: "Market Updates" },
  ];

  const isMarketUpdate = tip.type === "market updates";

  useEffect(() => {
    setTip({
      type: initialTip?.type || "",
      title: initialTip?.title || "",
      description: initialTip?.description || "",
      productName: initialTip?.productName || "",
      price: initialTip?.price?.replace(/ ETB\/.*/, "") || "",
      unit: initialTip?.unit || "",
    });
  }, [initialTip]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTip((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isMarketUpdate && (!tip.productName || !tip.price || !tip.unit)) {
      alert("Product Name, Price, and Unit are required for Market Updates.");
      return;
    }
    if (!isMarketUpdate && (!tip.title || !tip.description)) {
      alert("Title and Description are required for non-Market Updates tips.");
      return;
    }
    onSave({
      ...tip,
      price: isMarketUpdate ? parseFloat(tip.price) : tip.price, // Ensure price is a number for market updates
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title fw-bold">{initialTip ? "Tips" : ""}</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="type" className="form-label">
                  Type
                </label>
                <select
                  id="type"
                  name="type"
                  className="form-select"
                  value={tip.type}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Type</option>
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
              {!isMarketUpdate && (
                <>
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                      Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      className="form-control"
                      value={tip.title}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      className="form-control"
                      value={tip.description}
                      onChange={handleChange}
                      rows="4"
                      required
                    ></textarea>
                  </div>
                </>
              )}
              {isMarketUpdate && (
                <>
                  <div className="mb-3">
                    <label htmlFor="productName" className="form-label">
                      Product Name
                    </label>
                    <input
                      type="text"
                      id="productName"
                      name="productName"
                      className="form-control"
                      value={tip.productName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="price" className="form-label">
                      Price (ETB)
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      className="form-control"
                      value={tip.price}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="unit" className="form-label">
                      Unit
                    </label>
                    <input
                      type="text"
                      id="unit"
                      name="unit"
                      className="form-control"
                      value={tip.unit}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-success">
                {initialTip ? "Add Tip" : "Add"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TipsModal;
