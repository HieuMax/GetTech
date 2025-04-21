import React, { useState } from "react";
import { FaUser, FaShoppingCart, FaSearch } from "react-icons/fa"; // Example icons from FontAwesome
import { IoListOutline } from "react-icons/io5";
import { CgClose } from "react-icons/cg";
import { FaChevronDown } from "react-icons/fa"; // Import down arrow icon from FontAwesome
import { Link, useNavigate } from "react-router-dom";
import CartIcon from "../CartIcon";
import { useAuth } from "../../store/AuthContext";

const navigators = [
  { label: "Home", link: "/" },
  { label: "Shop", link: "/shop" },
  // { label: "Phone", link: `/shop?cate=phone`, },
  // { label: "Tablet", link: `/shop?cate=tablet`, },
  // { label: "Laptop", link: `/shop?cate=laptop`, },
  // { label: "Accesstories", link: `/shop?cate=accesstories` },
  { label: "Contact Us", link: "#" },
];

export const NavBar = ({ props }) => {
  // const [filterCategory, setFilterCategory] = useState("");
  // const [filterSearchBox, setFilterSearchBox] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="my-5 flex flex-col gap-5">
      <div className="flex items-center justify-between font-semibold">
        <div
          className=" flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/")}>
          <img src="/logo.png" alt="Logo" />
          <h1 className="text-3xl">GetTech</h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to={`${
              user ? (user.role === "admin" ? "/admin" : "/profile") : "/login"
            }`}
            className="p-2 bg-gray-200 rounded cursor-pointer">
            <FaUser className="text-xl" />
          </Link>
          <div className="p-2 bg-gray-200 rounded cursor-pointer">
            {/* <FaShoppingCart className="text-xl" /> */}
            <CartIcon />
          </div>
          <div
            className="p-2 bg-gray-200 rounded cursor-pointer hidden max-md:flex z-100"
            onClick={() => props.expFunc()}>
            <IoListOutline className="text-xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const Navigation = ({ props }) => {
  return (
    <div className="max-w-[1280px] mx-auto text-white py-2 transition-all">
      {/* md+ screen */}
      <div className="container mx-auto flex items-center justify-between max-md:hidden">
        <div className="flex items-center gap-16 font-semibold transition-all duration-500">
          {navigators.map((nav, index) => (
            <Link key={index} className="relative group hover:underline py-2 flex items-center gap-1" to={nav.link}>
              {nav.label}
            </Link>
          ))}
        </div>
      </div>

      {/* mobile - tablet */}
      <div
        className={`container overflow-hidden transition-all duration-500  hidden max-md:flex mx-auto items-center justify-between ${
          props ? "w-32" : "w-0"
        }`}>
        <div className="flex flex-col items-center gap-5 font-semibold w-full">
          {/* Close button */}
          <div
            className={`flex justify-end absolute right-2  ${
              props ? "w-32" : "w-0"
            }`}>
            <CgClose
              className="cursor-pointer"
              size={25}
              onClick={() => props.expFunc()}
            />
          </div>
          <br />
          {navigators.map((nav, index) => (
            <div key={index} className="relative group w-full ">
              <a
                href={nav.link}
                className={`hover:underline py-2 flex items-center gap-1 `}>
                {nav.label} {nav.children && <FaChevronDown />}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
