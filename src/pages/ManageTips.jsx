import React, { useState, useEffect } from "react";
import "../Css/Devices.css";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import TipsModal from "../components/TipsModal";
import TipsCard from "../components/TipsCard";
import TipDetailModal from "../components/TipDetailModal";
import { Search, Plus } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import apiClient from "../api/api";

const ManageTips = () => {
  const [tips, setTips] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTip, setNewTip] = useState({
    type: "",
    title: "",
    description: "",
    productName: "",
    price: "",
    unit: "",
  });
  const [editTip, setEditTip] = useState(null);
  const [deleteTip, setDeleteTip] = useState(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedTip, setSelectedTip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const tabs = ["All", "Farming Tips", "Alert", "Resources", "Market Updates"];
  const typeMap = {
    "Farming Tips": "farmingTips",
    Alert: "alert",
    Resources: "resources",
    "Market Updates": "market updates",
  };
  const displayTypeMap = {
    farmingTips: "Farming Tips",
    alert: "Alert",
    resources: "Resources",
    "market updates": "Market Updates",
  };

  // === FETCH TIPS + SORT NEWEST FIRST ===
  useEffect(() => {
    let isMounted = true;
    const fetchTips = async () => {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication required. Please log in.");
        window.location.href = "/admin/login";
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      try {
        const response = await apiClient.get("/tips/allTips", { headers });
        const fetchedTips = response.data.tips.map((tip) => ({
          id: tip.id,
          type: tip.type,
          displayType: displayTypeMap[tip.type] || tip.type,
          title:
            tip.title || `Market Update for ${tip.productName || "Unknown"}`,
          description: tip.description || "No description available.",
          date: tip.date || new Date().toISOString().split("T")[0],
          marketDetails:
            tip.type === "market updates"
              ? {
                  productName: tip.productName || "N/A",
                  price: tip.price || "N/A",
                  unit: tip.unit || "N/A",
                }
              : null,
        }));

        if (isMounted) {
          // SORT: NEWEST FIRST
          const sortedTips = fetchedTips.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          );
          setTips(sortedTips);
        }
      } catch (err) {
        console.error("Failed to fetch tips:", err.response?.data || err);
        if (err.response?.status === 401) {
          setError("Authentication failed. Please log in again.");
          window.location.href = "/admin/login";
        } else {
          setError(
            `Failed to load tips. ${err.response?.data?.message || err.message}`
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    fetchTips().catch((err) => {
      if (isMounted) {
        console.error("Uncaught error in fetch:", err);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredTips = tips.filter((tip) => {
    const tabType = typeMap[activeTab] || activeTab.toLowerCase();
    const matchesTab = activeTab === "All" || tip.type === tabType;
    const matchesSearch = searchQuery
      ? (tip.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tip.description || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (tip.displayType || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (tip.marketDetails &&
          (tip.marketDetails.productName || "")
            .toLowerCase()
            .includes(searchQuery.toLowerCase()))
      : true;
    return matchesTab && matchesSearch;
  });

  const handleOpenModal = () => {
    setNewTip({
      type: "",
      title: "",
      description: "",
      productName: "",
      price: "",
      unit: "",
    });
    setEditTip(null);
    setIsModalOpen(true);
  };

  const handleEditTip = (tip) => {
    setEditTip(tip);
    setNewTip({
      type: tip.type,
      title: tip.title,
      description: tip.description,
      productName: tip.marketDetails?.productName || "",
      price: tip.marketDetails?.price
        ? tip.marketDetails.price.replace(/ ETB\/.*/, "")
        : "",
      unit: tip.marketDetails?.unit || "",
    });
    setIsModalOpen(true);
  };

  const handleDeleteTip = (tip) => {
    setDeleteTip(tip);
    setIsConfirmDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteTip) {
      const token = localStorage.getItem("token");
      try {
        await apiClient.delete(`/tips/${deleteTip.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTips(tips.filter((t) => t.id !== deleteTip.id));
        setIsConfirmDeleteOpen(false);
        setDeleteTip(null);
      } catch (err) {
        console.error(
          "Failed to delete tip:",
          err.response?.data || err.message
        );
        setError("Failed to delete tip.");
      }
    }
  };

  const cancelDelete = () => {
    setIsConfirmDeleteOpen(false);
    setDeleteTip(null);
  };

  const handleSaveTip = async (tipData) => {
    const token = localStorage.getItem("token");
    const payload = {
      title: tipData.title,
      content: tipData.description,
      category: tipData.type,
      productName: tipData.productName,
      price: tipData.price,
      unit: tipData.unit,
    };
    try {
      if (editTip) {
        await apiClient.put(`/tips/${editTip.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTips(
          tips.map((t) =>
            t.id === editTip.id
              ? {
                  ...t,
                  title: tipData.title,
                  description: tipData.description,
                  type: tipData.type,
                  displayType: displayTypeMap[tipData.type] || tipData.type,
                  date: new Date().toISOString().split("T")[0],
                  marketDetails:
                    tipData.type === "market updates"
                      ? {
                          productName: tipData.productName,
                          price: `${tipData.price} ETB/${tipData.unit}`,
                          unit: tipData.unit,
                        }
                      : null,
                }
              : t
          )
        );
      } else {
        const response = await apiClient.post("/tips/create", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTips([
          ...tips,
          {
            id: response.data.tipId,
            type: tipData.type,
            displayType: displayTypeMap[tipData.type] || tipData.type,
            title:
              tipData.title ||
              `Market Update for ${tipData.productName || "Unknown"}`,
            description:
              tipData.description ||
              `Current price for ${tipData.productName || "Unknown"} is ${
                tipData.price || "N/A"
              } ETB per ${tipData.unit || "N/A"}.`,
            date: new Date().toISOString().split("T")[0],
            marketDetails:
              tipData.type === "market updates"
                ? {
                    productName: tipData.productName,
                    price: `${tipData.price} ETB/${tipData.unit}`,
                    unit: tipData.unit,
                  }
                : null,
          },
        ]);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to save tip:", err.response?.data || err.message);
      setError("Failed to save tip.");
    }
  };

  const handleViewDetails = (tip) => {
    setSelectedTip(tip);
    setIsDetailModalOpen(true);
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

          {/* === FILTER SECTION – MOBILE RESPONSIVE === */}
          <div className="card">
            <div className="card-header">
              <div className="row g-3">
                {/* Search – Full width on mobile */}
                <div className="col-12">
                  <div className="position-relative">
                    <Search
                      size={20}
                      className="position-absolute top-50 start-3 translate-middle-y text-success"
                    />
                    <input
                      type="text"
                      className="form-control ps-5"
                      placeholder="Search tips & alerts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      aria-label="Search tips"
                      style={{ height: "40px" }}
                    />
                  </div>
                </div>

                {/* Tabs – Horizontal scroll on mobile */}
                <div className="col-12">
                  <div
                    className="d-flex overflow-x-auto pb-2"
                    style={{ scrollbarWidth: "none" }}
                  >
                    {tabs.map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`btn btn-sm flex-shrink-0 me-2 ${
                          activeTab === tab
                            ? "btn-success text-white"
                            : "btn-outline-secondary text-muted"
                        }`}
                        style={{
                          minWidth: "fit-content",
                          whiteSpace: "nowrap",
                          borderRadius: "6px",
                          fontSize: "0.875rem",
                        }}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* === TIPS GRID === */}
            <div className="card-body">
              <div className="row g-4">
                {filteredTips.length > 0 ? (
                  filteredTips.map((tip) => (
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

          {/* === MODALS === */}
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
