import React from 'react'
import Slider from 'react-slick'
import { FaHeadphones, FaMobileAlt, FaKeyboard, FaLaptop, FaDesktop, FaUsb, FaMouse, FaPrint } from 'react-icons/fa'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

const accesses = [
  { icon: <FaHeadphones size={25} />, label: "Headphones", link: "" },
  { icon: <FaMobileAlt size={25} />, label: "iPhone", link: "" },
  { icon: <FaKeyboard size={25} />, label: "Keyboards", link: "" },
  { icon: <FaLaptop size={25} />, label: "Laptops", link: "" },
  { icon: <FaDesktop size={25} />, label: "Monitors", link: "" },
  { icon: <FaUsb size={25} />, label: "Pendrives", link: "" },
  { icon: <FaMouse size={25} />, label: "Mouses", link: "" },
  { icon: <FaPrint size={25} />, label: "Printers", link: "" }
]

export const QuickAccess = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    centerPadding: '30px',
  }

  return (
    <div className="my-5 max-w-[1280px] mx-auto pb-3">
      <Slider {...settings} className='p-2 gap-x-4 '>
        {accesses.map((access, index) => (
          <div key={index} className="p-3 my-3 bg-white shadow flex items-center gap-2 hover:bg-gray-100 rounded-xl">
            <span>{access.icon}</span>
            <span>{access.label}</span>
          </div>
        ))}
      </Slider>
    </div>
  )
}

const SampleNextArrow = (props) => {
  const { className, style, onClick } = props
  return (
    <div
      className={className}
      style={{ ...style, display: "flex", background: "#6b7280", borderRadius: "50%", textAlign: "center", justifyContent: "center", alignItems: "center" }}
      onClick={onClick}
    />
  )
}

const SamplePrevArrow = (props) => {
  const { className, style, onClick } = props
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "#6b7280", borderRadius: "50%" }}
      onClick={onClick}
    />
  )
}