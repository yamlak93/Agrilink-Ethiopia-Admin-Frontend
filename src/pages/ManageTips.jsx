import React, { useState, useEffect } from "react";
import "../Css/Devices.css"; // Import Devices.css for ms-md-250
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import TipsModal from "../components/TipsModal";
import TipsCard from "../components/TipsCard";
import TipDetailModal from "../components/TipDetailModal";
import { Search, Plus } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";

// Mock data for the tips
const mockTips = [
  {
    id: "TIP-001",
    type: "Farming Tips",
    title: "Effective Irrigation Methods for Teff",
    date: "2023-05-10",
    description:
      "Teff requires careful irrigation. For best results, use furrow irrigation during the early stages and reduce water as the crop matures.",
  },
  {
    id: "TIP-002",
    type: "Alert",
    title: "Weather Alert: Heavy Rain Expected",
    date: "2023-05-15",
    description:
      "Heavy rainfall is expected in the Amhara and Oromia regions over the next week. Farmers should secure their crops and prepare drainage systems.",
  },
  {
    id: "TIP-003",
    type: "Alert",
    title: "Pest Alert: Locust Swarms",
    date: "2023-05-12",
    description:
      "Locust swarms have been spotted in the eastern regions. Farmers should implement preventive measures and report sightings to local authorities.",
  },
  {
    id: "TIP-004",
    type: "Farming Tips",
    title: "Organic Fertilizer Techniques",
    date: "2023-05-08",
    description:
      "Learn how to create effective organic fertilizers using local materials. This guide covers compost preparation, application timing, and quantity recommendations.",
  },
  {
    id: "TIP-005",
    type: "Market Updates",
    title: "Market Prices Update",
    date: "2023-05-16",
    description: "Current market prices for major crops.",
    marketDetails: {
      productName: "Teff",
      price: "40 ETB/kg",
      trend: "Stable",
    },
  },
  {
    id: "TIP-006",
    type: "Resources",
    title: "Guide to Local Seed Suppliers",
    date: "2023-05-17",
    description:
      "A comprehensive list of trusted local seed suppliers for farmers, including contact details and available seed varieties.",
  },
];

const ManageTips = () => {
  const [tips, setTips] = useState(mockTips);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTip, setNewTip] = useState({
    type: "",
    title: "",
    description: "",
  });
  const [editTip, setEditTip] = useState(null);
  const [deleteTip, setDeleteTip] = useState(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedTip, setSelectedTip] = useState(null);

  const tabs = ["All", "Farming Tips", "Alert", "Resources", "Market Updates"];

  useEffect(() => {
    let filtered = mockTips;

    if (activeTab === "Farming Tips") {
      filtered = filtered.filter((tip) => tip.type === "Farming Tips");
    } else if (activeTab === "Alert") {
      filtered = filtered.filter((tip) => tip.type === "Alert");
    } else if (activeTab === "Resources") {
      filtered = filtered.filter((tip) => tip.type === "Resources");
    } else if (activeTab === "Market Updates") {
      filtered = filtered.filter((tip) => tip.type === "Market Updates");
    }

    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (tip) =>
          tip.title.toLowerCase().includes(lowercasedQuery) ||
          tip.description.toLowerCase().includes(lowercasedQuery) ||
          tip.type.toLowerCase().includes(lowercasedQuery)
      );
    }

    setTips(filtered);
  }, [activeTab, searchQuery]);

  const handleOpenModal = () => {
    setNewTip({ type: "", title: "", description: "" });
    setEditTip(null);
    setIsModalOpen(true);
  };

  const handleEditTip = (tip) => {
    setEditTip(tip);
    setNewTip({ ...tip });
    setIsModalOpen(true);
  };

  const handleDeleteTip = (tip) => {
    setDeleteTip(tip);
    setIsConfirmDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (deleteTip) {
      setTips(tips.filter((t) => t.id !== deleteTip.id));
      setIsConfirmDeleteOpen(false);
      setDeleteTip(null);
    }
  };

  const cancelDelete = () => {
    setIsConfirmDeleteOpen(false);
    setDeleteTip(null);
  };

  const handleSaveTip = (tipData) => {
    if (tipData.type && tipData.title && tipData.description) {
      if (editTip) {
        // Update existing tip
        setTips(
          tips.map((t) =>
            t.id === editTip.id
              ? {
                  ...t,
                  ...tipData,
                  date: new Date().toISOString().split("T")[0],
                }
              : t
          )
        );
      } else {
        // Add new tip
        setTips([
          ...tips,
          {
            id: `TIP-${tips.length + 1}`.padStart(7, "0"),
            ...tipData,
            date: new Date().toISOString().split("T")[0],
          },
        ]);
      }
      setIsModalOpen(false);
    }
  };

  const handleViewDetails = (tip) => {
    setSelectedTip(tip);
    setIsDetailModalOpen(true);
  };

  return (
    <>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div
          className="container-fluid p-4 ms-md-250"
          style={{ marginTop: "60px" }} // Keep marginTop for navbar offset
        >
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="fw-bold mb-0">Tips & Alerts</h1>
              <p className="text-muted">
                Post farming tips, alerts, and important announcements for
                farmers
              </p>
            </div>
            <button
              className="btn btn-success d-flex align-items-center gap-2"
              onClick={handleOpenModal}
            >
              <Plus size={16} /> Create New
            </button>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="row g-3 align-items-center">
                <div className="col-12 col-md-6">
                  <div className="search-container">
                    <Search size={20} className="search-icon" />
                    <input
                      type="text"
                      className="form-control search-input"
                      placeholder="Search tips & alerts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      aria-label="Search tips"
                    />
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div
                    className="btn-group w-100"
                    role="group"
                    style={{ overflowX: "auto", whiteSpace: "nowrap" }}
                  >
                    {tabs.map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`btn btn-sm ${
                          activeTab === tab
                            ? "btn-success text-white"
                            : "btn-outline-secondary text-muted"
                        } rounded-0 border-end-0 ${
                          tab === "All"
                            ? "rounded-start"
                            : tab === "Market Updates"
                            ? "rounded-end"
                            : ""
                        }`}
                        style={{
                          transition: "all 0.3s ease",
                          border: "1px solid #dee2e6",
                          minWidth: "0",
                          padding: "0.25rem 0.75rem",
                        }}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="row g-4">
                {tips.length > 0 ? (
                  tips.map((tip) => (
                    <div key={tip.id} className="col-12 col-md-6 col-lg-4">
                      <TipsCard
                        tip={tip}
                        onEdit={handleEditTip}
                        onDelete={handleDeleteTip}
                        onViewDetails={handleViewDetails}
                      />
                    </div>
                  ))
                ) : (
                  <div className="col-12 text-center text-muted">
                    No tips found.
                  </div>
                )}
              </div>
            </div>
          </div>

          <TipsModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveTip}
            initialTip={newTip}
          />
          {isConfirmDeleteOpen && (
            <div
              className="modal show d-block"
              tabIndex="-1"
              style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title fw-bold">Confirm Delete</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={cancelDelete}
                    ></button>
                  </div>
                  <div className="modal-body">
                    Are you sure you want to delete the tip "{deleteTip?.title}
                    "?
                  </div>
                  <div className="modal-footer">
                    <button
                      className="btn btn-secondary"
                      onClick={cancelDelete}
                    >
                      Cancel
                    </button>
                    <button className="btn btn-danger" onClick={confirmDelete}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          <TipDetailModal
            isOpen={isDetailModalOpen}
            onClose={() => setIsDetailModalOpen(false)}
            tip={selectedTip}
          />
        </div>
      </div>
    </>
  );
};

export default ManageTips;
