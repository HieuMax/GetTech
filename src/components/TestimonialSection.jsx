import React from 'react'
import Slider from 'react-slick'

const TestimonialSection = () => {


    const TestimonialsData = [
        {
          id: 1,
          name: "John Doe",
          text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque reiciendis inventore iste ratione ex alias quis magni at optio",
          img: "https://picsum.photos/101/101",
          rating: 3,
          role: "CEO at Company",
          delay: 0.2,
        },
        {
          id: 2,
          name: "Steve Smith",
          text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque reiciendis inventore iste ratione ex alias quis magni at optio",
          img: "https://picsum.photos/102/102",
          rating: 5,
          role: "CEO at Company",
          delay: 0.5,
        },
        {
          id: 3,
          name: "Kristen",
          text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque reiciendis inventore iste ratione ex alias quis magni at optio",
          img: "https://picsum.photos/104/104",
          rating: 4,
          role: "CEO at Company",
          delay: 0.8,
        },
      ];
      

    const setting = {
        dots: true,
        arrow: false,
        infinite: true,
        speed: 500,
        slidesToScroll: 1,
        // autoplay: true,
        autoplaySpeed: 2000,
        cssEase: 'linear',
        pauseOnHover: true,
        pauseOnFocus: true,
        responsive: [
            {
                breakpoint: 10000,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    infinite: true,
                }
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    initialSlide: 2
                }
            },
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            }]
    };

  return (
    <div className='py-14 mb-10'>
        {/* Header section */}
        <div className='space-y-4 p-6 mb-6 text-center max-w-[600px] mx-auto'>
            <h1 className='font-bold text-[#2E3849] text-3xl'>
                Testimonials
            </h1>
            <p className='font-normal text-xl'>
                See what customers and suppliers say about our products
            </p>
        </div>
        {/* Testimonial cards section */}
        <div >
                <Slider {...setting} style={{ display: "flex", flexDirection: "column" }}>
                    {
                        TestimonialsData.map((item) => {
                            return (
                                <div key={item.id} className="bg-[#344054] text-white p-6 rounded-xl shadow-lg w-80">
                                {/* Điểm số và sao */}
                                <div className="flex flex-col items-start text-lg font-semibold">
                                    <span>{item.rating}</span>
                                    <div className="flex gap-1">
                                        {[...Array(5)].map((_, index) => (
                                            <span key={index} className={index < Math.round(item.rating) ? "text-[#EEF3F8]" : "text-gray-500"}>★</span>
                                        ))}
                                    </div>
                                </div>
                            
                                {/* Nội dung đánh giá */}
                                <div >
                                    <svg width="80" height="80" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                        <text y="120" font-size="70" fill="orange" font-family="Arial, sans-serif">“</text>
                                    </svg>
                                    <p className="text-white leading-7 tracking-wider text-base">{item.text}</p>
                                </div>
                            
                                {/* Avatar, tên và chức danh */}
                                <div className="flex items-center mt-12 space-x-3">
                                    {item.img ? (
                                        <img src={item.img} className="w-10 h-10 rounded-full border-2" alt={item.name} />
                                    ) : (
                                        <div className="w-10 h-10 flex items-center justify-center bg-blue-600 rounded-full text-white font-semibold">
                                            {item.name?.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-medium">{item.name}</p>
                                        <p className="text-gray-400 text-sm">{item.role}</p>
                                    </div>
                                </div>
                            </div>
                            
                            )
                        })
                    }
                </Slider>
        </div>
    </div>
  )
}

export default TestimonialSection
