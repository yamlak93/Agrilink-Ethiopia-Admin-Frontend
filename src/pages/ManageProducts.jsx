import React, { useState, useEffect } from "react";
import "../Css/Devices.css"; // Import Devices.css for ms-md-250
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ProductDetailModal from "../components/ProductDetailModal";
import StylishModal from "../components/StylishModal";
import StatusChangeConfirmationModal from "../components/StatusChangeConfirmationModal"; // Assuming this exists or can be adapted
import { FaSearch, FaFilter } from "react-icons/fa"; // Import icons from react-icons
import "bootstrap/dist/css/bootstrap.min.css";
import apiClient from "../api/api";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [availabilityFilter, setAvailabilityFilter] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStylishModal, setShowStylishModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");
  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    farmer: "",
    region: "",
    unit: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newAvailability, setNewAvailability] = useState("");

  useEffect(() => {
    let isMounted = true;
    const fetchProducts = async () => {
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
        const response = await apiClient.get("/products/all", { headers });
        const fetchedProducts = response.data.products.map((product) => ({
          id: product.productId,
          name: product.productName,
          description: product.description,
          price: product.price.toString(), // Convert to string for input
          category: product.category,
          unit: product.unit,
          stock: product.quantity.toString(), // Convert to string for input
          availability:
            product.status === "available" ? "Available" : "Out of Stock",
          addedDate: product.createdAt,
          farmer: product.farmerId, // Use farmerName
          region: product.locationId, // Use farmLocation as region
          image: product.image, // Assuming image is returned as base64
        }));

        if (isMounted) {
          setProducts(fetchedProducts);
        }
      } catch (err) {
        console.error(
          "Failed to fetch products:",
          err.response?.data || err.message
        );
        if (err.response?.status === 401) {
          setError("Authentication failed. Please log in again.");
          window.location.href = "/admin/login"; // Redirect on 401
        } else {
          setError("Failed to load products.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    fetchProducts().catch((err) => {
      if (isMounted) {
        console.error("Uncaught error in fetch:", err);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.farmer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "All" || product.category === categoryFilter;
    const matchesAvailability =
      availabilityFilter === "All" ||
      product.availability === availabilityFilter;

    return matchesSearch && matchesCategory && matchesAvailability;
  });

  const handleAvailabilityChange = async (newAvailability) => {
    setNewAvailability(newAvailability);
    const token = localStorage.getItem("token");
    try {
      await apiClient.put(
        `/products/${selectedProduct.id}`,
        {
          status:
            newAvailability === "Available" ? "available" : "out of stock",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProducts((prev) =>
        prev.map((p) =>
          p.id === selectedProduct.id
            ? { ...p, availability: newAvailability }
            : p
        )
      );
      setSelectedProduct((prev) => ({
        ...prev,
        availability: newAvailability,
      }));
      setModalMessage("Product availability updated successfully.");
      setModalType("success");
    } catch (err) {
      console.error(
        "Failed to update availability:",
        err.response?.data || err.message
      );
      setModalMessage("Failed to update product availability.");
      setModalType("danger");
    } finally {
      setShowStylishModal(true);
    }
  };

  const handleEditConfirm = async () => {
    try {
      const token = localStorage.getItem("token");
      await apiClient.put(
        `/products/${selectedProduct.id}`,
        {
          productName: editFormData.name,
          description: editFormData.description,
          price: parseFloat(editFormData.price),
          category: editFormData.category,
          quantity: parseInt(editFormData.stock, 10),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProducts((prev) =>
        prev.map((p) =>
          p.id === selectedProduct.id
            ? {
                ...p,
                ...editFormData,
                price: editFormData.price,
                stock: editFormData.stock,
              }
            : p
        )
      );
      setShowEditModal(false);
      setModalMessage("Product details updated successfully.");
      setModalType("success");
      setShowStylishModal(true);
    } catch (err) {
      console.error(
        "Failed to update product:",
        err.response?.data || err.message
      );
      setModalMessage("Failed to update product details.");
      setModalType("danger");
      setShowStylishModal(true);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem("token");
      await apiClient.delete(`/products/${selectedProduct.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts((prev) => prev.filter((p) => p.id !== selectedProduct.id));
      setShowDeleteModal(false);
      setModalMessage("Product deleted successfully.");
      setModalType("success");
      setShowStylishModal(true);
    } catch (err) {
      console.error(
        "Failed to delete product:",
        err.response?.data || err.message
      );
      setModalMessage("Failed to delete product.");
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
              <h2
                className="fw-bold"
                style={{ fontSize: "24px", color: "#1a2e5a" }}
              >
                Manage Products
              </h2>
              <p
                className="text-muted"
                style={{ fontSize: "14px", color: "#6c757d" }}
              >
                View and manage platform products
              </p>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title">All Products</h5>
                  <p className="card-text text-muted">
                    Manage product details and statuses
                  </p>
                </div>

                {/* === FILTERS – MOBILE FRIENDLY === */}
                <div className="d-flex align-items-center flex-wrap flex-lg-nowrap gap-3">
                  {/* Search */}
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
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      aria-label="Search products"
                    />
                  </div>

                  {/* Category Filter */}
                  <div
                    className="filter-container w-100 w-lg-auto"
                    style={{ minWidth: "130px" }}
                  >
                    <FaFilter
                      size={16}
                      className="filter-icon"
                      style={{ color: "#28a745" }}
                    />
                    <select
                      className="form-select filter-select"
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      aria-label="Filter by category"
                    >
                      <option value="All">All Categories</option>
                      <option value="Cereals">Cereals</option>
                      <option value="Beans & Peas">Beans & Peas</option>
                      <option value="Crops for Selling">
                        Crops for Selling
                      </option>
                      <option value="Fruits">Fruits</option>
                      <option value="Vegetables">Vegetables</option>
                      <option value="Animals & Products">
                        Animals & Products
                      </option>
                      <option value="Oil Seeds">Oil Seeds</option>
                      <option value="Spices">Spices</option>
                      <option value="Flowers">Flowers</option>
                      <option value="Processing Crops">Processing Crops</option>
                    </select>
                  </div>

                  {/* Availability Filter */}
                  <div
                    className="filter-container w-100 w-lg-auto"
                    style={{ minWidth: "130px" }}
                  >
                    <FaFilter
                      size={16}
                      className="filter-icon"
                      style={{ color: "#28a745" }}
                    />
                    <select
                      className="form-select filter-select"
                      value={availabilityFilter}
                      onChange={(e) => setAvailabilityFilter(e.target.value)}
                      aria-label="Filter by availability"
                    >
                      <option value="All">All Availability</option>
                      <option value="Available">Available</option>
                      <option value="Out of Stock">Out of Stock</option>
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
                      <th
                        style={{
                          fontSize: "14px",
                          color: "#6c757d",
                          fontWeight: "normal",
                          width: "50px",
                        }}
                      >
                        #
                      </th>
                      <th
                        style={{
                          fontSize: "14px",
                          color: "#6c757d",
                          fontWeight: "normal",
                          width: "50px",
                        }}
                      >
                        Image
                      </th>
                      <th
                        style={{
                          fontSize: "14px",
                          color: "#6c757d",
                          fontWeight: "normal",
                        }}
                      >
                        Products
                      </th>
                      <th
                        style={{
                          fontSize: "14px",
                          color: "#6c757d",
                          fontWeight: "normal",
                        }}
                      >
                        Category
                      </th>
                      <th
                        style={{
                          fontSize: "14px",
                          color: "#6c757d",
                          fontWeight: "normal",
                        }}
                      >
                        Price
                      </th>
                      <th
                        style={{
                          fontSize: "14px",
                          color: "#6c757d",
                          fontWeight: "normal",
                        }}
                      >
                        Quantity
                      </th>
                      <th
                        style={{
                          fontSize: "14px",
                          color: "#6c757d",
                          fontWeight: "normal",
                        }}
                      >
                        Farmer
                      </th>
                      <th
                        style={{
                          fontSize: "14px",
                          color: "#6c757d",
                          fontWeight: "normal",
                        }}
                      >
                        Region
                      </th>
                      <th
                        style={{
                          fontSize: "14px",
                          color: "#6c757d",
                          fontWeight: "normal",
                        }}
                      >
                        Status
                      </th>
                      <th
                        style={{
                          fontSize: "14px",
                          color: "#6c757d",
                          fontWeight: "normal",
                        }}
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((product, index) => (
                        <tr key={product.id}>
                          <td style={{ fontSize: "14px", color: "#212529" }}>
                            {index + 1}
                          </td>
                          <td
                            style={{
                              fontSize: "14px",
                              color: "#212529",
                              textAlign: "center",
                            }}
                          >
                            {product.image ? (
                              <img
                                src={`data:image/jpeg;base64,${product.image}`} // Adjust based on actual image format
                                alt={product.name}
                                style={{
                                  width: "30px",
                                  height: "30px",
                                  borderRadius: "4px",
                                  objectFit: "cover",
                                }}
                              />
                            ) : (
                              <div
                                style={{
                                  width: "30px",
                                  height: "30px",
                                  backgroundColor: "#ced4da",
                                  borderRadius: "4px",
                                  display: "inline-block",
                                }}
                              ></div>
                            )}
                          </td>
                          <td style={{ fontSize: "14px", color: "#0b0b0bff" }}>
                            <div style={{ fontWeight: "bold" }}>
                              {product.name}
                            </div>
                            <div style={{ fontSize: "12px", color: "#6c757d" }}>
                              {product.id}
                            </div>
                          </td>
                          <td>
                            <span
                              className={`badge`}
                              style={{
                                fontSize: "12px",
                                padding: "4px 8px",
                                color: "#fff",
                                borderRadius: "12px",
                                backgroundColor: getCategoryColor(
                                  product.category
                                ),
                              }}
                            >
                              {product.category}
                            </span>
                          </td>
                          <td style={{ fontSize: "14px", color: "#212529" }}>
                            ${product.price}
                          </td>
                          <td style={{ fontSize: "14px", color: "#212529" }}>
                            {product.stock}
                            {" " + product.unit}
                          </td>
                          <td style={{ fontSize: "14px", color: "#212529" }}>
                            {product.farmer || "N/A"}{" "}
                            {/* Display N/A if no farmer */}
                          </td>
                          <td style={{ fontSize: "14px", color: "#212529" }}>
                            {product.region || "N/A"}{" "}
                            {/* Display N/A if no region */}
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                product.availability === "Available"
                                  ? "bg-success"
                                  : "bg-danger"
                              }`}
                              style={{
                                fontSize: "12px",
                                padding: "4px 8px",
                                color: "#fff",
                                borderRadius: "12px",
                              }}
                            >
                              {product.availability}
                            </span>
                          </td>
                          <td style={{ fontSize: "14px", color: "#212529" }}>
                            <button
                              className="btn btn-sm btn-light"
                              style={{
                                fontSize: "14px",
                                padding: "4px 8px",
                                borderRadius: "4px",
                              }}
                              onClick={() => {
                                setSelectedProduct(product);
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
                          colSpan="9"
                          className="text-center"
                          style={{ fontSize: "14px", color: "#212529" }}
                        >
                          No products found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Show detail modal */}
          {showDetailsModal && (
            <ProductDetailModal
              product={selectedProduct}
              onClose={() => setShowDetailsModal(false)}
              onEdit={() => {
                setEditFormData({
                  name: selectedProduct.name,
                  description: selectedProduct.description,
                  price: selectedProduct.price,
                  category: selectedProduct.category,
                  stock: selectedProduct.stock,
                  farmer: selectedProduct.farmer, // Set but uneditable
                  region: selectedProduct.region, // Set but uneditable
                  unit: selectedProduct.unit,
                });
                setShowDetailsModal(false);
                setShowEditModal(true);
              }}
              onDelete={() => {
                setShowDetailsModal(false);
                setShowDeleteModal(true);
              }}
              onAvailabilityChange={handleAvailabilityChange}
            />
          )}

          {/* Show edit modal */}
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
                      Edit Product: {selectedProduct.name}
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
                            borderRadius: "4px",
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
                      <div className="mb-3">
                        <label
                          className="form-label"
                          style={{ fontSize: "14px", color: "#6c757d" }}
                        >
                          Description
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          style={{
                            fontSize: "14px",
                            color: "#495057",
                            borderColor: "#ced4da",
                            padding: "6px 12px",
                            borderRadius: "4px",
                          }}
                          value={editFormData.description}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              description: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="mb-3">
                        <label
                          className="form-label"
                          style={{ fontSize: "14px", color: "#6c757d" }}
                        >
                          Price
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          style={{
                            fontSize: "14px",
                            color: "#495057",
                            borderColor: "#ced4da",
                            padding: "6px 12px",
                            borderRadius: "4px",
                          }}
                          value={editFormData.price}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              price: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="mb-3">
                        <label
                          className="form-label"
                          style={{ fontSize: "14px", color: "#6c757d" }}
                        >
                          Category
                        </label>
                        <select
                          className="form-select"
                          style={{
                            fontSize: "14px",
                            color: "#495057",
                            borderColor: "#ced4da",
                            padding: "6px 12px",
                            borderRadius: "4px",
                          }}
                          value={editFormData.category}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              category: e.target.value,
                            })
                          }
                        >
                          <option value="Cereals">Cereals</option>
                          <option value="Beans & Peas">Beans & Peas</option>
                          <option value="Crops for Selling">
                            Crops for Selling
                          </option>
                          <option value="Fruits">Fruits</option>
                          <option value="Vegetables">Vegetables</option>
                          <option value="Animals & Products">
                            Animals & Products
                          </option>
                          <option value="Oil Seeds">Oil Seeds</option>
                          <option value="Spices">Spices</option>
                          <option value="Flowers">Flowers</option>
                          <option value="Processing Crops">
                            Processing Crops
                          </option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <label
                          className="form-label"
                          style={{ fontSize: "14px", color: "#6c757d" }}
                        >
                          Stock
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          style={{
                            fontSize: "14px",
                            color: "#495057",
                            borderColor: "#ced4da",
                            padding: "6px 12px",
                            borderRadius: "4px",
                          }}
                          value={editFormData.stock}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              stock: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="mb-3">
                        <label
                          className="form-label"
                          style={{ fontSize: "14px", color: "#6c757d" }}
                        >
                          Farmer
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          style={{
                            fontSize: "14px",
                            color: "#495057",
                            borderColor: "#ced4da",
                            padding: "6px 12px",
                            borderRadius: "4px",
                            backgroundColor: "#e9ecef", // Grayed out to indicate uneditable
                            cursor: "not-allowed",
                          }}
                          value={editFormData.farmer}
                          readOnly // Make it uneditable
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
                            borderRadius: "4px",
                            backgroundColor: "#e9ecef", // Grayed out to indicate uneditable
                            cursor: "not-allowed",
                          }}
                          value={editFormData.region}
                          readOnly // Make it uneditable
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
                      style={{
                        fontSize: "14px",
                        padding: "6px 12px",
                        borderRadius: "4px",
                      }}
                      onClick={handleEditConfirm}
                    >
                      Confirm
                    </button>
                    <button
                      className="btn btn-secondary"
                      style={{
                        fontSize: "14px",
                        padding: "6px 12px",
                        borderRadius: "4px",
                      }}
                      onClick={() => setShowEditModal(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Delete Modal */}
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
                      Confirm Delete: {selectedProduct.name}
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
                        Are you sure you want to delete this product?
                      </strong>
                    </p>
                    <p>
                      <strong style={{ color: "#6c757d" }}>Name:</strong>{" "}
                      {selectedProduct.name}
                    </p>
                    <p>
                      <strong style={{ color: "#6c757d" }}>ID:</strong>{" "}
                      {selectedProduct.id}
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
                      style={{
                        fontSize: "14px",
                        padding: "6px 12px",
                        borderRadius: "4px",
                      }}
                      onClick={handleDeleteConfirm}
                    >
                      Confirm
                    </button>
                    <button
                      className="btn btn-secondary"
                      style={{
                        fontSize: "14px",
                        padding: "6px 12px",
                        borderRadius: "4px",
                      }}
                      onClick={() => setShowDeleteModal(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stylish Confirmation Modal */}
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

// Function to get category-specific colors
const getCategoryColor = (category) => {
  switch (category) {
    case "Cereals":
      return "#FF6B6B"; // Red
    case "Beans & Peas":
      return "#4ECDC4"; // Teal
    case "Crops for Selling":
      return "#45B7D1"; // Light Blue
    case "Fruits":
      return "#F7D794"; // Peach
    case "Vegetables":
      return "#A3CB38"; // Green
    case "Animals & Products":
      return "#B33771"; // Pink
    case "Oil Seeds":
      return "#FD7272"; // Coral
    case "Spices":
      return "#6C5CE7"; // Indigo
    case "Flowers":
      return "#E8A87C"; // Tan
    case "Processing Crops":
      return "#9980FA"; // Purple
    default:
      return "#CED4DA"; // Default gray
  }
};

export default ManageProducts;
