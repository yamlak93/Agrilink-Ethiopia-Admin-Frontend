import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import StylishModal from "../components/StylishModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Css/Devices.css"; // Import Devices.css for ms-md-250

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");

  const [profileData, setProfileData] = useState({
    fullName: "Abebe Kebede",
    email: "abebe@example.com",
    phoneNumber: "+251 91 987 6543",
    location: "Addis Ababa",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  const [modal, setModal] = useState({
    isVisible: false,
    message: "",
    type: "",
  });

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prevData) => ({ ...prevData, [name]: value }));
  };

  const isProfileComplete = () =>
    profileData.fullName.trim() &&
    profileData.email.trim() &&
    profileData.phoneNumber.trim() &&
    profileData.location.trim();

  const handleSaveProfile = () => {
    if (isProfileComplete()) {
      console.log("Saving profile changes:", profileData);
      setIsEditing(false);
      setModal({
        isVisible: true,
        message: "Profile updated successfully!",
        type: "success",
      });
    } else {
      setModal({
        isVisible: true,
        message: "Please fill all profile fields.",
        type: "error",
      });
    }
  };

  const handleSavePassword = () => {
    const { currentPassword, newPassword, confirmPassword } = passwordData;

    if (
      !currentPassword.trim() ||
      !newPassword.trim() ||
      !confirmPassword.trim()
    ) {
      setModal({
        isVisible: true,
        message: "Please fill all password fields.",
        type: "error",
      });
      return;
    }

    if (newPassword.length < 6) {
      setModal({
        isVisible: true,
        message: "New password must be at least 6 characters long.",
        type: "error",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setModal({
        isVisible: true,
        message: "New password and confirmation do not match.",
        type: "error",
      });
      return;
    }

    console.log("Changing password:", passwordData);
    setModal({
      isVisible: true,
      message: "Password updated successfully!",
      type: "success",
    });

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleCloseModal = () => {
    setModal({ isVisible: false, message: "", type: "" });
  };

  const renderProfileContent = () => (
    <div className="card mb-4">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5
            className="card-title"
            style={{ fontSize: "18px", color: "#1a2e5a" }}
          >
            Profile Information
          </h5>
          {!isEditing && (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setIsEditing(true)}
              style={{ fontSize: "14px", padding: "6px 12px" }}
            >
              <FontAwesomeIcon icon={faPencilAlt} className="me-2" /> Edit
            </button>
          )}
        </div>
        <p
          className="card-text text-muted"
          style={{ fontSize: "14px", color: "#6c757d" }}
        >
          Update your personal information and profile details
        </p>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label
              htmlFor="fullName"
              className="form-label"
              style={{ fontSize: "14px", color: "#6c757d" }}
            >
              Full Name
            </label>
            <input
              type="text"
              className="form-control"
              id="fullName"
              name="fullName"
              value={profileData.fullName}
              readOnly={!isEditing}
              onChange={handleProfileInputChange}
              required
              style={{ fontSize: "14px", padding: "8px" }}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label
              htmlFor="email"
              className="form-label"
              style={{ fontSize: "14px", color: "#6c757d" }}
            >
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={profileData.email}
              readOnly={!isEditing}
              onChange={handleProfileInputChange}
              required
              style={{ fontSize: "14px", padding: "8px" }}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label
              htmlFor="phoneNumber"
              className="form-label"
              style={{ fontSize: "14px", color: "#6c757d" }}
            >
              Phone Number
            </label>
            <input
              type="tel"
              className="form-control"
              id="phoneNumber"
              name="phoneNumber"
              value={profileData.phoneNumber}
              readOnly={!isEditing}
              onChange={handleProfileInputChange}
              required
              style={{ fontSize: "14px", padding: "8px" }}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label
              htmlFor="location"
              className="form-label"
              style={{ fontSize: "14px", color: "#6c757d" }}
            >
              Location
            </label>
            <input
              type="text"
              className="form-control"
              id="location"
              name="location"
              value={profileData.location}
              readOnly={!isEditing}
              onChange={handleProfileInputChange}
              required
              style={{ fontSize: "14px", padding: "8px" }}
            />
          </div>
        </div>

        {isEditing && (
          <div className="d-flex justify-content-end mt-4">
            <button
              className="btn btn-primary"
              onClick={handleSaveProfile}
              disabled={!isProfileComplete()}
              style={{ fontSize: "14px", padding: "8px 16px" }}
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderPasswordContent = () => (
    <div className="card mb-4">
      <div className="card-body">
        <h5
          className="card-title"
          style={{ fontSize: "18px", color: "#1a2e5a" }}
        >
          Change Password
        </h5>
        <p
          className="card-text text-muted"
          style={{ fontSize: "14px", color: "#6c757d" }}
        >
          Update your account password
        </p>

        <div className="mb-3">
          <label
            htmlFor="currentPassword"
            className="form-label"
            style={{ fontSize: "14px", color: "#6c757d" }}
          >
            Current Password
          </label>
          <input
            type="password"
            className="form-control"
            id="currentPassword"
            name="currentPassword"
            value={passwordData.currentPassword}
            onChange={handlePasswordInputChange}
            required
            style={{ fontSize: "14px", padding: "8px" }}
          />
        </div>

        <div className="mb-3">
          <label
            htmlFor="newPassword"
            className="form-label"
            style={{ fontSize: "14px", color: "#6c757d" }}
          >
            New Password
          </label>
          <input
            type="password"
            className="form-control"
            id="newPassword"
            name="newPassword"
            value={passwordData.newPassword}
            onChange={handlePasswordInputChange}
            required
            style={{ fontSize: "14px", padding: "8px" }}
          />
        </div>

        <div className="mb-3">
          <label
            htmlFor="confirmPassword"
            className="form-label"
            style={{ fontSize: "14px", color: "#6c757d" }}
          >
            Confirm New Password
          </label>
          <input
            type="password"
            className="form-control"
            id="confirmPassword"
            name="confirmPassword"
            value={passwordData.confirmPassword}
            onChange={handlePasswordInputChange}
            required
            style={{ fontSize: "14px", padding: "8px" }}
          />
        </div>

        <div className="d-flex justify-content-end mt-4">
          <button
            className="btn btn-primary"
            onClick={handleSavePassword}
            style={{ fontSize: "14px", padding: "8px 16px" }}
          >
            Update Password
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-vh-100 bg-light">
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
                Account Settings
              </h2>
              <p
                className="text-muted"
                style={{ fontSize: "14px", color: "#6c757d" }}
              >
                Manage your account settings and preferences
              </p>
            </div>
          </div>

          <ul className="nav nav-tabs mb-4">
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "profile" ? "active" : ""
                }`}
                style={{
                  fontSize: "14px",
                  padding: "8px 16px",
                  backgroundColor: activeTab === "profile" ? "#28a745" : "",
                  color: activeTab === "profile" ? "#ffffff" : "#6c757d",
                  border: "none",
                }}
                onClick={() => setActiveTab("profile")}
              >
                Profile
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "password" ? "active" : ""
                }`}
                style={{
                  fontSize: "14px",
                  padding: "8px 16px",
                  backgroundColor: activeTab === "password" ? "#28a745" : "",
                  color: activeTab === "password" ? "#ffffff" : "#6c757d",
                  border: "none",
                }}
                onClick={() => setActiveTab("password")}
              >
                Password
              </button>
            </li>
          </ul>

          {activeTab === "profile"
            ? renderProfileContent()
            : renderPasswordContent()}

          <StylishModal
            isVisible={modal.isVisible}
            message={modal.message}
            type={modal.type}
            onClose={handleCloseModal}
          />
        </div>
      </div>
    </div>
  );
};

export default Settings;
