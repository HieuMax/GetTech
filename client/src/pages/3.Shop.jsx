import React, { useEffect, useState } from "react";
import { ProductList } from "../components/ProductList";
import InfiniteScroll from "react-infinite-scroll-component";

export const Shop = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  const queryParams = new URLSearchParams(window.location.search);
  const brand = queryParams.get("brand");
  const search = queryParams.get("search");

  const fetchProducts = async (page) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/home/phones?page=${page}&limit=8`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      let filteredProducts = data.phones;

      if (brand) {
        filteredProducts = filteredProducts.filter((product) =>
          product.brand.toLowerCase().includes(brand.toLowerCase())
        );
      }

      if (search) {
        filteredProducts = filteredProducts.filter((product) =>
          product.name.toLowerCase().includes(search.toLowerCase())
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
  }, [page]);

  const loadMoreProducts = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div>
      {error && <div className="text-center text-red-500">Error: {error}</div>}
      {products.length === 0 && !hasMore ? (
        <div className="text-center py-5">No products available</div>
      ) : (
        <InfiniteScroll
          dataLength={products.length}
          next={loadMoreProducts}
          hasMore={hasMore}
          loader={
            <div className="text-center py-5">Loading more products...</div>
          }
        >
          <ProductList isHome={false} productList={products} />
        </InfiniteScroll>
      )}
    </div>
  );
};
