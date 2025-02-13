import React from "react";

export const Banner = () => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const item = [
    {
      title: "Refurbished iPhones",
      description:
        "Smooth, responsive Super Retina XDR display with ProMotion.",
      isSpecial: true,
    },
    {
      title: "Refurbished iPhones 2",
      description:
        "Smooth, responsive Super Retina XDR display with ProMotion 2.",
      isSpecial: false,
    },
  ];

  // const handleNext = () => {
  //     setCurrentIndex((prevIndex) => (prevIndex + 1) % item.length);
  // };

  // const handlePrev = () => {
  //     setCurrentIndex(
  //         (prevIndex) => (prevIndex - 1 + item.length) % item.length
  //     );
  // };

  return (
    <div className="flex py-10  justify-between border border-[#F2F4F7] rounded-xl">
      <div className="relative mt-20 ml-12 max-w-[443px]">
        {item[currentIndex].isSpecial && (
          <div className="text-xs text-white bg-[#12B76A] py-[2px] px-2 w-fit rounded-2xl absolute">
            Special offers
          </div>
        )}
        <h2 className="text-[#1D2939] pt-14 text-5xl font-semibold">
          {item[currentIndex].title}
        </h2>
        <p className="text-xl py-6 text-[#667085]">
          {item[currentIndex].description}
        </p>
        <button className="py-[10px]  px-[18px] bg-[#1570EF] text-base  text-white rounded-lg">
          Shop now
        </button>
        {/* vi tri nut  tron */}
        <div className="flex space-x-2 mt-20">
          {item.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full border border-[#667085] ${
                currentIndex === index ? "bg-[#667085]" : "bg-white"
              }`}></button>
          ))}
        </div>
        {/* end */}
      </div>
      <img className="mt-20 mr-12" src="/banner.png" alt="" />
    </div>
  );
};
