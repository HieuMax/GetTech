import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import ConfirmModal from "./ConfirmModal";

const AddProduct = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState(false);

  const [formData, setFormData] = useState({
    ID: "",
    image: "",
    name: "",
    price: "",
    brand: "",
    description: "",
    rating: "",
    category: "",
  });
  const [initialData, setInitialData] = useState(null);
  const categoryMap = {
    MOBL: "Mobile",
    LAPT: "Laptop",
    HEAD: "Headphone",
    TABL: "Tablet",
    ACCE: "Accessories",
  };

  const { id } = useParams();

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:5000/api/phone/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setFormData(data);
          setInitialData(data);
          setImagePreview(data.image);
        })
        .catch((err) => console.error("Lỗi tải sản phẩm:", err));
    } else {
      const emptyData = {
        ID: "",
        image: "",
        name: "",
        price: "",
        brand: "",
        description: "",
        rating: "",
        category: "",
      };
      setFormData(emptyData);
      setInitialData(emptyData);
      setImagePreview(null);
    }
  }, [id]);

  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "category") {
      if (value === "") {
        setFormData((prev) => ({ ...prev, ID: "" }));
      } else {
        fetch(`http://localhost:5000/api/phones/next-id/${value}`)
          .then((res) => res.json())
          .then((data) => setFormData((prev) => ({ ...prev, ID: data.nextID })))
          .catch((err) => console.error("Lỗi lấy ID:", err));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!imagePreview) {
      alert("Vui lòng chọn hình ảnh cho sản phẩm!");
      return;
    }

    if (
      id &&
      JSON.stringify({ ...formData, image: imagePreview }) ===
        JSON.stringify(initialData)
    ) {
      alert("Chưa có thông tin nào được chỉnh sửa!");
      return;
    }
    setShowConfirm(true);
  };

  const submitProduct = async () => {
    const finalData = {
      ...formData,
      image: imagePreview,
    };

    const url = id
      ? `http://localhost:5000/api/updatePhone/${id}`
      : "http://localhost:5000/api/createPhone";
    const method = id ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(finalData),
    });

    const data = await res.json();

    if (res.ok) {
      setSuccessMessage(
        id ? "Cập nhật sản phẩm thành công!" : "Thêm sản phẩm thành công!"
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => setSuccessMessage(""), 4000);

      if (!id) {
        const emptyData = {
          ID: "",
          image: "",
          name: "",
          price: "",
          brand: "",
          description: "",
          rating: "",
          category: "",
        };
        setFormData(emptyData);
        setInitialData(emptyData);
        setImagePreview(null);
      } else {
        setInitialData(finalData);
      }
    } else {
      alert(data.message || "Có lỗi xảy ra.");
    }

    setPendingSubmit(false);
    setShowConfirm(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      alert("Vui lòng chọn đúng định dạng ảnh!");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    fileInputRef.current.value = "";
  };

  return (
    <>
      <div className="max-w-lg mx-auto p-4 border rounded-lg shadow relative">
        {successMessage && (
          <div className="absolute top-0 left-0 right-0 bg-green-500 text-white px-4 py-2 flex justify-between items-center rounded-t-lg">
            <span>{successMessage}</span>
            <button
              className="underline font-semibold"
              onClick={() => navigate("/admin/list")}
            >
              Xem danh sách
            </button>
          </div>
        )}
        <div className="pt-12">
          <h2 className="text-2xl font-bold mb-4">
            {id ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="font-semibold">ID</label>
              <input
                type="text"
                name="ID"
                value={formData.ID}
                readOnly
                className="w-full p-2 border rounded bg-gray-100"
              />
            </div>

            <div>
              <label className="font-semibold">Phân loại</label>
              {id ? (
                <input
                  type="text"
                  value={categoryMap[formData.ID.slice(4, 8)] || ""}
                  name="category"
                  readOnly
                  className="w-full p-2 border rounded bg-gray-100"
                />
              ) : (
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-2 border rounded mt-1"
                >
                  <option value="">-- Chọn --</option>
                  <option value="MOBL">Mobile</option>
                  <option value="LAPT">Laptop</option>
                  <option value="HEAD">Headphone</option>
                  <option value="TABL">Tablet</option>
                  <option value="ACCE">Accessories</option>
                </select>
              )}
            </div>

            <div>
              <label className="font-semibold">Hình ảnh</label>
              <div className="flex items-center gap-3 mt-1">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-24 h-24 object-cover border rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Chọn ảnh
                  </button>
                )}
                {imagePreview && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-2 border rounded hover:bg-gray-100"
                  >
                    Thay ảnh
                  </button>
                )}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
            </div>

            <div>
              <label className="font-semibold">Tên sản phẩm</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="font-semibold">Giá</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="font-semibold">Hãng</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="font-semibold">Mô tả</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border rounded h-24"
              ></textarea>
            </div>

            <div>
              <label className="font-semibold">Đánh giá (0-5)</label>
              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                step="0.1"
                className="w-full p-2 border rounded"
              />
            </div>

            <button
              type="submit"
              className="bg-green-500 text-white py-2 rounded hover:bg-green-600"
            >
              {id ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
            </button>
          </form>
        </div>
      </div>
      <ConfirmModal
        isOpen={showConfirm}
        title={id ? "Xác nhận cập nhật" : "Xác nhận thêm mới"}
        message={`Bạn có chắc chắn muốn ${
          id ? "cập nhật" : "thêm"
        } sản phẩm này không?`}
        onConfirm={submitProduct}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
};

export default AddProduct;
