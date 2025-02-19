import React from 'react'

const PoweredSection = () => {
  return (
    <section className="flex flex-col items-center justify-center py-24 xl:pt-14 pt-3">
      <p className="text-gray-500 text-base mb-8">These brands powered by us</p>
      <div className="flex items-center justify-center flex-wrap space-x-24 max-xl:grid-cols-3 max-xl:grid max-xl:space-x-10 max-xl:gap-5">
        <div className="xl:w-1/11 flex justify-center">
          <img src="/tuple.png"  className="xl:w-full w-1/2 max-lg:w-2/3 max-md:w-full " />
        </div>
        <div className="xl:w-1/11 flex justify-center">
          <img src="/mirage.png"  className="xl:w-full w-1/2 max-lg:w-2/3 max-md:w-full " />
        </div>
        <div className="xl:w-1/11 flex justify-center">
          <img src="/statickit.png"  className="xl:w-full w-1/2 max-lg:w-2/3 max-md:w-full " />
        </div>
        <div className="xl:w-1/11 flex justify-center">
          <img src="/transistor.png"  className="xl:w-full w-1/2 max-lg:w-2/3 max-md:w-full " />
        </div>
        <div className="xl:w-1/11 flex justify-center">
          <img src="/workcation.png"  className="xl:w-full w-1/2 max-lg:w-2/3 max-md:w-full " />
        </div>
      </div>
    </section>
  )
}

export default PoweredSection
