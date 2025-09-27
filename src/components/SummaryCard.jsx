import React from "react";

const SummaryCard = ({ title, value, subtitle, icon }) => {
  return (
    <div className="col-md-3 mb-3">
      <div className="card shadow-sm border-0 h-100">
        <div className="card-body d-flex justify-content-between align-items-center">
          <div>
            <h6 className="text-muted">{title}</h6>
            <h4 className="fw-bold mb-0">{value}</h4>
            <small className="text-success">{subtitle}</small>
          </div>
          <div className="fs-3 text-success">{icon}</div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
