import React from "react";
import Button from "./Button";


const BestSellersSection = () => {
  return (
    <div className="py-6 px-3 space-y-6">
      {/* Top Banner */}
      <div className="relative bg-gradient-to-r from-[#53389E] to-[#6941C6] h-[400px] text-white p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between">
        <div className="flex-1 max-w-md">
          <h2 className="text-3xl font-bold">Best sellers month</h2>
          <p className="mt-2 mb-4 text-lg">Smooth, responsive Super Retina XDR display with ProMotion.</p>
          <Button text="Shop now" bgColor="bg-white" textColor="text-purple-700" />
        </div>
        <div className="w-1/2 flex justify-center items-center  relative">
          <img
            src="/watch.png" 
            alt="Smart Watch"
            className="w-3/4 mt-6 md:mt-0 object-cover "
          />
        </div>
        
      </div>
      
      {/* Bottom Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative bg-gradient-to-r from-[#5C6879] to-[#C1C5CF] text-white p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between">
          <div className="flex-1 max-w-md">
            <h2 className="text-2xl font-bold">Best sellers</h2>
            <p className="mt-2 mb-4 text-lg">Smooth, responsive Super Retina XDR display with ProMotion.</p>
            <Button text="Learn more" bgColor="bg-white" textColor="text-gray-700" />
          </div>
          <img
            src="/laptop.png" 
            alt="Laptop"
            className="w-48 md:w-64 lg:w-80 mt-6 md:mt-0"
          />
        </div>
        
        <div className="relative bg-gradient-to-r from-[#7E9BD4] to-[#B6C2DA] text-white p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between">
          <div className="flex-1 max-w-md">
            <h2 className="text-2xl font-bold">Best sellers</h2>
            <p className="mt-2 mb-4 text-lg">Smooth, responsive Super Retina XDR display with ProMotion.</p>
            <Button text="Learn more" bgColor="bg-white" textColor="text-blue-400" />
          </div>
          <img
            src="/tablet.png" 
            alt="Tablet"
            className="w-48 md:w-64 lg:w-80 mt-6 md:mt-0"
          />
        </div>
      </div>
    </div>
  );
};

export default BestSellersSection;
