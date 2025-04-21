import React from "react";
import SidebarAdmin from "../components/sidebarAdmin";
import { Outlet, useNavigate } from "react-router-dom";
import NavbarAdmin from "../components/ui/NavbarAdmin";
import { useAuth } from "../store/AuthContext";

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user && user.role === "admin";

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Something Wrong</h2>
        <p className="mb-6">Sorry, we couldn't find URL you're looking for.</p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Back to Shop
        </button>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <NavbarAdmin />
      <hr />
      <div className="flex w-full">
        <SidebarAdmin />
        <main className="w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Admin;
