import React from "react";
import { useNavigate } from "react-router-dom"; // Để chuyển hướng

const NavbarAdmin = () => {
  const navigate = useNavigate(); // Hook để chuyển hướng

  const handleLogout = async () => {
    try {
      // Gửi yêu cầu POST đến API logout
      const response = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // Lấy token từ localStorage
        },
      });

      const data = await response.json();

      if (response.ok) {
        // Xóa token khỏi localStorage
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken"); // Nếu bạn cũng lưu refresh token

        // Chuyển hướng đến trang đăng nhập
        navigate("/");
        alert(data.message); // Hiển thị thông báo đăng xuất thành công
      } else {
        // Xử lý lỗi từ API
        alert(data.message || "Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      alert("An error occurred during logout");
    }
  };

  return (
    <div className="flex items-center py-2 px-[4%] justify-between">
      <div className="flex items-center gap-3 cursor-pointer">
        <img src="/logo.png" alt="Logo" />
        <div className="flex flex-col">
          <h1 className="text-3xl">GetTech</h1>
          <h1 className="text-base text-gray-500">Admin Panel</h1>
        </div>
      </div>
      <button
        onClick={handleLogout} // Gọi hàm handleLogout khi nhấn nút
        className="bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm"
      >
        Logout
      </button>
    </div>
  );
};

export default NavbarAdmin;
