import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
function Cart({title,img,price,size,slug}) {
  return (
<div className="w-[300px] flex flex-col items-center  gap-1 opacity-100 transition-all duration-300 hover:-translate-y-2 hover:scale-105">
    <Image  src={img} width={300} height={400}   className="width-[300px] h-[400px] rounded-2xl" alt={`${title}`} priority />
    <h1>{title}</h1>
    <p>INR {price} rs</p>
    <div className="flex gap-4 text-gray-300 ">   
  {
    size.map(val=> <Link href={`/checkout/${slug}`} className=' hover:text-red-500 hover:border-b-2 hover:border-black '>{val.size}</Link>)
  }
  </div>

   </div>
  )
}

export default Cart