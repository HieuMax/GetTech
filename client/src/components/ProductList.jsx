import React from "react";
import { ProductItem } from "./ProductItem";

export const ProductList = ({ productList, isHome }) => {
  return (
    <div className="max-w-screen-xl mx-auto py-10 max-xl:p-10 max-md:p-3 ">
      {isHome && (
        <h2 className="text-2xl font-semibold mb-6">Best of Accessories</h2>
      )}
      <div className="grid grid-cols-4 max-xl:grid-cols-3 max-xl:gap-10 max-md:grid-cols-3 max-md:gap-5 max-mb_L:flex max-mb_L:flex-col max-mb_L:justify-center max-mb_L:items-center w-full">
        {productList?.map((product, index) => (
          <ProductItem key={index} product={product} />
        ))}
      </div>
    </div>
  );
};
