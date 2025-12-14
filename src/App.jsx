import { useState } from "react";
import viteLogo from "/vite.svg";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import ManageUsers from "./pages/ManageUsers";
import ManageProducts from "./pages/ManageProducts";
import ManageOrders from "./pages/ManageOrders";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DeliveryManagement from "./pages/DeliveryManagement";
import ManageTips from "./pages/ManageTips";
import Settings from "./pages/Settings";
import AdminAnalytics from "./pages/AdminAnalytics";
import Reports from "./pages/Reports";
import PaymentsPage from "./pages/PaymentsPage";
import LoginPage from "./auth/LoginPage";
import RegisterPage from "./auth/RegisterPage";
import ForgotPasswordPage from "./auth/ForgotPasswordPage";
import FarmerBankAccountPage from "./pages/FarmerBankAccountPage";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/admin/login" replace />} />
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/admin/register" element={<RegisterPage />} />
          <Route
            path="/admin/forgot-password"
            element={<ForgotPasswordPage />}
          />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/manage-users" element={<ManageUsers />} />
          <Route path="/admin/manage-products" element={<ManageProducts />} />
          <Route path="/admin/manage-orders" element={<ManageOrders />} />
          <Route
            path="/admin/manage-deliveries"
            element={<DeliveryManagement />}
          />
          <Route path="/admin/tip" element={<ManageTips />} />
          <Route path="/admin/settings" element={<Settings />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/reports" element={<Reports />} />
          <Route path="/admin/payments" element={<PaymentsPage />} />
          <Route
            path="/admin/manage-banks-accounts"
            element={<FarmerBankAccountPage />}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
