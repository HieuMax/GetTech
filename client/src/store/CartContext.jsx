import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./AuthContext"

const CartContext = createContext(undefined)

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [totalItems, setTotalItems] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Get auth context to check if user is logged in
  const { user, isAuthenticated } = useAuth()

  // Load cart when component mounts or user changes
  useEffect(() => {
    const loadCart = async () => {
      setIsLoading(true)
      setError("")

      try {
        if (isAuthenticated()) {
          // User is logged in, fetch cart from database
          await fetchUserCart()
        } else {
          // User is not logged in, load from localStorage
          const savedCart = localStorage.getItem("cart")
          if (savedCart) {
            setCartItems(JSON.parse(savedCart))
          }
        }
      } catch (err) {
        console.error("Error loading cart:", err)
        setError("Failed to load your cart. Please try again.")

        // Fallback to localStorage if API fails
        const savedCart = localStorage.getItem("cart")
        if (savedCart) {
          setCartItems(JSON.parse(savedCart))
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadCart()
  }, [isAuthenticated, user])

  // Save cart to localStorage and/or database when it changes
  useEffect(() => {
    // Skip initial empty cart
    if (cartItems.length === 0 && !localStorage.getItem("cart")) return

    // Calculate totals
    const items = cartItems.reduce((total, item) => total + item.quantity, 0)
    setTotalItems(items)

    const price = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
    setTotalPrice(price)

    // Always save to localStorage as backup
    localStorage.setItem("cart", JSON.stringify(cartItems))

    // If user is logged in, sync with database
    if (isAuthenticated() && cartItems.length > 0) {
      syncCartWithDatabase()
    }
  }, [cartItems, isAuthenticated])

  // Fetch user's cart from database
  const fetchUserCart = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken")

      if (!accessToken) {
        throw new Error("No access token found")
      }

      const response = await fetch("http://localhost:5000/api/cart", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch cart")
      }

      const data = await response.json()

      if (data.items && Array.isArray(data.items)) {
        setCartItems(data.items)
      }
    } catch (err) {
      console.error("Error fetching user cart:", err)
      throw err
    }
  }

  // Sync cart with database
  const syncCartWithDatabase = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken")

      if (!accessToken) {
        return
      }

      await fetch("http://localhost:5000/api/cart", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ items: cartItems }),
      })
    } catch (err) {
      console.error("Error syncing cart with database:", err)
    }
  }

  // Add product to cart
  const addToCart = async (product) => {
    console.log(product)
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((item) => item.id === product.id)

      if (existingItemIndex >= 0) {
        // Item exists, increase quantity
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + product.quantity || 1,
        }
        return updatedItems
      } else {
        // Item doesn't exist, add new item
        return [...prevItems, { ...product, quantity: product.quantity || 1 }]
      }
    })

    // Open cart when adding item
    setIsCartOpen(true)

    // If user is logged in, add to database directly
    if (isAuthenticated()) {
      try {
        const accessToken = localStorage.getItem("accessToken")

        if (!accessToken) {
          throw new Error("No access token found")
        }

        await fetch(`http://localhost:5000/api/cart/item/${product.id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(product),
        })
      } catch (err) {
        console.error("Error adding item to database cart:", err)
      }
    }
  }

  // Remove item from cart
  const removeFromCart = async (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id))

    // If user is logged in, remove from database
    if (isAuthenticated()) {
      try {
        const accessToken = localStorage.getItem("accessToken")

        if (!accessToken) {
          throw new Error("No access token found")
        }

        await fetch(`http://localhost:5000/api/cart/item/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
      } catch (err) {
        console.error("Error removing item from database cart:", err)
      }
    }
  }

  // Update item quantity
  const updateQuantity = async (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }

    setCartItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, quantity } : item)))

    // If user is logged in, update in database
    if (isAuthenticated()) {
      try {
        const accessToken = localStorage.getItem("accessToken")

        if (!accessToken) {
          throw new Error("No access token found")
        }

        await fetch(`http://localhost:5000/api/cart/item/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ quantity }),
        })
      } catch (err) {
        console.error("Error updating item quantity in database cart:", err)
      }
    }
  }

  // Clear cart
  const clearCart = async () => {
    setCartItems([])

    // If user is logged in, clear database cart
    if (isAuthenticated()) {
      try {
        const accessToken = localStorage.getItem("accessToken")

        if (!accessToken) {
          throw new Error("No access token found")
        }

        await fetch("http://localhost:5000/api/cart", {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
      } catch (err) {
        console.error("Error clearing database cart:", err)
      }
    }
  }

  // Toggle cart visibility
  const toggleCart = () => {
    setIsCartOpen((prev) => !prev)
  }

  // Merge guest cart with user cart after login
  const mergeWithUserCart = async () => {
    if (!isAuthenticated() || cartItems.length === 0) return

    try {
      const accessToken = localStorage.getItem("accessToken")

      if (!accessToken) {
        throw new Error("No access token found")
      }

      await fetch("http://localhost:5000/api/cart/merge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ items: cartItems }),
      })

      // Refresh cart from server after merge
      await fetchUserCart()
    } catch (err) {
      console.error("Error merging carts:", err)
    }
  }

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isCartOpen,
    toggleCart,
    totalItems,
    totalPrice,
    isLoading,
    error,
    mergeWithUserCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
