import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";

const StylishModal = ({ isVisible, message, type, onClose }) => {
  // Auto-close logic for success type
  useEffect(() => {
    if (isVisible && type === "success") {
      const timer = setTimeout(() => {
        onClose();
      }, 1000); // Auto-close after 1 second
      return () => clearTimeout(timer); // Cleanup timer on unmount or prop change
    }
  }, [isVisible, type, onClose]);

  if (!isVisible) {
    return null;
  }

  const isSuccess = type === "success";
  const icon = isSuccess ? faCheckCircle : faTimesCircle;
  const contentStyle = {
    borderRadius: "15px",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
    padding: "30px",
    background: isSuccess
      ? "linear-gradient(135deg, #28a745, #198754)"
      : "linear-gradient(135deg, #dc3545, #b02a37)",
  };
  const iconStyle = {
    fontSize: "4rem",
    marginBottom: "15px",
    animation: "pop-in 0.5s ease-out",
  };

  return (
    <div
      className={`modal fade ${isVisible ? "show d-block" : ""}`}
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
    >
      <style>
        {`
        @keyframes pop-in {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .btn-outline-light-hover:hover {
          color: #fff;
          background-color: rgba(255, 255, 255, 0.1);
        }
        `}
      </style>
      <div className="modal-dialog modal-dialog-centered">
        <div
          className="modal-content text-center text-white"
          style={contentStyle}
        >
          <div className="modal-header d-flex justify-content-end border-0 pb-0">
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body pt-0">
            <FontAwesomeIcon icon={icon} style={iconStyle} />
            <h4 className="fw-bold mt-3 mb-2">
              {isSuccess ? "Success!" : "Error!"}
            </h4>
            <p className="lead">{message}</p>
          </div>
          <div className="modal-footer d-flex justify-content-center border-0 pt-0">
            <button
              type="button"
              className="btn btn-outline-light btn-outline-light-hover fw-bold rounded-pill px-4"
              onClick={onClose}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StylishModal;
