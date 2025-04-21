import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "..";

const OrderAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const navigate = useNavigate();

  // Danh sách trạng thái
  const statuses = ["pending", "shipping", "completed", "cancelled"];

  // Lấy danh sách orders
  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/orders`);
      const result = await response.json();
      setOrders(result);
      setFilteredOrders(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Lọc orders theo tìm kiếm và trạng thái
  useEffect(() => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.userId.toString().includes(searchTerm)
      );
    }

    if (selectedStatus) {
      filtered = filtered.filter((order) => order.status === selectedStatus);
    }

    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedStatus, orders]);

  useEffect(() => {
    fetchOrders();
  }, []);

  // Phân trang
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedItems = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <svg
              className="animate-spin h-12 w-12 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        </div>
      )}

      <div className="flex justify-between mb-4">
        <p className="text-2xl font-bold">Danh sách đơn hàng</p>
        <div className="flex gap-4">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả trạng thái</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={3}>3</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="hidden md:grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr] items-center py-3 px-4 border bg-gray-100 text-sm font-semibold text-gray-700 rounded-lg">
          <span>ID</span>
          <span>User ID</span>
          <span>Tổng tiền</span>
          <span>Trạng thái</span>
          <span>Ngày tạo</span>
          <span className="text-right md:text-center">Hành động</span>
        </div>

        {paginatedItems.map((order) => (
          <div
            className="grid grid-cols-[1fr_1fr_1fr] md:grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr] items-center py-3 px-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow h-20"
            key={order.id}
          >
            <span className="text-gray-600 truncate">{order.id}</span>
            <span className="text-gray-600 truncate">{order.userId}</span>
            <span className="text-green-600 font-semibold">
              ${order.total.toFixed(2)}
            </span>
            <span
              className={`truncate capitalize ${
                order.status === "pending"
                  ? "text-yellow-600"
                  : order.status === "shipping"
                  ? "text-blue-600"
                  : order.status === "completed"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {order.status}
            </span>
            <span className="text-gray-600 truncate">
              {new Date(order.createdAt).toLocaleDateString()}
            </span>
            <div className="flex gap-3 justify-end md:justify-center">
              <button
                onClick={() => navigate(`/admin/orders/${order.id}`)}
                className="text-blue-500 hover:text-blue-700 font-medium transition-colors"
              >
                Chi tiết
              </button>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded border bg-gray-200 disabled:opacity-50"
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`px-3 py-1 rounded border ${
                currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded border bg-gray-200 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </>
  );
};

export default OrderAdmin;
