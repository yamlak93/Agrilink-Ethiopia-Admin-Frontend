import React from "react";
import { Modal, Button } from "react-bootstrap";
import {
  User,
  ShoppingBag,
  Package,
  Truck,
  DollarSign,
  Mail,
  MailOpen,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/api";

const NotificationModal = ({
  show,
  handleClose,
  notifications,
  setNotifications,
  setUnreadNotifications,
  fetchNotifications,
}) => {
  const navigate = useNavigate();

  const getNotificationDetails = (type) => {
    const types = {
      newFarmer: {
        icon: <User size={18} className="text-secondary me-2" />,
        color: "text-secondary",
        redirect: "/admin/manage-users",
      },
      newBuyer: {
        icon: <ShoppingBag size={18} className="text-info me-2" />,
        color: "text-info",
        redirect: "/admin/manage-users",
      },
      newOrder: {
        icon: <Package size={18} className="text-warning me-2" />,
        color: "text-warning",
        redirect: "/admin/manage-orders",
      },
      completedDelivery: {
        icon: <Truck size={18} className="text-primary me-2" />,
        color: "text-primary",
        redirect: "/admin/manage-deliveries",
      },
      newPayment: {
        icon: <DollarSign size={18} className="text-success me-2" />,
        color: "text-success",
        redirect: "/admin/payments",
      },
    };
    return (
      types[type] || { icon: null, color: "", redirect: "/admin/dashboard" }
    );
  };

  const handleNotificationClick = async (id, redirect) => {
    try {
      await apiClient.patch(`/notifications/${id}/read`);
      // Update local state
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadNotifications((prev) => prev - 1);
      console.log(`✅ Notification ${id} marked as read`);
    } catch (error) {
      console.error("Error marking as read:", error);
    } finally {
      handleClose();
      navigate(redirect);
      fetchNotifications(); // Refresh list
    }
  };

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
        <Modal.Title>Admin Notifications</Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{
          maxHeight: "450px",
          overflowY: "auto",
          backgroundColor: "#f8f9fa",
          padding: "20px",
        }}
      >
        {Array.isArray(notifications) && notifications.length > 0 ? (
          notifications.map((notification) => {
            const { icon, color, redirect } = getNotificationDetails(
              notification.type
            );
            return (
              <div
                key={notification.id}
                className={`card mb-3 shadow-sm ${
                  notification.isRead ? "bg-light" : "bg-white"
                }`}
                style={{
                  border: "none",
                  borderRadius: "10px",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
                onClick={() =>
                  handleNotificationClick(notification.id, redirect)
                }
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateY(-2px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }
              >
                <div
                  className="card-body p-3 d-flex align-items-start"
                  style={{ width: "100%" }}
                >
                  <div className="d-flex align-items-start">
                    {notification.isRead ? (
                      <MailOpen size={18} className="text-muted me-3 mt-1" />
                    ) : (
                      <Mail size={18} className="text-primary me-3 mt-1" />
                    )}
                    {icon}
                    <div>
                      <p
                        className={`mb-1 ${color}`}
                        style={{ fontSize: "14px", fontWeight: "500" }}
                      >
                        {notification.title}
                      </p>
                      <small
                        className="text-muted d-block mb-1"
                        style={{ fontSize: "12px" }}
                      >
                        {notification.message}
                      </small>
                      <small
                        className="text-muted d-block"
                        style={{ fontSize: "12px" }}
                      >
                        {new Date(notification.timestamp).toLocaleString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          }
                        )}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-4">
            <p className="text-muted" style={{ fontSize: "16px" }}>
              No notifications
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
