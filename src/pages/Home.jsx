import React, { Suspense, lazy } from "react";
import FadeInSection from "../components/shared/FadeInSection";

// Lazy load your components if desired
const Banner = lazy(() =>
  import("../components/home/banner").then(module => ({ default: module.Banner }))
);
const Services = lazy(() =>
  import("../components/home/services").then(module => ({ default: module.Services }))
);
const ProductList = lazy(() =>
  import("../components/home/productList").then(module => ({ default: module.ProductList }))
);
const BestSellerSection = lazy(() =>
  import('../components/BestSellersSection').then(module => ({ default: module.default }))
);
const TestimonialSection = lazy(() =>
  import('../components/TestimonialSection').then(module => ({ default: module.default }))
);
const PoweredSection = lazy(() =>
  import('../components/PoweredSection').then(module => ({ default: module.default }))
);

export const Home = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="overflow-hidden">
        <FadeInSection>
          <Banner />
        </FadeInSection>
        <FadeInSection>
          <Services />
        </FadeInSection>
        <FadeInSection>
          <ProductList />
        </FadeInSection>
        <FadeInSection>
          <BestSellerSection />
        </FadeInSection>
        <FadeInSection>
          <TestimonialSection />
        </FadeInSection>
        <FadeInSection>
          <PoweredSection />
        </FadeInSection>
      </div>
    </Suspense>
  );
};
