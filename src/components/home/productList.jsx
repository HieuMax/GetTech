import React from "react";
import { ProductItem } from "../shared/ProductItem";

const mockProducts = [
  {
    id: 1,
    name: "Grande Super Long Product Name Example",
    description:
      "Blossom Pouch with Extra Long Description That Should Wrap Correctly",
    image: "/product.png",
    rating: 4,
    reviews: 43,
    originalPrice: 78.66,
    discountPrice: 39.49,
    discountPercent: 50,
    isSpecialOffer: true,
  },
  {
    id: 2,
    name: "Iphone 13 Pro Max",
    description: "Perfect for gaming on the go",
    image: "/banner.png",
    rating: 5,
    reviews: 120,
    originalPrice: 399.99,
    discountPrice: 369.99,
    discountPercent: 30,
    isSpecialOffer: false,
  },
  {
    id: 3,
    name: "Ipad Air Max 4",
    description: "Perfect for gaming on the go",
    image: "/tablet.png",
    rating: 2,
    reviews: 120,
    originalPrice: 299.99,
    discountPrice: 269.99,
    discountPercent: 30,
    isSpecialOffer: false,
  },
  {
    id: 4,
    name: "Compact Wireless Controller",
    description: "Perfect for gaming on the go",
    image: "/product.png",
    rating: 4,
    reviews: 120,
    originalPrice: 99.99,
    discountPrice: 69.99,
    discountPercent: 30,
    isSpecialOffer: false,
  },
  // {
  //   id: 5,
  //   name: "Compact Wireless Controller",
  //   description: "Perfect for gaming on the go",
  //   image: "/product.png",
  //   rating: 5,
  //   reviews: 120,
  //   originalPrice: 99.99,
  //   discountPrice: 69.99,
  //   discountPercent: 30,
  //   isSpecialOffer: false,
  // },
  // {
  //   id: 6,
  //   name: "Compact Wireless Controller",
  //   description: "Perfect for gaming on the go",
  //   image: "/product.png",
  //   rating: 0,
  //   reviews: 120,
  //   originalPrice: 99.99,
  //   discountPrice: 69.99,
  //   discountPercent: 30,
  //   isSpecialOffer: false,
  // },
  // {
  //   id: 7,
  //   name: "Compact ",
  //   description: "Perfect for gaming on the go",
  //   image: "/product.png",
  //   rating: 1,
  //   reviews: 120,
  //   originalPrice: 99.99,
  //   discountPrice: 69.99,
  //   discountPercent: 30,
  //   isSpecialOffer: false,
  // },
  // {
  //   id: 8,
  //   name: "Compact Wireless Controller",
  //   description: "Perfect for gaming on the go",
  //   image: "/product.png",
  //   rating: 1.5,
  //   reviews: 120,
  //   originalPrice: 99.99,
  //   discountPrice: 69.99,
  //   discountPercent: 30,
  //   isSpecialOffer: false,
  // },
];

export const ProductList = () => {
  return (
    <div className="max-w-screen-xl mx-auto py-10 max-xl:p-10 max-md:p-3">
      <h2 className="text-2xl font-semibold mb-6 ">Best of Accessories</h2>
      <div className="grid grid-cols-4 max-xl:grid-cols-3 max-xl:gap-10 max-md:grid-cols-3 max-md:gap-5 max-mb_L:flex max-mb_L:flex-col max-mb_L:justify-center max-mb_L:items-center">
        {mockProducts.map((product, index) => (
          <ProductItem key={index} product={product} />
        ))}
      </div>
    </div>
  );
};
