import React from "react";
import SidebarAdmin from "../components/sidebarAdmin";
import { Outlet } from "react-router-dom";
import NavbarAdmin from "../components/ui/NavbarAdmin";

const Admin = () => {
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
