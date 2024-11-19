"use client"

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
function Banner({images}) {
  const router=useRouter()
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalImages = images.length;
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % totalImages);
    }, 3000);

    return () => clearInterval(interval)
  }, [totalImages]);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalImages) % totalImages);
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalImages);
  };
  

  return (
    <div className={`relative w-full h-screen overflow-hidden z-10`}>
      <div className="w-full h-full flex transition-transform duration-500"
           style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {images?.map((img, index) => (
          <div key={index} className="relative w-full h-full flex-shrink-0">
            <Image src={img.img} layout="fill"  alt={`Slide ${index}`} priority  />
          </div>
        ))}
      </div>
      <button
        onClick={prevSlide}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-4 py-2">
        Prev
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-4 py-2">
        Next
      </button>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${index === currentIndex ? 'bg-white' : 'bg-gray-400'}`}
            onClick={() => setCurrentIndex(index)}></button>
        ))}
      </div>
    </div>
  );
}

export default Banner;
