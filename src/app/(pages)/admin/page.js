"use client";

import { useState, useEffect } from "react";
import Dashboard from "../../../../Component/Admin/Dashboard";
import Categories from "../../../../Component/Admin/Categories";
import Product from "../../../../Component/Admin/Product";
import User from "../../../../Component/Admin/User";
import Myorder from "../../../../Component/Admin/Myorder";
import PaymentVerify from "../../../../Component/Admin/PaymentVerify";
import BannerAdmin from "../../../../Component/Admin/BannerAdmin";
import GoogleUser from "../../../../Component/Admin/GoogleuserLogs";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import NotLoggedInPage from "../../../../Component/NotLoggedIn";
import LoadingPage from "../../../../Component/LoadingPage";

export default function AdminPanel() {
  const [section, setSection] = useState("dashboard");
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleSectionChange = (newSection) => {
    setSection(newSection);
  };

  useEffect(() => {
  
    if (status === "loading") return; // Avoid unnecessary redirects while loading

    if (session?.user?.role !== "admin") {
      router.push("/"); 
    }
  }, [session, router, status]);

  // Show loading page while session status is "loading"
  if (status === "loading") {
    return <LoadingPage />;
  }

  // Show "Not Logged In" page if no valid session
  if (!session) {
    return <NotLoggedInPage />;
  }

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
          <SidebarButton
            label="Google user data"
            onClick={() => handleSectionChange("google-user-logs")}
            isSelected={section === "google-user-logs"}
          />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 bg-gray-900">
        {section === "dashboard" && <Dashboard />}
        {section === "categories" && <Categories />}
        {section === "products" && <Product />}
        {section === "users" && <User />}
        {section === "my-orders" && <Myorder />}
        {section === "payment-verify" && <PaymentVerify />}
        {section === "bannerAdmin" && <BannerAdmin />}
        {section === "google-user-logs" && <GoogleUser />}
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
