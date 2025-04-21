import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useCart } from "../store/CartContext"

// Step indicators component
const CheckoutSteps = ({ currentStep }) => {
  const steps = [
    { id: 1, name: "Shipping" },
    { id: 2, name: "Payment" },
    { id: 3, name: "Review" },
  ]

  return (
    <div className="mb-8">
      <div className="flex items-center justify-center">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                currentStep >= step.id ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
              }`}
            >
              {step.id}
            </div>
            <div className={`mx-2 text-sm ${currentStep >= step.id ? "text-blue-600 font-medium" : "text-gray-500"}`}>
              {step.name}
            </div>
            {index < steps.length - 1 && (
              <div className={`w-12 h-1 ${currentStep > step.id ? "bg-blue-600" : "bg-gray-200"}`}></div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// Order summary component
const OrderSummary = ({ cartItems, totalPrice, showDetails = true }) => {
  const shipping = 5.99
  const tax = totalPrice * 0.08
  const grandTotal = totalPrice + shipping + tax

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="font-medium text-lg mb-4">Order Summary</h3>

      {showDetails && cartItems.length > 0 && (
        <div className="mb-4 max-h-60 overflow-y-auto">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center py-2 border-b">
              <div className="w-12 h-12 bg-gray-100 rounded flex-shrink-0 relative">
                <img
                  src={item.image || "/placeholder.svg?height=50&width=50"}
                  alt={item.name}
                  className="w-full h-full object-contain p-1"
                />
                <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {item.quantity}
                </span>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-gray-500">${item.price.toFixed(2)} each</p>
              </div>
              <div className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</div>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-2 pt-2">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Shipping</span>
          <span>${shipping.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Tax (8%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>${grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Checkout() {
  const { cartItems, totalPrice, clearCart } = useCart()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderId, setOrderId] = useState("")

  // Form states
  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    phone: "",
    email: "",
  })

  const [paymentInfo, setPaymentInfo] = useState({
    cardName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  })

  // Check if cart is empty and redirect if needed
  useEffect(() => {
    if (cartItems.length === 0 && !orderComplete) {
      navigate("/")
    }
  }, [cartItems, navigate, orderComplete])

  // Handle shipping form input changes
  const handleShippingChange = (e) => {
    const { name, value } = e.target
    setShippingInfo((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle payment form input changes
  const handlePaymentChange = (e) => {
    const { name, value } = e.target
    setPaymentInfo((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  // Handle card number input with formatting
  const handleCardNumberChange = (e) => {
    const formattedValue = formatCardNumber(e.target.value)
    setPaymentInfo((prev) => ({
      ...prev,
      cardNumber: formattedValue,
    }))
  }

  // Format expiry date (MM/YY)
  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")

    if (v.length <= 2) {
      return v
    }

    return `${v.substring(0, 2)}/${v.substring(2, 4)}`
  }

  // Handle expiry date input with formatting
  const handleExpiryDateChange = (e) => {
    const formattedValue = formatExpiryDate(e.target.value)
    setPaymentInfo((prev) => ({
      ...prev,
      expiryDate: formattedValue,
    }))
  }

  // Validate shipping form
  const validateShippingForm = () => {
    // Basic validation
    if (
      !shippingInfo.firstName ||
      !shippingInfo.lastName ||
      !shippingInfo.address ||
      !shippingInfo.city ||
      !shippingInfo.state ||
      !shippingInfo.zipCode ||
      !shippingInfo.email
    ) {
      setError("Please fill in all required fields")
      return false
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(shippingInfo.email)) {
      setError("Please enter a valid email address")
      return false
    }

    // Phone validation (optional field)
    if (shippingInfo.phone) {
      const phoneRegex = /^\d{10}$/
      if (!phoneRegex.test(shippingInfo.phone.replace(/[^0-9]/g, ""))) {
        setError("Please enter a valid 10-digit phone number")
        return false
      }
    }

    // Zip code validation
    const zipRegex = /^\d{5}(-\d{4})?$/
    if (!zipRegex.test(shippingInfo.zipCode)) {
      setError("Please enter a valid ZIP code")
      return false
    }

    setError("")
    return true
  }

  // Validate payment form
  const validatePaymentForm = () => {
    // Basic validation
    if (!paymentInfo.cardName || !paymentInfo.cardNumber || !paymentInfo.expiryDate || !paymentInfo.cvv) {
      setError("Please fill in all payment fields")
      return false
    }

    // Card number validation (should be 16 digits, spaces allowed)
    const cardNumberDigits = paymentInfo.cardNumber.replace(/\s/g, "")
    if (cardNumberDigits.length !== 16 || !/^\d+$/.test(cardNumberDigits)) {
      setError("Please enter a valid 16-digit card number")
      return false
    }

    // Expiry date validation (MM/YY format)
    const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/
    if (!expiryRegex.test(paymentInfo.expiryDate)) {
      setError("Please enter a valid expiry date (MM/YY)")
      return false
    }

    // CVV validation (3 or 4 digits)
    if (!/^[0-9]{3,4}$/.test(paymentInfo.cvv)) {
      setError("Please enter a valid CVV (3 or 4 digits)")
      return false
    }

    setError("")
    return true
  }

  // Handle next step
  const handleNextStep = () => {
    if (currentStep === 1) {
      if (validateShippingForm()) {
        setCurrentStep(2)
        window.scrollTo(0, 0)
      }
    } else if (currentStep === 2) {
      if (validatePaymentForm()) {
        setCurrentStep(3)
        window.scrollTo(0, 0)
      }
    }
  }

  // Handle previous step
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  // Handle order submission
  const handlePlaceOrder = async () => {
    setLoading(true)
    setError("")

    try {
      // Simulate API call to place order
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Generate a random order ID
      const randomOrderId = "ORD-" + Math.random().toString(36).substring(2, 10).toUpperCase()
      setOrderId(randomOrderId)

      // Clear cart after successful order
      clearCart()

      // Set order as complete
      setOrderComplete(true)
    } catch (error) {
      setError("Failed to place your order. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Handle continue shopping
  const handleContinueShopping = () => {
    navigate("/")
  }

  // Render shipping form
  const renderShippingForm = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Shipping Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={shippingInfo.firstName}
            onChange={handleShippingChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={shippingInfo.lastName}
            onChange={handleShippingChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
          Street Address <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="address"
          name="address"
          value={shippingInfo.address}
          onChange={handleShippingChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
            City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={shippingInfo.city}
            onChange={handleShippingChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
            State <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="state"
            name="state"
            value={shippingInfo.state}
            onChange={handleShippingChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
            ZIP Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="zipCode"
            name="zipCode"
            value={shippingInfo.zipCode}
            onChange={handleShippingChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
          Country <span className="text-red-500">*</span>
        </label>
        <select
          id="country"
          name="country"
          value={shippingInfo.country}
          onChange={handleShippingChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="United States">United States</option>
          <option value="Canada">Canada</option>
          <option value="United Kingdom">United Kingdom</option>
          <option value="Australia">Australia</option>
          <option value="Germany">Germany</option>
          <option value="France">France</option>
          <option value="Japan">Japan</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={shippingInfo.email}
            onChange={handleShippingChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={shippingInfo.phone}
            onChange={handleShippingChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  )

  // Render payment form
  const renderPaymentForm = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Payment Information</h2>

      <div>
        <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
          Name on Card <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="cardName"
          name="cardName"
          value={paymentInfo.cardName}
          onChange={handlePaymentChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
          Card Number <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="text"
            id="cardNumber"
            name="cardNumber"
            value={paymentInfo.cardNumber}
            onChange={handleCardNumberChange}
            placeholder="1234 5678 9012 3456"
            maxLength="19"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-10"
            required
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
              <line x1="1" y1="10" x2="23" y2="10"></line>
            </svg>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
            Expiry Date (MM/YY) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="expiryDate"
            name="expiryDate"
            value={paymentInfo.expiryDate}
            onChange={handleExpiryDateChange}
            placeholder="MM/YY"
            maxLength="5"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
            CVV <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="cvv"
            name="cvv"
            value={paymentInfo.cvv}
            onChange={handlePaymentChange}
            placeholder="123"
            maxLength="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-md">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-blue-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              This is a demo checkout. No real payment will be processed. You can use any valid-format card details.
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  // Render order review
  const renderOrderReview = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Review Your Order</h2>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Shipping Address</h3>
        <p>
          {shippingInfo.firstName} {shippingInfo.lastName}
          <br />
          {shippingInfo.address}
          <br />
          {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}
          <br />
          {shippingInfo.country}
          <br />
          {shippingInfo.email}
          {shippingInfo.phone && (
            <>
              <br />
              {shippingInfo.phone}
            </>
          )}
        </p>
        <button onClick={() => setCurrentStep(1)} className="text-blue-600 text-sm mt-2 hover:text-blue-800">
          Edit
        </button>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Payment Method</h3>
        <p>
          {paymentInfo.cardName}
          <br />
          Card ending in {paymentInfo.cardNumber.slice(-4)}
          <br />
          Expires {paymentInfo.expiryDate}
        </p>
        <button onClick={() => setCurrentStep(2)} className="text-blue-600 text-sm mt-2 hover:text-blue-800">
          Edit
        </button>
      </div>
    </div>
  )

  // Render order confirmation
  const renderOrderConfirmation = () => (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg
          className="h-8 w-8 text-green-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-2">Thank You For Your Order!</h2>
      <p className="text-gray-600 mb-6">Your order has been placed and is being processed.</p>

      <div className="bg-gray-50 p-4 rounded-lg inline-block mb-6">
        <p className="text-sm text-gray-500">Order Number</p>
        <p className="font-medium text-lg">{orderId}</p>
      </div>

      <p className="text-gray-600 mb-8">
        We've sent a confirmation email to <span className="font-medium">{shippingInfo.email}</span>
        <br />
        You will receive updates on your order status.
      </p>

      <button
        onClick={handleContinueShopping}
        className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Continue Shopping
      </button>
    </div>
  )

  // Render current step content
  const renderStepContent = () => {
    if (orderComplete) {
      return renderOrderConfirmation()
    }

    switch (currentStep) {
      case 1:
        return renderShippingForm()
      case 2:
        return renderPaymentForm()
      case 3:
        return renderOrderReview()
      default:
        return null
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center mb-8">Checkout</h1>

      {!orderComplete && <CheckoutSteps currentStep={currentStep} />}

      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-md mb-6 flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">{renderStepContent()}</div>

        <div>
          <OrderSummary cartItems={cartItems} totalPrice={totalPrice} showDetails={!orderComplete} />

          {!orderComplete && (
            <div className="mt-6 space-y-3">
              {currentStep > 1 && (
                <button
                  onClick={handlePrevStep}
                  className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Back
                </button>
              )}

              {currentStep < 3 ? (
                <button
                  onClick={handleNextStep}
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Continue to {currentStep === 1 ? "Payment" : "Review"}
                </button>
              ) : (
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing Order...
                    </>
                  ) : (
                    "Place Order"
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
