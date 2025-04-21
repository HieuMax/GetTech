import { ProductList } from "../components/ProductList";
import { Banner } from "../components/ui/Banner";
import { useState, useEffect } from "react";

const services = [
  {
    iconClass: "fa-solid fa-truck",
    title: "Free Shipping",
    description: "For invoices over $1,500",
  },
  {
    iconClass: "fa-solid fa-rotate",
    title: "Easy Returns",
    description: "For invoices over $1,500",
  },
  {
    iconClass: "fa-solid fa-rocket",
    title: "Fast Delivery",
    description: "For invoices over $1,500",
  },
  {
    iconClass: "fa-solid fa-truck",
    title: "Free Shipping",
    description: "For invoices over $1,500",
  },
];

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Fetching products...");
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/home/phones?page=1&limit=8`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data.phones);
        setProducts(data.phones);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <Banner />
      <div className="flex justify-between py-10 max-lg:grid-cols-2 max-lg:grid max-lg:gap-5 max-lg:px-5">
        {services.map((service, index) => (
          <div
            key={index}
            className="flex items-center gap-3 border rounded-xl px-5 py-4 shadow-sm bg-white">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#F2F4F7]">
              <i className={`${service.iconClass} text-gray-500 text-xl`}></i>
              <i className={` text-gray-500 text-xl`}></i>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">{service.title}</h4>
              <p className="text-sm text-gray-500">{service.description}</p>
            </div>
          </div>
        ))}
      </div>
      {loading ? (
        <div className="text-center py-10">Loading products...</div>
      ) : error ? (
        <div className="text-center py-10 text-red-500">Error: {error}</div>
      ) : (
        <ProductList isHome={true} productList={products} />
      )}
    </div>
  );
};

export default HomePage;
