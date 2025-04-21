import React, { useEffect, useState } from "react";
import { ProductList } from "../components/ProductList";
import InfiniteScroll from "react-infinite-scroll-component";
import { FaSearch } from "react-icons/fa";

export const Shop = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const [filterSearchBox, setFilterSearchBox] = useState("");

  const queryParams = new URLSearchParams(window.location.search);
  const cate = queryParams.get("cate");

  // State cho bộ lọc
  const [filters, setFilters] = useState({
    brand: "",
    minPrice: "",
    maxPrice: "",
  });

  // CHECK ID PRODUCT
  const getCategoryFromId = (productId) => {
    if (productId.includes("MOBL")) return "Phone";
    if (productId.includes("LAPT")) return "Laptop";
    if (productId.includes("TABL")) return "Tablet";
    if (productId.includes("ACCE")) return "Accessories";
    return "other";
  };

  const fetchProducts = async (page) => {
    try {
      const isFiltersEmpty =
        !filters.brand &&
        !filters.minPrice &&
        !filters.maxPrice &&
        !filterSearchBox;

      let response;

      if (!cate && isFiltersEmpty) {
        response = await fetch(
          `http://localhost:5000/api/home/phones?page=${page}&limit=8`
        );
        setHasMore(true);
      } else {
        setHasMore(false);

        response = await fetch(`http://localhost:5000/api/home/phones`);
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      let filteredProducts = data.phones;

      // Filter by category if specified
      console.log(filteredProducts);
      if (cate) {
        filteredProducts = filteredProducts.filter((product) => {
          const productCategory = getCategoryFromId(product.id);
          return productCategory === cate;
        });
      }

      // Lọc theo thương hiệu
      if (filters.brand) {
        filteredProducts = filteredProducts.filter((product) =>
          product.brand.toLowerCase().includes(filters.brand.toLowerCase())
        );
      }

      // Lọc theo giá
      if (filters.maxPrice) {
        filteredProducts = filteredProducts.filter(
          (product) => product.price <= parseFloat(filters.maxPrice)
        );
      }
      if (filters.minPrice) {
        filteredProducts = filteredProducts.filter(
          (product) => product.price >= parseFloat(filters.minPrice)
        );
      }

      // Lọc theo từ khóa tìm kiếm
      if (filterSearchBox) {
        filteredProducts = filteredProducts.filter((product) =>
          product.name.toLowerCase().includes(filterSearchBox.toLowerCase())
        );
      }

      setProducts((prevProducts) => [...prevProducts, ...filteredProducts]);

      if (data.phones.length < 8) {
        setHasMore(false);
      }
    } catch (err) {
      setError(err.message);
      setHasMore(false);
    }
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page, filters]);

  const loadMoreProducts = () => {
    setPage((prevPage) => prevPage + 1);
  };

  // Xử lý thay đổi bộ lọc
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setProducts([]);
    setPage(1);
    setHasMore(false);
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  return (
    <div>
      {/* Bộ lọc */}
      <div className="bg-gradient-to-b from-gray-50 to-white rounded-xl shadow-lg border border-gray-100 p-6 transition-all duration-300 hover:shadow-xl">
        {/* Search Box */}
        <div className="relative mb-6 max-md:hidden">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-4 pr-12 py-3 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200 outline-none text-gray-700"
            onChange={(e) => setFilterSearchBox(e.target.value)}
            value={filterSearchBox}
          />
          <button
            className="absolute right-0 top-0 h-full px-4 text-gray-500 hover:text-blue-500 transition-colors duration-200"
            onClick={() => {
              setProducts([]);
              fetchProducts(1);
            }}>
            <FaSearch className="text-xl" />
          </button>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            {/* Brand Filter */}
            <div className="flex flex-col md:flex-row md:items-center space-y-1 md:space-y-0 md:space-x-2">
              <label className="text-sm font-medium text-gray-700">Brand</label>
              <select
                name="brand"
                value={filters.brand}
                onChange={handleFilterChange}
                className="bg-white border border-gray-200 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200">
                <option value="">All Brands</option>
                <option value="Apple">Apple</option>
                <option value="Samsung">Samsung</option>
                <option value="Xiaomi">Xiaomi</option>
                <option value="Oppo">Oppo</option>
                <option value="Vivo">Vivo</option>
              </select>
            </div>

            {/* Price Range Filters */}
            <div className="flex flex-col md:flex-row md:items-center space-y-1 md:space-y-0 md:space-x-2">
              <label className="text-sm font-medium text-gray-700">
                Price Range
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  placeholder="Min"
                  className="bg-white border border-gray-200 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200 w-24 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="text-gray-400">—</span>
                <input
                  type="number"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  placeholder="Max"
                  className="bg-white border border-gray-200 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200 w-24 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>
          </div>

          {/* Reset Button */}
          <button
            onClick={() => {
              setFilters({ brand: "", minPrice: "", maxPrice: "" });
              setFilterSearchBox("");
              setProducts([]);
              setPage(1);
              setHasMore(true);
            }}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2.5 px-5 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-md hover:shadow-lg font-medium">
            Reset Filters
          </button>
        </div>

        {/* Active Filters Display - Optional enhancement */}
        {(filters.brand ||
          filters.minPrice ||
          filters.maxPrice ||
          filterSearchBox) && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs font-medium text-gray-500">
                Active filters:
              </span>

              {filterSearchBox && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                  Search: {filterSearchBox}
                </span>
              )}

              {filters.brand && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                  Brand: {filters.brand}
                </span>
              )}

              {(filters.minPrice || filters.maxPrice) && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                  Price: {filters.minPrice || "0"} — {filters.maxPrice || "∞"}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
      {/* Nội dung */}
      <div className="content">
        {error && (
          <div className="text-center text-red-500">Error: {error}</div>
        )}
        {products.length === 0 && !hasMore ? (
          <div className="text-center py-5">No products available</div>
        ) : (
          <InfiniteScroll
            dataLength={products.length}
            next={loadMoreProducts}
            hasMore={hasMore}
            loader={
              <div className="text-center py-5">Loading more products...</div>
            }>
            <ProductList isHome={false} productList={products} />
          </InfiniteScroll>
        )}
      </div>
    </div>
  );
};
