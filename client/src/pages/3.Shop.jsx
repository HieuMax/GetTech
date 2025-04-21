import React, { useEffect, useState, useMemo } from "react";
import { ProductList } from "../components/ProductList";
import { useCart } from '../store/CartContext';
import { useAuth } from '../store/AuthContext';
import { FaSearch, FaFilter } from 'react-icons/fa';

export function Shop() {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 8;
  const [visibleItems, setVisibleItems] = useState(itemsPerPage);

  // Filter products using useMemo to prevent unnecessary recalculations
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBrand = !brandFilter || product.brand === brandFilter;
      const matchesPrice = !priceFilter || (
        priceFilter === 'low' && product.price < 1000 ||
        priceFilter === 'medium' && product.price >= 1000 && product.price < 2000 ||
        priceFilter === 'high' && product.price >= 2000
      );
      return matchesSearch && matchesBrand && matchesPrice;
    });
  }, [products, searchQuery, brandFilter, priceFilter]);

  // Get unique brands
  const brands = useMemo(() => [...new Set(products.map(product => product.brand))], [products]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/phones');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.scrollHeight - 130
      ) {
        setVisibleItems((prev) => {
          const newValue = Math.min(prev + itemsPerPage, filteredProducts.length);
          console.log('Current visible items:', newValue);
          return newValue;
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [filteredProducts.length, itemsPerPage]);

  // Reset visible items when filters change
  useEffect(() => {
    setVisibleItems(itemsPerPage);
  }, [brandFilter, priceFilter, searchQuery, itemsPerPage]);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search and Filters */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <FaFilter />
            Filters
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                <select
                  value={brandFilter}
                  onChange={(e) => setBrandFilter(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Brands</option>
                  {brands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <select
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Prices</option>
                  <option value="low">Under $1000</option>
                  <option value="medium">$1000 - $2000</option>
                  <option value="high">Over $2000</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Products Grid */}
      {error && <div className="text-center text-red-500">Error: {error}</div>}
      {products.length === 0 ? (
        <div className="text-center py-5">No products available</div>
      ) : (
        <ProductList isHome={false} productList={filteredProducts.slice(0, visibleItems)} />
      )}

      {/* Load More Indicator */}
      {visibleItems < filteredProducts.length && (
        <div className="text-center mt-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading more items...</p>
        </div>
      )}
    </div>
  );
}
