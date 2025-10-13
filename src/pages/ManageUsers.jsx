import React, { useState, useEffect } from "react";
import "../Css/Devices.css"; // Import Devices.css for ms-md-250
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import UserDetailModal from "../components/UserDetailModal";
import StylishModal from "../components/StylishModal";
import StatusChangeConfirmationModal from "../components/StatusChangeConfirmationModal";
import { FaSearch, FaFilter } from "react-icons/fa"; // Import icons from react-icons
import "bootstrap/dist/css/bootstrap.min.css";
import apiClient from "../api/api";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStylishModal, setShowStylishModal] = useState(false);
  const [showStatusChangeModal, setShowStatusChangeModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    region: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    let isMounted = true;
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication required. Please log in.");
        window.location.href = "/admin/login"; // Redirect if no token
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      try {
        const [farmersResponse, buyersResponse] = await Promise.all([
          apiClient.get("/users/all-farmers", { headers }),
          apiClient.get("/users/all-buyers", { headers }),
        ]);

        const farmers = farmersResponse.data.users.map((user) => ({
          ...user,
          email: "", // Leave email empty for farmers
          role: "Farmer",
        }));
        const buyers = buyersResponse.data.users.map((user) => ({
          ...user,
          role: "Buyer",
        }));

        const combinedUsers = [...farmers, ...buyers].sort((a, b) => {
          return new Date(b.joinDate) - new Date(a.joinDate);
        });

        if (isMounted) {
          setUsers(combinedUsers);
        }
      } catch (err) {
        console.error(
          "Failed to fetch users:",
          err.response?.data || err.message
        );
        if (err.response?.status === 401) {
          setError("Authentication failed. Please log in again.");
          window.location.href = "/admin/login"; // Redirect on 401 (e.g., invalid token)
        } else {
          setError("Failed to load users.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    fetchUsers().catch((err) => {
      if (isMounted) {
        console.error("Uncaught error in fetch:", err);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.phone || "").toString().includes(searchTerm) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.region || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === "All" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "All" ||
      user.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleStatusChange = (newStatus) => {
    setNewStatus(newStatus);
    setShowStatusChangeModal(true);
  };

  const confirmStatusChange = async () => {
    try {
      const token = localStorage.getItem("token");
      await apiClient.put(
        `/users/${selectedUser.id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers((prev) =>
        prev.map((u) =>
          u.id === selectedUser.id ? { ...u, status: newStatus } : u
        )
      );
      setSelectedUser((prev) => ({ ...prev, status: newStatus }));
      setModalMessage("User status updated successfully.");
      setModalType("success");
      setShowStatusChangeModal(false);
      setShowStylishModal(true);
    } catch (err) {
      console.error(
        "Failed to update status:",
        err.response?.data || err.message
      );
      setModalMessage("Failed to update user status.");
      setModalType("danger");
      setShowStylishModal(true);
    }
  };

  const handleEditConfirm = async () => {
    try {
      const token = localStorage.getItem("token");
      await apiClient.put(
        `/users/${selectedUser.id}`,
        {
          name: editFormData.name,
          email: editFormData.email,
          phone: editFormData.phone,
          role: editFormData.role,
          region: editFormData.region,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers((prev) =>
        prev.map((u) =>
          u.id === selectedUser.id ? { ...u, ...editFormData } : u
        )
      );
      setShowEditModal(false);
      setModalMessage("User details updated successfully.");
      setModalType("success");
      setShowStylishModal(true);
    } catch (err) {
      console.error(
        "Failed to update user:",
        err.response?.data || err.message
      );
      setModalMessage("Failed to update user details.");
      setModalType("danger");
      setShowStylishModal(true);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem("token");
      await apiClient.delete(`/users/${selectedUser.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
      setShowDeleteModal(false);
      setModalMessage("User deleted successfully.");
      setModalType("success");
      setShowStylishModal(true);
    } catch (err) {
      console.error(
        "Failed to delete user:",
        err.response?.data || err.message
      );
      setModalMessage("Failed to delete user.");
      setModalType("danger");
      setShowStylishModal(true);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="alert alert-danger" role="alert">
          {error}
          <button
            className="btn btn-success ms-3"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const toTitleCase = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  return (
    <>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div
          className="container-fluid p-4 ms-md-250"
          style={{ marginTop: "60px" }}
        >
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2
                className="fw-bold"
                style={{ fontSize: "24px", color: "#1a2e5a" }}
              >
                Manage Users
              </h2>
              <p
                className="text-muted"
                style={{ fontSize: "14px", color: "#6c757d" }}
              >
                View and manage platform users
              </p>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title">All Users</h5>
                  <p className="card-text text-muted">
                    Manage user details and statuses
                  </p>
                </div>
                <div className="d-flex align-items-center flex-wrap flex-lg-nowrap gap-3">
                  <div
                    className="search-container w-100 w-lg-auto"
                    style={{ minWidth: "150px" }}
                  >
                    <FaSearch
                      size={16}
                      className="search-icon"
                      style={{ color: "#28a745" }}
                    />
                    <input
                      type="text"
                      className="form-control search-input"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      aria-label="Search users"
                    />
                  </div>
                  <div
                    className="filter-container w-100 w-lg-auto"
                    style={{ minWidth: "100px" }}
                  >
                    <FaFilter
                      size={16}
                      className="filter-icon"
                      style={{ color: "#28a745" }}
                    />
                    <select
                      className="form-select filter-select"
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
                      aria-label="Filter by role"
                    >
                      <option value="All">All Roles</option>
                      <option value="Farmer">Farmer</option>
                      <option value="Buyer">Buyer</option>
                    </select>
                  </div>
                  <div
                    className="filter-container w-100 w-lg-auto"
                    style={{ minWidth: "100px" }}
                  >
                    <FaFilter
                      size={16}
                      className="filter-icon"
                      style={{ color: "#28a745" }}
                    />
                    <select
                      className="form-select filter-select"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      aria-label="Filter by status"
                    >
                      <option value="All">All Status</option>
                      <option value="Active">Active</option>
                      <option value="Blocked">Blocked</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr style={{ backgroundColor: "#f8f9fa" }}>
                      <th style={{ fontSize: "14px", color: "#6c757d" }}>#</th>
                      <th style={{ fontSize: "14px", color: "#6c757d" }}>ID</th>
                      <th style={{ fontSize: "14px", color: "#6c757d" }}>
                        Name
                      </th>
                      <th style={{ fontSize: "14px", color: "#6c757d" }}>
                        Contact
                      </th>
                      <th style={{ fontSize: "14px", color: "#6c757d" }}>
                        Role
                      </th>
                      <th style={{ fontSize: "14px", color: "#6c757d" }}>
                        Address
                      </th>
                      <th style={{ fontSize: "14px", color: "#6c757d" }}>
                        Status
                      </th>
                      <th style={{ fontSize: "14px", color: "#6c757d" }}>
                        Join Date
                      </th>
                      <th style={{ fontSize: "14px", color: "#6c757d" }}>
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user, index) => (
                        <tr key={user.id}>
                          <td style={{ fontSize: "14px", color: "#212529" }}>
                            {index + 1}
                          </td>
                          <td style={{ fontSize: "14px", color: "#212529" }}>
                            {user.id}
                          </td>
                          <td style={{ fontSize: "14px", color: "#212529" }}>
                            {user.name}
                          </td>
                          <td style={{ fontSize: "14px", color: "#212529" }}>
                            <div>{user.email}</div>
                            <div>
                              {user.phone ? `+251${user.phone}` : "N/A"}
                            </div>
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                user.role === "Farmer"
                                  ? "bg-success"
                                  : "bg-primary"
                              }`}
                              style={{
                                fontSize: "12px",
                                padding: "4px 8px",
                                color: "#fff",
                              }}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td style={{ fontSize: "14px", color: "#212529" }}>
                            {user.region || "N/A"}
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                toTitleCase(user.status) === "Active"
                                  ? "bg-success"
                                  : "bg-danger"
                              }`}
                              style={{
                                fontSize: "12px",
                                padding: "4px 8px",
                                color: "#fff",
                              }}
                            >
                              {toTitleCase(user.status)}
                            </span>
                          </td>
                          <td style={{ fontSize: "14px", color: "#212529" }}>
                            {new Date(user.joinDate).toLocaleDateString()}
                          </td>
                          <td style={{ fontSize: "14px", color: "#212529" }}>
                            <button
                              className="btn btn-sm btn-light"
                              style={{ fontSize: "14px", padding: "4px 8px" }}
                              onClick={() => {
                                setSelectedUser(user);
                                setShowDetailsModal(true);
                              }}
                            >
                              ⋮
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="8"
                          className="text-center"
                          style={{ fontSize: "14px", color: "#212529" }}
                        >
                          No users found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {showDetailsModal && (
            <UserDetailModal
              user={selectedUser}
              onClose={() => setShowDetailsModal(false)}
              onEdit={() => {
                setEditFormData({
                  name: selectedUser.name,
                  email: selectedUser.email,
                  phone: selectedUser.phone,
                  role: selectedUser.role,
                  region: selectedUser.region,
                });
                setShowDetailsModal(false);
                setShowEditModal(true);
              }}
              onDelete={() => {
                setShowDetailsModal(false);
                setShowDeleteModal(true);
              }}
              onStatusChange={handleStatusChange}
            />
          )}

          {showEditModal && (
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
                    style={{ borderBottom: "none", padding: "15px" }}
                  >
                    <h5
                      className="modal-title"
                      style={{
                        fontSize: "18px",
                        color: "#1a2e5a",
                        fontWeight: "600",
                      }}
                    >
                      Edit User: {selectedUser.name}
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                      }}
                      onClick={() => setShowEditModal(false)}
                    ></button>
                  </div>
                  <div
                    className="modal-body"
                    style={{
                      padding: "15px",
                      fontSize: "14px",
                      color: "#495057",
                    }}
                  >
                    <form>
                      <div className="mb-3">
                        <label
                          className="form-label"
                          style={{ fontSize: "14px", color: "#6c757d" }}
                        >
                          Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          style={{
                            fontSize: "14px",
                            color: "#495057",
                            borderColor: "#ced4da",
                            padding: "6px 12px",
                          }}
                          value={editFormData.name}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              name: e.target.value,
                            })
                          }
                        />
                      </div>
                      {selectedUser.role === "Buyer" && (
                        <div className="mb-3">
                          <label
                            className="form-label"
                            style={{ fontSize: "14px", color: "#6c757d" }}
                          >
                            Email
                          </label>
                          <input
                            type="email"
                            className="form-control"
                            style={{
                              fontSize: "14px",
                              color: "#495057",
                              borderColor: "#ced4da",
                              padding: "6px 12px",
                            }}
                            value={editFormData.email}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
                                email: e.target.value,
                              })
                            }
                          />
                        </div>
                      )}
                      <div className="mb-3">
                        <label
                          className="form-label"
                          style={{ fontSize: "14px", color: "#6c757d" }}
                        >
                          Phone
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          style={{
                            fontSize: "14px",
                            color: "#495057",
                            borderColor: "#ced4da",
                            padding: "6px 12px",
                          }}
                          value={editFormData.phone}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              phone: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="mb-3">
                        <label
                          className="form-label"
                          style={{ fontSize: "14px", color: "#6c757d" }}
                        >
                          Region
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          style={{
                            fontSize: "14px",
                            color: "#495057",
                            borderColor: "#ced4da",
                            padding: "6px 12px",
                          }}
                          value={editFormData.region}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              region: e.target.value,
                            })
                          }
                        />
                      </div>
                    </form>
                  </div>
                  <div
                    className="modal-footer"
                    style={{
                      borderTop: "none",
                      padding: "15px",
                      justifyContent: "flex-end",
                      gap: "10px",
                    }}
                  >
                    <button
                      className="btn btn-success"
                      style={{ fontSize: "14px", padding: "6px 12px" }}
                      onClick={handleEditConfirm}
                    >
                      Confirm
                    </button>
                    <button
                      className="btn btn-secondary"
                      style={{ fontSize: "14px", padding: "6px 12px" }}
                      onClick={() => setShowEditModal(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showDeleteModal && (
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
                    style={{ borderBottom: "none", padding: "15px" }}
                  >
                    <h5
                      className="modal-title"
                      style={{
                        fontSize: "18px",
                        color: "#1a2e5a",
                        fontWeight: "600",
                      }}
                    >
                      Confirm Delete: {selectedUser.name}
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                      }}
                      onClick={() => setShowDeleteModal(false)}
                    ></button>
                  </div>
                  <div
                    className="modal-body"
                    style={{
                      padding: "15px",
                      fontSize: "14px",
                      color: "#495057",
                    }}
                  >
                    <p>
                      <strong style={{ color: "#6c757d" }}>
                        Are you sure you want to delete this user?
                      </strong>
                    </p>
                    <p>
                      <strong style={{ color: "#6c757d" }}>Name:</strong>{" "}
                      {selectedUser.name}
                    </p>
                    <p>
                      <strong style={{ color: "#6c757d" }}>ID:</strong>{" "}
                      {selectedUser.id}
                    </p>
                  </div>
                  <div
                    className="modal-footer"
                    style={{
                      borderTop: "none",
                      padding: "15px",
                      justifyContent: "flex-end",
                      gap: "10px",
                    }}
                  >
                    <button
                      className="btn btn-danger"
                      style={{ fontSize: "14px", padding: "6px 12px" }}
                      onClick={handleDeleteConfirm}
                    >
                      Confirm
                    </button>
                    <button
                      className="btn btn-secondary"
                      style={{ fontSize: "14px", padding: "6px 12px" }}
                      onClick={() => setShowDeleteModal(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <StatusChangeConfirmationModal
            isVisible={showStatusChangeModal}
            userName={selectedUser?.name}
            currentStatus={toTitleCase(selectedUser?.status || "")}
            newStatus={toTitleCase(newStatus)}
            onConfirm={confirmStatusChange}
            onCancel={() => setShowStatusChangeModal(false)}
          />

          <StylishModal
            isVisible={showStylishModal}
            message={modalMessage}
            type={modalType}
            onClose={() => setShowStylishModal(false)}
          />
        </div>
      </div>
    </>
  );
};

export default ManageUsers;
