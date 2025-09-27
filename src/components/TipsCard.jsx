import React, { useState } from "react";
import {
  MoreHorizontal,
  Leaf,
  CloudRain,
  Bell,
  ShoppingBag,
  BookOpen,
  Edit2,
  Trash2,
} from "lucide-react";

const typeStyles = {
  "Farming Tips": {
    icon: <Leaf size={20} className="text-success" />,
    iconBg: "bg-light",
    textColor: "text-success",
  },
  Alert: {
    icon: <Bell size={20} className="text-danger" />,
    iconBg: "bg-light",
    textColor: "text-danger",
  },
  Resources: {
    icon: <BookOpen size={20} className="text-primary" />,
    iconBg: "bg-light",
    textColor: "text-primary",
  },
  "Market Updates": {
    icon: <ShoppingBag size={20} className="text-purple" />,
    iconBg: "bg-light",
    textColor: "text-purple",
  },
};

const TipsCard = ({ tip, onEdit, onDelete, onViewDetails }) => {
  const styles = typeStyles[tip.type] || {
    icon: <Bell size={20} />,
    iconBg: "bg-light",
    textColor: "text-secondary",
  };

  const getBadgeText = (type) => {
    if (type === "Farming Tips") return "Farming Tip";
    if (type === "Alert") return "Alert";
    if (type === "Resources") return "Resource";
    if (type === "Market Updates") return "Market Update";
    return type;
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="card h-100 border-0 shadow-sm rounded-3 position-relative">
      <div className="card-body d-flex flex-column p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div
            className={`d-inline-flex align-items-center gap-2 rounded-pill px-2 py-1 ${styles.iconBg}`}
          >
            {styles.icon}
            <span className={`fw-semibold small ${styles.textColor}`}>
              {getBadgeText(tip.type)}
            </span>
          </div>
          <div className="position-relative">
            <button
              className="btn text-secondary p-0"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <MoreHorizontal size={20} />
            </button>
            {isMenuOpen && (
              <div
                className="position-absolute end-0 mt-2 bg-white border rounded shadow-sm"
                style={{
                  zIndex: 1000,
                  minWidth: "100px",
                }}
              >
                <a
                  className="d-flex align-items-center text-decoration-none text-dark p-2"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onEdit(tip);
                    setIsMenuOpen(false);
                  }}
                >
                  <Edit2 size={16} className="me-2" /> Edit
                </a>
                <a
                  className="d-flex align-items-center text-decoration-none text-danger p-2"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onDelete(tip);
                    setIsMenuOpen(false);
                  }}
                >
                  <Trash2 size={16} className="me-2" /> Delete
                </a>
              </div>
            )}
          </div>
        </div>
        <h5 className="card-title fw-bold text-dark mb-1">{tip.title}</h5>
        <p className="card-subtitle text-muted mb-2 small">
          Posted on {tip.date}
        </p>
        <p className="card-text text-secondary mb-3">{tip.description}</p>
        <div className="mt-auto">
          <button
            className="btn btn-outline-secondary w-100"
            onClick={() => onViewDetails(tip)}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default TipsCard;
