import { useEffect, useRef } from "react"
import { useCart } from "../store/CartContext"
import { useNavigate } from "react-router-dom"

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, isCartOpen, toggleCart, totalPrice } = useCart()

  const cartRef = useRef(null)
  const navigate = useNavigate()

  // Close cart when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target) && isCartOpen) {
        toggleCart()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isCartOpen, toggleCart])

  // Prevent scrolling when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isCartOpen])

  const handleCheckout = () => {
    toggleCart() // Close the cart
    navigate("/checkout") // Navigate to checkout page
  }

  if (!isCartOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-end">
      <div
        ref={cartRef}
        className="bg-white w-full max-w-md h-full flex flex-col shadow-xl transform transition-transform"
      >
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-medium">Your Shopping Bag</h2>
          <button
            onClick={toggleCart}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close cart"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-gray-300 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <p className="text-gray-500 text-center">Your shopping bag is empty</p>
            <button
              onClick={toggleCart}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex border-b pb-4">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-20 h-20 object-contain rounded-md bg-gray-50"
                  />

                  <div className="ml-4 flex-1">
                    <div className="flex justify-between">
                      <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-gray-500"
                        aria-label="Remove item"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <p className="mt-1 text-sm text-gray-500 line-clamp-1">{item.description}</p>

                    <div className="flex items-center justify-between mt-2">
                      <p className="text-sm font-medium text-gray-900">${item.price.toFixed(2)}</p>

                      <div className="flex items-center border rounded-md">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="px-2 py-1 text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t p-4 space-y-4">
              <div className="flex justify-between">
                <span className="font-medium">Subtotal</span>
                <span className="font-medium">${totalPrice.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-sm text-gray-500">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>

              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>

              <div className="space-y-2">
                <button className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  onClick={handleCheckout}
                >
                  Checkout
                </button>

                <button
                  onClick={clearCart}
                  className="w-full py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
