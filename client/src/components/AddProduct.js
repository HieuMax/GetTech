import React, { useState } from 'react';
import './AddProduct.css';

const AddUser = () => {

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

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Nếu thay đổi category, gọi backend để lấy ID mới
        if (name === "category") {
            if (value === "") {
                setFormData((prev) => ({
                    ...prev,
                    ID: "",
                }));
            } else {
                fetch(`http://localhost:5000/api/phones/next-id/${value}`)
                .then((res) => res.json())
                .then((data) => {
                    setFormData((prev) => ({
                        ...prev,
                        ID: data.nextID,
                    }));
                })
                .catch((err) => console.error("Lỗi lấy ID:", err));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData);
        const res = await fetch("http://localhost:5000/api/createPhone", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        }
    );

    const data = await res.json();

    if (res.ok) {
        alert("Thêm sản phẩm thành công!");
        window.location.reload();
        setFormData({
        ID: "",
        image: "",
        name: "",
        price: "",
        brand: "",
        description: "",
        rating: "",
        category: "",
        });
    } else {
        alert(data.message || "Có lỗi xảy ra.");
      }
    };


    return (
        <div className="add-user-container">
            <h2>Add new product</h2>
            <form onSubmit={handleSubmit} className="object-form">
                <div className="form-group">
                    <label style={{ fontWeight: "bold" }}>ID</label>
                    <input
                        type="text"
                        name="ID"
                        value={formData.ID}
                        readOnly
                    />
                </div>
                <div className="form-group">
                    <label style={{ fontWeight: "bold" }}>Phân loại</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        style={{ width: "100%", padding: "8px", marginTop: "5px"}}
                        >
                        <option value="">-- Chọn --</option>
                        <option value="MOBL">Mobile</option>
                        <option value="LAPT">Laptop</option>
                        <option value="HEAD">Headphone</option>
                        <option value="TABL">Tablet</option>
                        <option value="ACCE">Accessories</option>
                    </select>
                </div>

                <div className="form-group">
                    <label style={{ fontWeight: "bold" }}>Image URL</label>
                    <input
                        type="text"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label style={{ fontWeight: "bold" }}>Tên</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label style={{ fontWeight: "bold" }}>Giá</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label style={{ fontWeight: "bold" }}>Hãng</label>
                    <input
                        type="text"
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label style={{ fontWeight: "bold" }}>Mô tả</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        style={{
                            width: "100%",
                            padding: "8px",
                            marginTop: "5px",
                            height: "100px",
                        }}
                    ></textarea>
                </div>

                <div className="form-group">
                    <label style={{ fontWeight: "bold" }}>Đánh giá (0-5)</label>
                    <input
                        type="number"
                        name="rating"
                        value={formData.rating}
                        onChange={handleChange}
                        step="0.1"
                    />
                </div>

                <button type="submit">
                    Thêm sản phẩm
                </button>
            </form>
        </div>
    );
};

export default AddUser;
