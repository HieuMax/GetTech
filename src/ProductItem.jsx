import React, { useState } from "react";
import { Link } from "react-router-dom";

export const SearchBar = ({ onSearch }) => {
  return (
    <input
      type="text"
      placeholder="Search for a product..."
      onChange={(e) => onSearch(e.target.value)}
      style={{
        width: "100%",
        padding: "8px",
        marginBottom: "16px",
        border: "1px solid #d1d5db",
        borderRadius: "8px",
        fontSize: "1rem",
      }}
    />
  );
};

export const ProductList = ({ Phones }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPhones = Phones.filter((phone) =>
    phone.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div>ádjasdjksadj</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", justifyContent: "center" }}>
        
        {filteredPhones.map((phone) => (
          <ProductItem key={phone.id} product={phone} />
        ))}
      </div>
    </div>
  );
};

export const ProductItem = ({ product }) => {
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <div style={{ display: "flex", color: "#f97316", fontSize: "0.875rem" }}>
        {Array(fullStars).fill(<i className="fa-solid fa-star"></i>)}{" "}
        {halfStar && <i className="fa-solid fa-star-half-alt"></i>}{" "}
        {Array(emptyStars).fill(
          <i className="fa-regular fa-star" style={{ color: "#d1d5db" }}></i>
        )}{" "}
      </div>
    );
  };

  return (
    <Link
      to={`/list/${product.id}`}
      style={{
        width: "280px",
        maxWidth: "240px",
        padding: "13px",
        height: "480px",
        maxHeight: "450px",
        borderRadius: "1rem",
        marginBottom: "1.5rem",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
      }}
    >
      {/* HINH ANH */}
      <div style={{ position: "relative", height: "240px", maxHeight: "200px" }}>
        <img
          src={product.image}
          alt={product.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "0.375rem" }}
        />
        {/* SPECIAL */}
        {product.isSpecialOffer && (
          <span
            style={{
              position: "absolute",
              top: "1rem",
              right: "0.5rem",
              backgroundColor: "#22c55e",
              color: "#ffffff",
              fontSize: "0.75rem",
              padding: "0.25rem 0.5rem",
              borderRadius: "0.5rem",
            }}
          >
            Special offers
          </span>
        )}
      </div>

      {/* CONTENT */}
      <div 
        style={{ position: "relative", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", marginTop: "0.75rem" }}
      >
        <div style={{ minHeight: "120px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "0.25rem", flexDirection: "row" }}>
            <h3 style={{ fontSize: "1.125rem", fontWeight: "600", wordBreak: "break-word" }}>{product.name}</h3>
            <i
              className="fa-regular fa-heart"
              style={{ paddingTop: "0.5rem", color: "#6b7280", fontSize: "1.125rem", cursor: "pointer" }}
            ></i>
          </div>
          <p style={{ color: "#6b7280", fontSize: "0.875rem", wordBreak: "break-word" }}>{product.description}</p>

          {/* RATE */}
          <div style={{ display: "flex", alignItems: "center", marginTop: "0.25rem", gap: "0.25rem" }}>
            {renderStars(product.rating)}
            <span style={{ color: "#1B4B66", fontWeight: "500", fontSize: "0.8125rem" }}>{product.reviews} Ratings</span>
          </div>
        </div>

        {/* PRICE */}
        <div style={{ marginTop: "0.5rem", fontWeight: "600" }}>
          <span style={{ fontSize: "0.9375rem", fontWeight: "700", color: "#000" }}>
            ${product.discountPrice}
          </span>
          <span style={{ color: "#9ca3af", fontSize: "0.8125rem", textDecoration: "line-through", marginLeft: "0.5rem" }}>
            ${product.originalPrice}
          </span>
          <span style={{ color: "#E21D1D", fontSize: "0.875rem", marginLeft: "0.5rem" }}>
            {product.discountPercent}% OFF
          </span>
        </div>

        {/* BUTTON */}
        <button
          style={{
            marginTop: "0.75rem",
            width: "100%",
            fontSize: "0.9375rem",
            backgroundColor: "#fff",
            border: "1px solid #d1d5db",
            fontWeight: "500",
            color: "#334154",
            padding: "0.75rem",
            borderRadius: "0.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            cursor: "pointer",
          }}
        >
          <i className="fa-solid fa-bag-shopping"></i> Add to bag
        </button>
      </div>
    </Link>
  );
};
