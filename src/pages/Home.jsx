import React from "react";
import { Banner } from "../components/home/banner";
import { Services } from "../components/home/services";
import { ProductItem } from "../components/shared/ProductItem";
import { ProductList } from "../components/home/productList";
import BestSellerSection from '../components/BestSellersSection'
import TestimonialSection from '../components/TestimonialSection'
import PoweredSection from '../components/PoweredSection'

export const Home = () => {
  return (
    <div>
      <Banner></Banner>
      <Services />
      <ProductList />
      <BestSellerSection />
      <TestimonialSection />
      <PoweredSection />
    </div>
  );
};
