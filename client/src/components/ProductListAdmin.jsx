import React, { useEffect, useState } from "react";
import ConfirmModal from "./ConfirmModal";
import { useNavigate } from "react-router-dom";

const ProductListAdmin = ({ token }) => {
  const [list, setList] = useState([]);
  const [filteredList, setFilteredList] = useState([]); // State for filtered products
  const [selectedId, setSelectedId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [selectedCategory, setSelectedCategory] = useState(""); // State for category filter

  const navigate = useNavigate();

  const categoryMap = {
    MOBL: "Mobile",
    LAPT: "Laptop",
    HEAD: "Headphone",
    TABL: "Tablet",
    ACCE: "Accessories",
  };

  const fetchList = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/phones");
      const result = await response.json();
      setList(result);
      setFilteredList(result); // Initialize filtered list
      console.log(result);
    } catch (error) {
      console.log(error);
      // toast.error(error.message);
    }
  };

  // Filter products based on search term and category
  useEffect(() => {
    let filtered = list;

    // Filter by search term (name or ID)
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.id.toString().includes(searchTerm)
      );
    }
    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((item) => item.id.includes(selectedCategory));
    }

    setFilteredList(filtered);
    setCurrentPage(1); // Reset to page 1 when filters change
  }, [searchTerm, selectedCategory, list]);

  // Get unique categories for the dropdown
  const categories = Object.entries(categoryMap);

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(
        `http://localhost:5000/api/deletePhone/${selectedId}`,
        {
          method: "DELETE",
        }
      );
      const result = await response.json();

      if (response.ok) {
        setList((prevList) =>
          prevList.filter((item) => item.id !== selectedId)
        );
        console.log(result.message);
        // toast.success(result.message);
      } else {
        console.error(result.message);
        // toast.error(result.message);
      }
    } catch (error) {
      console.log(error);
      // toast.error(error.message);
    } finally {
      setIsLoading(false);
      setSelectedId(null);
    }
  };

  const handleConfirmDelete = () => {
    setIsModalOpen(false);
    confirmDelete();
  };

  useEffect(() => {
    fetchList();
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(filteredList.length / itemsPerPage);
  const paginatedItems =
    filteredList &&
    filteredList.slice(
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
      {/* Loading overlay */}
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
            <p className="text-white mt-4 text-lg">Đang xóa sản phẩm...</p>
          </div>
        </div>
      )}

      <div className="flex justify-between mb-2">
        <p className="text-2xl font-bold mb-4">All Products List</p>
        <div className="flex gap-4">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded px-2 py-1 w-64"
          />
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="">Tất cả danh mục</option>
            {categories.map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>

          {/* Items per page */}
          <div>
            <label className="mr-2">Số sản phẩm/trang:</label>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border rounded px-2 py-1"
            >
              <option value={3}>3</option>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_2fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm">
          <b>Image</b>
          <b>Image</b>
          <b>Name</b>
          <b>Description</b>
          <b>Brand</b>
          <b>Price</b>
          <b className="text-right md:text-center cursor-pointer">Action</b>
        </div>

        {paginatedItems.map((item, index) => (
          <div
            className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[2fr_1fr_1fr_2fr_1fr_1fr_1fr] items-center py-1 px-2 border text-sm"
            key={index}
          >
            <p>{item.id}</p>
            <img className="w-12" src={item.image} alt="" />
            <p>{item.name}</p>
            <p>{item.description}</p>
            <p>{item.brand}</p>
            <p>${item.price}</p>
            <p className="flex gap-2 justify-end md:justify-center">
              <button
                onClick={() => navigate(`/admin/edit/${item.id}`)}
                className="text-blue-500 underline"
              >
                Sửa
              </button>
              <span
                onClick={() => handleDeleteClick(item.id)}
                className="cursor-pointer text-lg text-red-500"
              >
                X
              </span>
            </p>
          </div>
        ))}
      </div>

      {/* Pagination Control */}
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

      <ConfirmModal
        isOpen={isModalOpen}
        title="Xác nhận xoá"
        message="Bạn có chắc chắn muốn xóa sản phẩm này không?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default ProductListAdmin;
