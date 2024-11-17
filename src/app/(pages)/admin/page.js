"use client";

import { useState, useEffect } from "react";
import Dashboard from "../../../../Component/Admin/Dashboard";
import Categories from "../../../../Component/Admin/Categories";
import Product from "../../../../Component/Admin/Product";
import User from "../../../../Component/Admin/User";
import Myorder from "../../../../Component/Admin/Myorder";
import PaymentVerify from "../../../../Component/Admin/PaymentVerify";
import BannerAdmin from "../../../../Component/Admin/BannerAdmin";

export default function AdminPanel() {
  const [section, setSection] = useState("dashboard");

  // Data for dashboard counts fetched from API
  const [orderCount, setOrderCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [newCustomers, setNewCustomers] = useState(0);
  const [error, setError] = useState(null);

  const handleSectionChange = (newSection) => {
    setSection(newSection);
  };

  useEffect(() => {
    // Fetch dashboard data when the component is mounted
    const fetchData = async () => {
      try {
        const response = await fetch("/api/admin/dashboard", {
          method: "GET",
          headers: {
            // Assuming a session-based token or some form of authentication
            Authorization: `Bearer YOUR_JWT_TOKEN`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setOrderCount(data.ordersCount);
        setProductCount(data.productsCount);
        setTotalRevenue(data.totalRevenue);
        setNewCustomers(data.newCustomersCount);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen font-sans bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-1/4 bg-gradient-to-b from-purple-700 to-purple-900 text-white flex flex-col items-center py-8 shadow-lg">
        <h2 className="text-3xl font-semibold mb-8">Admin Panel</h2>
        <nav className="w-full">
          <SidebarButton
            label="Dashboard"
            onClick={() => handleSectionChange("dashboard")}
            isSelected={section === "dashboard"}
          />
          <SidebarButton
            label="Categories"
            onClick={() => handleSectionChange("categories")}
            isSelected={section === "categories"}
          />
          <SidebarButton
            label="Products"
            onClick={() => handleSectionChange("products")}
            isSelected={section === "products"}
          />
          <SidebarButton
            label="Users"
            onClick={() => handleSectionChange("users")}
            isSelected={section === "users"}
          />
          <SidebarButton
            label="My Orders"
            onClick={() => handleSectionChange("my-orders")}
            isSelected={section === "my-orders"}
          />
          <SidebarButton
            label="Payment Verify"
            onClick={() => handleSectionChange("payment-verify")}
            isSelected={section === "payment-verify"}
          />
          <SidebarButton
            label="Banner"
            onClick={() => handleSectionChange("bannerAdmin")}
            isSelected={section === "bannerAdmin"}
          />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 bg-gray-900">
        {section === "dashboard" && (
          <Dashboard
            orderCount={orderCount}
            productCount={productCount}
            totalRevenue={totalRevenue}
            newCustomers={newCustomers}
            error={error}
          />
        )}
        {section === "categories" && <Categories />}
        {section === "products" && <Product />}
        {section === "users" && <User />}
        {section === "my-orders" && <Myorder />}
        {section === "payment-verify" && <PaymentVerify />}
        {section === "bannerAdmin" && <BannerAdmin />}
      </main>
    </div>
  );
}

function SidebarButton({ label, onClick, isSelected }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-2 text-lg transition-colors duration-200 ${
        isSelected
          ? "bg-purple-600 text-white"
          : "hover:bg-purple-600 hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}
