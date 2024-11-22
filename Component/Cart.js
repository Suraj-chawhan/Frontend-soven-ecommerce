import React from "react";
import Image from "next/image";
import Link from "next/link";

function Cart({ title, img, price, size = [], slug }) {
  return (
    <div className="w-[300px] flex flex-col items-center shadow-lg rounded-lg overflow-hidden gap-3 transition-transform duration-300 hover:scale-105 hover:shadow-xl">
      <Image
        src={img}
        width={300}
        height={400}
        className="w-[300px] h-[400px] rounded-t-lg object-cover"
        alt={title}
        priority
      />
      <div className="p-4 text-center">
        <h1 className="text-lg font-semibold text-gray-800">{title}</h1>
        <p className="text-xl font-bold text-red-500">INR {price} /-</p>
        <div className="flex justify-center gap-3 mt-3 text-sm">
          {size.length > 0 ? (
            size.map((val, index) => (
              <Link
                href={`/checkout/${slug}`}
                className="text-gray-600 font-bold hover:text-red-500 hover:border-b-2 hover:border-red-500 transition-colors"
                key={index}
              >
                {val.size}
              </Link>
            ))
          ) : (
            <span className="text-gray-400 italic">No sizes available</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default Cart;
