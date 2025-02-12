import React from 'react'
import { FaChevronDown } from 'react-icons/fa'; // Import down arrow icon from FontAwesome

const navigators = [
  { label: "Deals", link: "#" },
  { label: "Home", link: "#" },
  { label: "iPhone", link: "#", children: [
    { label: "iPhone 12", link: "#" },
    { label: "iPhone 13", link: "#" },
    { label: "iPhone 14", link: "#" }
  ]},
  { label: "Samsung", link: "#", children: [
    { label: "Galaxy S21", link: "#" },
    { label: "Galaxy S22", link: "#" },
    { label: "Galaxy S23", link: "#" }
  ]},
  { label: "iPads", link: "#", children: [
    { label: "iPad Pro", link: "#" },
    { label: "iPad Air", link: "#" },
    { label: "iPad Mini", link: "#" }
  ]},
  { label: "Computers", link: "#" },
  { label: "Clearance", link: "#" },
  { label: "Sell", link: "#" },
  { label: "Contact Us", link: "#" }
]

export const Navigation = () => {
  return (
    <div className="max-w-[1280px] mx-auto text-white py-2">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-5 font-semibold transition-all duration-500">
          {navigators.map((nav, index) => (
            <div key={index} className="relative group">
              <a href={nav.link} className="hover:underline p-2 flex items-center gap-1">
                {nav.label} {nav.children && <FaChevronDown />}
              </a>
              {nav.children && (
                <div className="absolute hidden group-hover:block bg-white text-black rounded shadow-lg z-10">
                  {nav.children.map((child, childIndex) => (
                    <a key={childIndex} href={child.link} className="block px-4 py-2 text-nowrap hover:bg-gray-200">
                      {child.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}