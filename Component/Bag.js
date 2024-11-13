"use client";
import Image from 'next/image';
import React, { useEffect } from 'react';

export default function Bag({ product,updateQuantity,index }) {

 
  if (!product) return <div>Loading...</div>;

  return (
    <div className='flex w-[400px] h-[200px] gap-4 text-sm p-4'>
      <Image src={product.img} width={150} height={300} className='p-2' alt="product-bag" />
      <div className='flex flex-col justify-between'>
     
        <h1>{product.title}</h1>
        <section>
          <div className='flex gap-2'>
            <h1 className='font-bold'>Color:</h1>
            <p>{product.color}</p>
          </div>
          <div className='flex gap-4'>
            <h1 className='font-bold'>Size :</h1>
            <h1>{product.size}</h1>
          </div>
        </section>
        <div className='flex justify-between items-center gap-4'>
          <div className='flex items-center border-2 gap-4'>
            <button onClick={()=>updateQuantity(index,false)} className="p-2 hover:bg-black hover:text-white w-full">-</button>
            <p>{product.quantity}</p>
            <button onClick={()=>updateQuantity(index,true)} className="p-2 hover:bg-black hover:text-white">+</button>
          </div>
          <h1>{product.price * product.quantity}</h1>
        </div>
      </div>
    </div>
  );
}
