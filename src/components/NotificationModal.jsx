import React from "react";
import { Modal, Button } from "react-bootstrap";
import { UserPlus, Truck, Package, DollarSign, User } from "lucide-react"; // Icons for notifications

const NotificationModal = ({ show, handleClose }) => {
  // Sample notification data with associated icons
  const notifications = [
    {
      id: 1,
      message: "New user registered: Abebe Kebede",
      time: "2025-08-22 14:30",
      icon: <UserPlus size={18} className="text-success me-2" />,
    },
    {
      id: 2,
      message: "Order #1234 has been delivered",
      time: "2025-08-22 13:45",
      icon: <Truck size={18} className="text-primary me-2" />,
    },
    {
      id: 3,
      message: "Product listing updated: Teff",
      time: "2025-08-22 12:15",
      icon: <Package size={18} className="text-warning me-2" />,
    },
    {
      id: 4,
      message: "Payment received: ETB 5000",
      time: "2025-08-22 11:20",
      icon: <DollarSign size={18} className="text-info me-2" />,
    },
    {
      id: 5,
      message: "New farmer joined: Hana Ali",
      time: "2025-08-22 10:50",
      icon: <User size={18} className="text-secondary me-2" />,
    },
  ];

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      className="fade"
      style={{ borderRadius: "15px", overflow: "hidden" }}
    >
      <Modal.Header
        style={{
          background: "linear-gradient(90deg, #2ecc71, #27ae60)",
          color: "white",
          border: "none",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Modal.Title>Notifications</Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{
          maxHeight: "450px",
          overflowY: "auto",
          backgroundColor: "#f8f9fa",
          padding: "20px",
        }}
      >
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className="card mb-3 shadow-sm"
              style={{
                border: "none",
                borderRadius: "10px",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateY(-2px)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "translateY(0)")
              }
            >
              <div className="card-body p-3 d-flex align-items-center">
                {notification.icon}
                <div>
                  <p
                    className="mb-0"
                    style={{ fontSize: "14px", fontWeight: "500" }}
                  >
                    {notification.message}
                  </p>
                  <small className="text-muted" style={{ fontSize: "12px" }}>
                    {new Date(notification.time).toLocaleString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </small>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4">
            <p className="text-muted" style={{ fontSize: "16px" }}>
              No new notifications
            </p>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer
        style={{
          backgroundColor: "#e9ecef",
          borderTop: "none",
          justifyContent: "center",
        }}
      >
        <Button
          variant="success"
          onClick={handleClose}
          style={{
            borderRadius: "20px",
            padding: "8px 20px",
            fontWeight: "500",
            background: "#2ecc71",
            border: "none",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => (e.target.style.background = "#27ae60")}
          onMouseLeave={(e) => (e.target.style.background = "#2ecc71")}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NotificationModal;
