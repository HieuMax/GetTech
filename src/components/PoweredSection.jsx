import React from 'react'

const PoweredSection = () => {
  return (
    <section className="flex flex-col items-center justify-center py-24 pt-14">
      <p className="text-gray-500 text-base mb-8">These brands powered by us</p>
      <div className="flex items-center justify-center flex-wrap space-x-24">
        <img src="/tuple.png"  className="w-1/12" />
        <img src="/mirage.png"  className="w-1/12" />
        <img src="/statickit.png"  className="w-1/12" />
        <img src="/transistor.png"  className="w-1/12" />
        <img src="/workcation.png"  className="w-1/12" />
      </div>
    </section>
  )
}

export default PoweredSection
