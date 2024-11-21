"use client";

import React, { useEffect, useState, useRef } from "react";
import Bag from "../Bag";

import { useSelector, useDispatch } from "react-redux";
import { setTrue, setFalse } from "../redux/cartToggle.js";
import gsap from "gsap";
import Error from "../ErrorFetch/FetchError";

import { useRouter } from "next/navigation";

function CartDrawer({ product, totalPrice, updateQuantity, Remove }) {
  const isToggled = useSelector((state) => state.toggle.isToggled); // Read the global state
  const dispatch = useDispatch();
  const router = useRouter();
  const cartRef = useRef();
  useEffect(() => {
    if (isToggled) {
      gsap.fromTo(
        cartRef.current.children,
        { y: 0, opacity: 0 },
        { y: 10, opacity: 1, delay: 0.2 }
      );
    }
  }, [isToggled]);

  function call() {
    dispatch(setFalse());
    router.push("/userpanel");
  }

  return (
    <div
      className={`fixed top-0 right-0 md:w-[800px] w-[100%] overflow-scroll h-full bg-white shadow-lg transition-transform transform ${
        isToggled ? "translate-x-0" : "translate-x-full"
      }`}
      ref={cartRef}
    >
      <div className="p-4">
        <h2 className="text-xl font-bold">Bag</h2>
        <button
          className="absolute top-4 right-4 text-xl"
          onClick={() => dispatch(setFalse())}
        >
          Close Cart
        </button>
        <div className="flex flex-col gap-4 h-full overflow-scroll">
          {product.length > 0 ? (
            product?.map((val, index) => (
              <div className="flex justify-between">
                <Bag
                  key={index}
                  index={index}
                  product={val}
                  updateQuantity={updateQuantity}
                />
                <button
                  className="p-3 px-6 border-2 border-gray-300 text-red-600 rounded-md self-center font-semibold hover:bg-red-500 hover:text-white hover:border-red-500 transition duration-200 ease-in-out"
                  onClick={() => Remove(val._id)}
                >
                  Remove
                </button>
              </div>
            ))
          ) : (
            <Error text="No Product Found" />
          )}
        </div>
        <div className="border-t-2 border-gray-300 mt-4 pt-4">
          <h3 className="text-lg">Subtotal: INR {totalPrice}</h3>
          <p>Shipping, taxes, and discount codes calculated at checkout.</p>
        </div>
        <button
          className="mt-4 w-full bg-blue-500 text-white py-2 rounded"
          onClick={call}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}

export default CartDrawer;
