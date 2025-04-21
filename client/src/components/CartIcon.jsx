import { FaShoppingCart } from "react-icons/fa"
import { useCart } from "../store/CartContext"

export default function CartIcon() {
  const { toggleCart, totalItems } = useCart()

  return (
    <div className="relative" onClick={toggleCart}>
        <FaShoppingCart className="text-xl" />

        {totalItems > 0 && (
        <span className="absolute -top-3 -right-3 bg-blue-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {totalItems > 99 ? "99+" : totalItems}
        </span>
        )}
    </div>
  )
}
