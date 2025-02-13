import React from "react";
import { Banner } from "../components/home/banner";
import { Services } from "../components/home/services";
import { ProductItem } from "../components/shared/ProductItem";
import { ProductList } from "../components/home/productList";

export const Home = () => {
  return (
    <div>
      <Banner></Banner>
      <Services />
      <ProductList />
    </div>
  );
};
