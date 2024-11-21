import React from "react";
import Image from "next/image";

function Seasonal({ title, img }) {
  return (
    <div className="relative transition-all duration-300 shadow-lg rounded overflow-hidden  hover:-translate-y-2 hover:scale-105">
      <Image
        src={img}
        width={350}
        height={300}
        className="w-[300px] h-[500px] rounded-2xl"
        priority
      />
      <h1 className="absolute bottom-0 left-0 text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-pink-500 to-purple-500">
        {title}
      </h1>
    </div>
  );
}

export default Seasonal;
