"use client"
import CartItems from "./CartItems"
import { useCart } from "@/context/cart"
import { useRouter } from "next/navigation"

const CartPage = () => {
  const { cartItems, subtotal, shipping, tax, total } = useCart()
  const router = useRouter()

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <button
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          onClick={() => router.push("/")}
        >
          Go to homepage
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto mt-10">
      <div className="flex shadow-md my-10">
        <div className="w-3/4 bg-white px-10 py-10">
          <div className="flex justify-between border-b pb-8">
            <h1 className="font-semibold text-2xl">Shopping Cart</h1>
            <h2 className="font-semibold text-2xl">{cartItems.length} Items</h2>
          </div>
          <div className="flex mt-10 mb-5">
            <h3 className="font-semibold text-gray-600 text-xs uppercase w-2/5">Product Details</h3>
            <h3 className="font-semibold text-center text-gray-600 text-xs uppercase w-1/5 text-center">Quantity</h3>
            <h3 className="font-semibold text-center text-gray-600 text-xs uppercase w-1/5 text-center">Price</h3>
            <h3 className="font-semibold text-center text-gray-600 text-xs uppercase w-1/5 text-center">Total</h3>
          </div>

          <CartItems />

          <button className="flex font-semibold text-gray-600 text-sm mt-10" onClick={() => router.push("/")}>
            <svg className="fill-current mr-2 text-gray-600 w-4" viewBox="0 0 448 512">
              <path d="M134.059 296H436c6.627 0 12-5.373 12-12v-56c0-6.627-5.373-12-12-12H134.059v-46.059c0-21.382-25.851-32.09-40.971-16.971L7.029 239.029c-9.373 9.373-9.373 24.569 0 33.941l86.059 86.059c15.119 15.119 40.971 4.411 40.971-16.971V296z" />
            </svg>
            Continue Shopping
          </button>
        </div>

        <div id="summary" className="w-1/4 px-8 py-10">
          <h1 className="font-semibold text-2xl border-b pb-8">Order Summary</h1>
          <div className="flex justify-between mt-10 mb-5">
            <span className="font-semibold text-sm uppercase">Items {cartItems.length}</span>
            <span>₱{subtotal.toFixed(2)}</span>
          </div>
          <div>
            <label className="font-medium inline-block mb-3 text-sm uppercase">Shipping</label>
            <select className="block p-2 text-gray-600 w-full text-sm">
              <option>Standard shipping - ₱5.00</option>
            </select>
          </div>
          <div className="py-10">
            <label htmlFor="promo" className="font-semibold inline-block mb-3 text-sm uppercase">
              Promo Code
            </label>
            <input type="text" id="promo" placeholder="Enter your code" className="p-2 text-sm w-full" />
          </div>
          <button className="bg-red-500 hover:bg-red-600 px-5 py-2 text-sm text-white uppercase rounded-md">
            Apply
          </button>
          <div className="border-t mt-8">
            <div className="flex font-semibold justify-between py-6 text-sm uppercase">
              <span>Subtotal</span>
              <span>₱{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex font-semibold justify-between py-6 text-sm uppercase">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : `₱${shipping.toFixed(2)}`}</span>
            </div>
            <div className="flex font-semibold justify-between py-6 text-sm uppercase">
              <span>Tax</span>
              <span>₱{tax.toFixed(2)}</span>
            </div>
            <div className="flex font-semibold justify-between py-6 text-sm uppercase">
              <span>Total</span>
              <span>₱{total.toFixed(2)}</span>
            </div>
            <button className="bg-blue-500 font-semibold hover:bg-blue-600 py-3 text-sm text-white uppercase w-full rounded-md">
              Checkout
            </button>
          </div>
          {subtotal < 50 && (
            <p className="mt-2">Add ₱{(50 - subtotal).toFixed(2)} more to qualify for free shipping!</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default CartPage
