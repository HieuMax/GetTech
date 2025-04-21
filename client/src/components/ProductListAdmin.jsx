import React, { useEffect, useState } from "react";
// import { backendUrl } from "../App";
// import { toast } from "react-toastify";

import ConfirmModal from "./ConfirmModal";
import { useNavigate } from "react-router-dom";

const ProductListAdmin = ({ token }) => {
  const [list, setList] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  const fetchList = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/phones");
      const result = await response.json();
      setList(result);
    } catch (error) {
      console.log(error);
      // toast.error(error.message);
    }
  };

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
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
          prevList.filter((item) => item.ID !== selectedId)
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
      setIsModalOpen(false);
      setSelectedId(null);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(list.length / itemsPerPage);
  const paginatedItems = list.slice(
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
      <div className="flex justify-between mb-2">
        <p className="text-2xl font-bold mb-4">All Products List</p>
        <div>
          <label className="mr-2">Số sản phẩm/trang:</label>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1); // Reset về trang 1
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

      <div className="flex flex-col gap-2">
        <div className="hidden md:grid grid-cols-[1fr_1fr_2fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm">
          <b>Image</b>
          <b>Name</b>
          <b>Description</b>
          <b>Brand</b>
          <b>Price</b>
          <b className="text-right md:text-center cursor-pointer">Action</b>
        </div>

        {paginatedItems.map((item, index) => (
          <div
            className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_1fr_2fr_1fr_1fr_1fr] items-center py-1 px-2 border text-sm"
            key={index}
          >
            <img className="w-12" src={item.image} alt="" />
            <p>{item.name}</p>
            <p>{item.description}</p>
            <p>{item.brand}</p>
            <p>${item.price}</p>
            <p className="flex gap-2 justify-end md:justify-center">
              <button
                onClick={() => navigate(`/admin/edit/${item.ID}`)}
                className="text-blue-500 underline"
              >
                Sửa
              </button>
              <span
                onClick={() => handleDeleteClick(item.ID)}
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
        onConfirm={confirmDelete}
        onCancel={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default ProductListAdmin;
