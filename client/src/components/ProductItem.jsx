import React from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";

export const ProductItem = ({ product }) => {
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <div className="flex text-orange-400 text-sm">
        {Array(fullStars).fill(<i className="fa-solid fa-star"></i>)}{" "}
        {halfStar && <i className="fa-solid fa-star-half-alt"></i>}{" "}
        {Array(emptyStars).fill(
          <i className="fa-regular fa-star text-gray-300"></i>
        )}{" "}
      </div>
    );
  };
  return (
    <div className="w-[280px] max-lg:w-[240px] max-md:w-[220px] max-mb_L:w-[280px] px-[13px] h-[480px] max-lg:h-[450px] rounded-2xl mb-6 flex flex-col cursor-pointer">

        {/* HINH ANH  */}
      <div className="relative h-[240px] max-lg:h-[200px]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover rounded-md"
        />
        {/* SPECIAL */}
        {product.isSpecialOffer && (
          <span className="absolute top-4 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-lg">
            Special offers
          </span>
        )}
      </div>

      {/* CONTENT */}
      <div className=" relative flex-1 flex flex-col justify-between mt-3">

        <div className="min-h-[120px]">
          <div className="flex  justify-between gap-1 flex-row">
            <h3 className="text-lg font-semibold break-words">
              {product.name}
            </h3>
            <i class="fa-regular pt-2 fa-heart text-gray-500 text-lg cursor-pointer hover:text-red-500"></i>
          </div>
          <p className="text-gray-500 text-sm break-words">
            {product.description}
          </p>

          {/* RATE */}
          <div className="flex items-center mt-1 gap-1">
            {renderStars(product.rating)}
            <span className="text-[#1B4B66] font-medium text-[13px]">
              {product.reviews} Ratings
            </span>
          </div>
        </div>

        {/* PRICE */}
        <div className="mt-2 font-semibold">
          <span className="text-[15px] font-bold text-black">
            ${product.discountPrice}
          </span>
          <span className="text-gray-400 text-[13px] line-through ml-2">
            ${product.originalPrice}
          </span>
          <span className="text-[#E21D1D] text-sm ml-2">
            {product.discountPercent}% OFF
          </span>
        </div>

        {/* BUTTON */}
        <button className="mt-3 w-full text-[15px] bg-white border font-medium border-gray-300 text-[#334154] py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-200">
          <i class="fa-solid fa-bag-shopping"></i> Add to bag
        </button>
      </div>
    </div>
  );
};
