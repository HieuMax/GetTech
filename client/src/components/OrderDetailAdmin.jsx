import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const OrderDetailAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");
  const statuses = ["pending", "shipping", "completed", "cancelled"];

  // Lấy chi tiết order
  const fetchOrderDetails = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${id}`);
      const result = await response.json();
      setOrder(result.order);
      setOrderDetails(result.orderDetails || []);
      setStatus(result.order.status);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Cập nhật trạng thái
  const updateStatus = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const result = await response.json();
      if (response.ok) {
        toast.success("Thay Đổi trạng thái đơn hàng thành công!");

        setOrder((prev) => ({ ...prev, status }));
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  if (!order) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl">Đang tải...</p>
      </div>
    );
  }

  return (
    <>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Chi tiết đơn hàng #{order.id}</h1>
          <button
            onClick={() => navigate("/admin/orders")}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
            disabled={isLoading}
          >
            Quay lại
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-xl font-semibold mb-4">Thông tin đơn hàng</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p>
                <strong>ID:</strong> {order.id}
              </p>
              <p>
                <strong>User ID:</strong> {order.userId}
              </p>
              <p>
                <strong>Tổng tiền:</strong> ${order.total.toFixed(2)}
              </p>
              <p>
                <strong>Ngày tạo:</strong>{" "}
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <p>
                <strong>Trạng thái:</strong>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  onBlur={updateStatus}
                  className="ml-2 border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </p>
              <p>
                <strong>Tên khách hàng:</strong> {order.shippingInfo.name}
              </p>
              <p>
                <strong>Địa chỉ:</strong> {order.shippingInfo.address},{" "}
                {order.shippingInfo.city}, {order.shippingInfo.state}
              </p>
              <p>
                <strong>Số điện thoại:</strong> {order.shippingInfo.phone}
              </p>
              <p>
                <strong>Email:</strong> {order.shippingInfo.email}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Chi tiết sản phẩm</h2>
          <div className="flex flex-col gap-2">
            <div className="hidden md:grid grid-cols-[1fr_2fr_1fr_1fr_1fr] items-center py-3 px-4 border bg-gray-100 text-sm font-semibold text-gray-700 rounded-lg">
              <span>Hình ảnh</span>
              <span>Tên sản phẩm</span>
              <span>Số lượng</span>
              <span>Giá</span>
              <span>Tổng</span>
            </div>
            {orderDetails.map((detail, index) => (
              <div
                className="grid grid-cols-[1fr_2fr_1fr] md:grid-cols-[1fr_2fr_1fr_1fr_1fr] items-center py-3 px-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow h-20"
                key={index}
              >
                <img
                  className="w-12 h-12 object-contain rounded"
                  src={detail.image}
                  alt={detail.name}
                />
                <span className="text-gray-800 font-medium truncate">
                  {detail.name}
                </span>
                <span className="text-gray-600">{detail.quantity}</span>
                <span className="text-gray-600">
                  ${detail.price.toFixed(2)}
                </span>
                <span className="text-green-600 font-semibold">
                  ${(detail.quantity * detail.price).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetailAdmin;
