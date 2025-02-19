import React from 'react'
import { FaUser, FaShoppingCart, FaSearch, FaHeart } from 'react-icons/fa'; // Example icons from FontAwesome
import { IoListOutline } from 'react-icons/io5';

const categories = [ "All Categories", "Electronics", "Fashion", "Home", "Books" ]

export const NavBar = ({props}) => {
//  console.log(props)
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
                <div className="p-2 bg-gray-200 rounded cursor-pointer">
                    <FaHeart className="text-xl" />
                </div>
                <div className="p-2 bg-gray-200 rounded cursor-pointer">
                    <FaUser className="text-xl" />
                </div>
                <div className="p-2 bg-gray-200 rounded cursor-pointer">
                    <FaShoppingCart className="text-xl" />
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
