"use client";
import Image from 'next/image';
import React from 'react';

export default function Bag({ product, updateQuantity, index,Remove}) {
  if (!product) return <div>Loading...</div>;

  return (
    <div className="flex justify-evenly  h-[250px] border border-gray-300 rounded-lg p-4 shadow-md">
      <div className="flex flex-col items-center justify-between w-[40%]">
        <Image
          src={product.img}
          width={120}
          height={120}
          className="rounded-lg"
          alt="product-bag"
        />
        <div className="flex items-center gap-2 mt-2 border border-gray-300 rounded">
          <button
            onClick={() => updateQuantity(index, false)}
            className="p-2 hover:bg-gray-200"
          >
            -
          </button>
          <p className="px-2 text-center">{product.quantity}</p>
          <button
            onClick={() => updateQuantity(index, true)}
            className="p-2 hover:bg-gray-200"
          >
            +
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="flex flex-col justify-between w-[60%] pl-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-lg font-semibold">{product.title}</h1>
          <div className="flex gap-2 text-sm">
            <span className="font-medium">Color:</span>
            <p>{product.color}</p>
          </div>
          <div className="flex gap-2 text-sm">
            <span className="font-medium">Size:</span>
            <p>{product.size}</p>
          </div>
        </div>
       
        {/* Price and Delivery Info */}
        </div>
      
        <button className="p-3 px-6 border-2 border-gray-300 text-red-600 rounded-md self-center font-semibold hover:bg-red-500 hover:text-white hover:border-red-500 transition duration-200 ease-in-out" onClick={()=>Remove(product.id)}>Remove</button>
        <div className="flex  self-end mt-auto">
        <h1 className="text-lg font-semibold">₹{product.price * product.quantity}</h1>    
       
   
        </div>
    </div>
  );
}
