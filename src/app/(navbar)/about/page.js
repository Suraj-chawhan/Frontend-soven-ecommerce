"use client"

import React from 'react';
import { useRouter } from 'next/navigation';
function AboutUs() {

    const router=useRouter()
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 text-gray-800">
      <h1 className="text-4xl font-bold text-center mb-8">About Us</h1>

      <p className="text-lg leading-relaxed mb-6">
        Welcome to Outfit eCommerce, your number one source for the latest fashion trends. We are dedicated to providing you with the very best of clothing, accessories, and more, with a focus on quality, affordability, and customer satisfaction.
      </p>

      <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
      <p className="text-lg leading-relaxed mb-6">
        Founded in 2020, Outfit eCommerce has come a long way from its beginnings in a small home office. When we first started out, our passion for creating a platform where people could easily access fashionable and high-quality clothing drove us to quit our day jobs and gave us the impetus to turn hard work and inspiration into a booming online store.
      </p>

      <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
      <p className="text-lg leading-relaxed mb-6">
        Our mission is to make high-quality fashion accessible to everyone. We strive to offer an exceptional shopping experience, from browsing through our extensive catalog to the moment you receive your products.
      </p>

      <h2 className="text-2xl font-semibold mb-4">Why Choose Us?</h2>
      <p className="text-lg leading-relaxed mb-6">
        At Outfit eCommerce, we prioritize our customers and ensure that every interaction with us is smooth and enjoyable. With a wide range of products, easy navigation, and secure transactions, you can shop with confidence.
      </p>
      
      <div className="mt-12 text-center">
        <button className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700" onClick={()=>router.push("/")}>
          Shop Now
        </button>
      </div>
    </div>
  );
}

export default AboutUs;
