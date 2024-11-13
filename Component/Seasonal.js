import React from 'react'
import Image from 'next/image'
function Seasonal({title,img}) {
  return (
   <div className="relative transition-all duration-300 hover:-translate-y-2 hover:scale-105">
    <Image src={img} width={300} height={400} className='w-[300px] h-[500px] rounded-2xl' priority  />
    <h1 className="absolute bottom-0 left-0 text-3xl">{title}</h1>
   </div>
  )
}

export default Seasonal