import React, { useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useCart } from "../store/CartContext";
import { useNavigate } from "react-router-dom"

export const ProductItem = ({ product }) => {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const navigate = useNavigate()

  const handleAddToCart = () => {
    setIsAdding(true);

    // Add product to cart
    const id = product.id;
    const name = product.name;
    const description = product.description;
    const price = product.price;
    const image = product.image;

    addToCart({
      id,
      name,
      description,
      price,
      image,
    });

    // Reset button state after animation
    setTimeout(() => {
      setIsAdding(false);
    }, 500);
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <div className="flex text-orange-400 text-sm">
        {[...Array(fullStars)].map((_, index) => (
          <i key={`full-${index}`} className="fa-solid fa-star"></i>
        ))}
        {halfStar && <i key="half" className="fa-solid fa-star-half-alt"></i>}
        {[...Array(emptyStars)].map((_, index) => (
          <i
            key={`empty-${index}`}
            className="fa-regular fa-star text-gray-300"></i>
        ))}
      </div>
    );
  };

  return (
    <div className="w-[280px] max-lg:w-[240px] max-md:w-[220px] max-mb_L:w-[280px] px-[13px] h-[480px] max-lg:h-[450px] rounded-2xl mb-6 flex flex-col cursor-pointer shadow-lg"
      onClick={() => {
        navigate(`/shop/${product.id}`)
      }}
    >
      {/* HINH ANH  */}
      <div className="relative h-[240px] max-lg:h-[200px]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover rounded-md"
        />
      </div>

      {/* CONTENT */}
      <div className=" relative flex-1 flex flex-col justify-between my-3">
        <div className="min-h-[120px]">
          <div className="flex  justify-between gap-1 flex-row">
            <h3 className="text-lg font-semibold break-words">
              {product.name}
            </h3>
            {/* <i class="fa-regular pt-2 fa-heart text-gray-500 text-lg cursor-pointer hover:text-red-500"></i> */}
          </div>
          <p className="text-gray-500 text-sm break-words">
            {product.description}
          </p>

          {/* RATE */}
        </div>

        {/* PRICE */}
        <div className="mt-2 font-semibold flex flex-row items-center  justify-between">
          <div className="flex items-center mt-1 gap-1">
            {renderStars(product.rating)}
          </div>
          <span className="text-[15px] font-bold text-black float-end">
            ${product.price}
          </span>
        </div>

        {/* BUTTON */}
        {/* <button onClick={handleAddToCart} className="my-3 w-full text-[15px] bg-white border font-medium border-gray-300 text-[#334154] py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-200">
          <i class="fa-solid fa-bag-shopping"></i> Add to bag
        </button> */}

        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className={`my-3 w-full text-[15px]border font-medium border-gray-300 text-[#334154] py-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
            isAdding
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
          }`}>
          {isAdding ? (
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24">
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <>
              <svg
                className="w-5 h-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              Add to bag
            </>
          )}
        </button>
      </div>
    </div>
  );
};
