import React, { useState, useEffect } from "react";

const TipsModal = ({ isOpen, onClose, onSave, initialTip }) => {
  const [tipData, setTipData] = useState(initialTip);

  useEffect(() => {
    setTipData(initialTip);
  }, [initialTip]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTipData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleMarketChange = (e) => {
    const { name, value } = e.target;
    setTipData((prevData) => ({
      ...prevData,
      marketDetails: { ...prevData.marketDetails, [name]: value },
    }));
  };

  const handleSave = () => {
    onSave(tipData);
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
            <h5 className="modal-title fw-bold">Create New Tip</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <form>
              <div className="mb-3">
                <label className="form-label">Type</label>
                <select
                  className="form-select"
                  name="type"
                  value={tipData.type}
                  onChange={handleChange}
                >
                  <option value="">Select Type</option>
                  <option value="Farming Tips">Farming Tips</option>
                  <option value="Alert">Alert</option>
                  <option value="Resources">Resources</option>
                  <option value="Market Updates">Market Updates</option>
                </select>
              </div>
              {tipData.type === "Market Updates" ? (
                <>
                  <div className="mb-3">
                    <label className="form-label">Product Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="productName"
                      value={tipData.marketDetails?.productName || ""}
                      onChange={handleMarketChange}
                      placeholder="Enter product name..."
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Price</label>
                    <input
                      type="number"
                      className="form-control"
                      name="price"
                      value={tipData.marketDetails?.price || ""}
                      onChange={handleMarketChange}
                      placeholder="Enter price..."
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Trend</label>
                    <select
                      className="form-select"
                      name="trend"
                      value={tipData.marketDetails?.trend || ""}
                      onChange={handleMarketChange}
                    >
                      <option value="">Select Trend</option>
                      <option value="Stable">Stable</option>
                      <option value="Falling">Falling</option>
                      <option value="Rising">Rising</option>
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      name="title"
                      value={tipData.title}
                      onChange={handleChange}
                      placeholder="Enter tip title..."
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      name="description"
                      rows="4"
                      value={tipData.description}
                      onChange={handleChange}
                      placeholder="Enter tip description..."
                    />
                  </div>
                </>
              )}
            </form>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              className="btn btn-success"
              onClick={handleSave}
              disabled={
                tipData.type === "Market Updates"
                  ? !tipData.type ||
                    !tipData.marketDetails?.productName ||
                    !tipData.marketDetails?.price ||
                    !tipData.marketDetails?.trend
                  : !tipData.type || !tipData.title || !tipData.description
              }
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TipsModal;
