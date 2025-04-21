import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useCart } from "../store/CartContext"
import "@fortawesome/fontawesome-free/css/all.min.css"
import { ProductList } from "../components/ProductList"

const ProductDetail = () => {
  const { productId } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [product, setProduct] = useState({
    dataProduct: null,
    dataSuggest: null
  })
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      try {
        const response = await fetch(`http://localhost:5000/api/products/${productId}`);
        const data = await response.json();
        
        if (response.ok) {
            setProduct(data)
        }

      } catch (error) {
        console.error("Error fetching product:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productId])

  useEffect(() => {
    console.log("ok")
  }, [])

  const handleAddToCart = () => {
    setIsAdding(true)

    if (product.dataProduct) {
      // Add product to cart with selected quantity
      console.log(quantity)
      addToCart({
        id: product.dataProduct.id,
        name: product.dataProduct.name,
        description: product.dataProduct.description,
        price: product.dataProduct.price,
        image: product.dataProduct.image,
        quantity: quantity,
      })
    }

    // Reset button state after animation
    setTimeout(() => {
      setIsAdding(false)
    }, 500)
  }

  const handleQuantityChange = (value) => {
    const newQuantity = Math.max(1, quantity + value)
    setQuantity(newQuantity)
  }

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating)
    const halfStar = rating % 1 !== 0
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0)

    return (
      <div className="flex text-orange-400">
        {[...Array(fullStars)].map((_, index) => (
          <i key={`full-${index}`} className="fa-solid fa-star"></i>
        ))}
        {halfStar && <i key="half" className="fa-solid fa-star-half-alt"></i>}
        {[...Array(emptyStars)].map((_, index) => (
          <i key={`empty-${index}`} className="fa-regular fa-star text-gray-300"></i>
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <p className="mb-6">Sorry, we couldn't find the product you're looking for.</p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Back to Shop
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <span className="hover:text-blue-600 cursor-pointer" onClick={() => navigate("/")}>
          Home
        </span>
        <span className="mx-2">/</span>
        <span className="hover:text-blue-600 cursor-pointer" onClick={() => navigate("/shop")}>
          Shop
        </span>
        <span className="mx-2">/</span>
        <span className="text-gray-800">{product.dataProduct.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Product Image */}
        <div className="bg-white rounded-lg p-4 flex items-center justify-center">
          <img src={product.dataProduct.image || "/placeholder.svg"} alt={product.dataProduct.name} className="max-h-[400px] object-contain" />
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-2xl font-bold mb-2">{product.dataProduct.name}</h1>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center">
              {renderStars(product.dataProduct.rating)}
              <span className="ml-2 text-gray-500 text-sm">({product.dataProduct.rating})</span>
            </div>
            {/* <span className="text-gray-500">|</span>
             <button className="flex items-center text-gray-500 hover:text-red-500">
              <i className="fa-regular fa-heart mr-1"></i>
              <span>Add to Wishlist</span>
            </button> */}
          </div>

          <div className="text-2xl font-bold mb-4">${product.dataProduct.price.toFixed(2)}</div>

          <p className="text-gray-600 mb-6">{product.dataProduct.description}</p>

          {/* Quantity Selector */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Quantity</label>
            <div className="flex items-center">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="px-3 py-1 border border-gray-300 rounded-l-md hover:bg-gray-100"
              >
                -
              </button>
              <span className="px-4 py-1 border-t border-b border-gray-300 min-w-[40px] text-center">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                className="px-3 py-1 border border-gray-300 rounded-r-md hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className={`flex-1 py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all ${
                isAdding ? "bg-blue-600 text-white" : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {isAdding ? (
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24">
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <>
                  <i className="fa-solid fa-bag-shopping"></i>
                  Add to Cart
                </>
              )}
            </button>

            {/* <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
              <i className="fa-solid fa-share-nodes"></i>
            </button> */}
          </div>

          {/* Features */}
          {/* <div className="border-t pt-6">
            <h3 className="font-semibold mb-2">Summary:</h3>
            <ul className="list-disc pl-5 space-y-1">
                <li className="text-gray-600">
                    Brand: {product.dataProduct.brand}
                </li>
                <li className="text-gray-600">
                    Brand: {product.dataProduct.s}
                </li>
            </ul>
          </div> */}
        </div>
      </div>

      {/* Product Specifications */}
      <div className="bg-gray-50 p-6 rounded-lg mb-12">
        <h2 className="text-xl font-bold mb-4">Product Specifications</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-b pb-2">
              <span className="font-medium text-gray-700 capitalize">Size screen: </span>
              <span className="text-gray-600">{product.dataProduct.sizeScreen} inches</span>
            </div>
            <div className="border-b pb-2">
              <span className="font-medium text-gray-700 capitalize">Brand: </span>
              <span className="text-gray-600">{product.dataProduct.brand}</span>
            </div>
        </div>
      </div>

      {/* Related Products Section */}
      <div>
        <h2 className="text-xl font-bold mb-6">You May Also Like</h2>
          <ProductList isHome={false} productList={product.dataSuggest.filter(item => item.id !== product.dataProduct.id).slice(0,4)} />
      </div>
    </div>
  )
}

export default ProductDetail
