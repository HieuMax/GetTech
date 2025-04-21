import React from 'react'
import { FaUser, FaShoppingCart, FaSearch, FaHeart, FaSignOutAlt } from 'react-icons/fa'; // Example icons from FontAwesome
import { IoListOutline } from 'react-icons/io5';
import { CgClose, CgLogOut } from 'react-icons/cg';
import { FaChevronDown } from 'react-icons/fa'; // Import down arrow icon from FontAwesome
import { Link } from 'react-router-dom';
import CartIcon from '../CartIcon';
import { useAuth } from '../../store/AuthContext';

const navigators = [
  { label: "Home", link: "/" },
  { label: "Shop", link: "/shop" },
  { label: "Phone", link: "#", children: [
    { label: "iPhone 12", link: "#" },
    { label: "iPhone 13", link: "#" },
    { label: "iPhone 14", link: "#" }
  ]},
  { label: "Tablet", link: "#", children: [
    { label: "Galaxy S21", link: "#" },
    { label: "Galaxy S22", link: "#" },
    { label: "Galaxy S23", link: "#" }
  ]},
  { label: "Laptop", link: "#", children: [
    { label: "iPad Pro", link: "#" },
    { label: "iPad Air", link: "#" },
    { label: "iPad Mini", link: "#" }
  ]},
  { label: "Accesstories", link: "#" },
  { label: "Contact Us", link: "#" }
]
const categories = [ "All Categories", "Phone", "Laptop", "Tablet", "Accessories" ]

export const NavBar = ({props}) => {
//  console.log(props)
    const { logout, isAuthenticated } = useAuth();

  return (
    <div className='my-5 flex flex-col gap-5'>
        <div className="flex items-center justify-between font-semibold">
            <div className=" flex items-center gap-3 cursor-pointer" onClick={() => window.location.href = '/'}>
                <img src="/logo.png" alt="Logo" />
                <h1 className='text-3xl'>GetTech</h1>
            </div>
            <div className="flex-grow mx-5 flex items-center gap-0 border border-gray-300 rounded max-md:hidden">
                <select className="p-2 border-r border-gray-300 rounded-l">
                    {
                        categories.map((item) => {
                            return <option key={item} value={item}>{item}</option>
                        })
                    }
                </select>
                <input 
                    type="text" 
                    placeholder="Search..." 
                    className="w-full p-2 rounded-r"
                />
                <button className="p-2">
                    <FaSearch className="text-xl" />
                </button>
            </div>
            <div className="flex items-center gap-3">
                {/* <div className="p-2 bg-gray-200 rounded cursor-pointer">
                    <FaHeart className="text-xl" />
                </div> */}
                <Link to={'/login'} className="p-2 bg-gray-200 rounded cursor-pointer">
                    <FaUser className="text-xl" />
                </Link>
                <div className="p-2 bg-gray-200 rounded cursor-pointer"> 
                    <CartIcon />
                </div>
                <div className="p-2 bg-gray-200 rounded cursor-pointer hidden max-md:flex z-100" onClick={() => props.expFunc()}>
                    <IoListOutline className="text-xl" />
                </div>
          </div>
        </div>
        <div className="flex-grow mx-5 items-center gap-0 border border-gray-300 rounded hidden max-md:flex">
            <select className="p-2 border-r border-gray-300 rounded-l">
                {
                    categories.map((item) => {
                        return <option key={item} value={item}>{item}</option>
                    })
                }
            </select>
            <input 
                type="text" 
                placeholder="Search..." 
                className="w-full p-2 rounded-r"
            />
            <button className="p-2">
                <FaSearch className="text-xl" />
            </button>
        </div>
    </div>
  )
}

export const Navigation = ({ props }) => {
    return (
        
        <div className="max-w-[1280px] mx-auto text-white py-2 transition-all">
            {/* md+ screen */}
            <div className="container mx-auto flex items-center justify-between max-md:hidden"> 
                <div className="flex items-center gap-16 font-semibold transition-all duration-500">
                {navigators.map((nav, index) => (
                    <div key={index} className="relative group">
                    <Link to={nav.link} className="hover:underline py-2 flex items-center gap-1">
                        {nav.label} {nav.children && <FaChevronDown />}
                    </Link>
                    {nav.children && (
                        <div className="absolute hidden group-hover:block bg-white text-black rounded shadow-lg z-10">
                        {nav.children.map((child, childIndex) => (
                            <Link key={childIndex} to={child.link} className="block px-4 py-2 text-nowrap hover:bg-gray-200">
                            {child.label}
                            </Link>
                        ))}
                        </div>
                    )}
                    </div>
                ))}
                </div>
            </div>

            {/* mobile - tablet */}
            <div className={`container overflow-hidden transition-all duration-500  hidden max-md:flex mx-auto items-center justify-between ${props? "w-32": "w-0"}`}>
                <div className="flex flex-col items-center gap-5 font-semibold w-full">
                {/* Close button */}
                <div className={`flex justify-end absolute right-2  ${props? "w-32": "w-0"}`}>
                    <CgClose className='cursor-pointer' size={25} onClick={() => props.expFunc()}/>
                </div>
                <br />
                {navigators.map((nav, index) => (
                    <div key={index} className="relative group w-full ">
                    <a href={nav.link} className={`hover:underline py-2 flex items-center gap-1 `}>
                        {nav.label} {nav.children && <FaChevronDown />}
                    </a>
                    {nav.children && (
                        <div className="absolute -left-3 hidden group-hover:block bg-white text-black rounded shadow-lg z-10">
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