"use client";

import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import Cart from '../../../../Component/Cart';
import Link from 'next/link';

function Page() {

  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [url, setUrl] = useState(`${ process.env.NEXT_PUBLIC_API_URL}/api/admin/products`);
 const[catagories,setCatagories]=useState([])
  useEffect(() => {
    const fetchProducts = async () => {
      let api = "";
      if (searchTerm) {
        api = `/api/products?filters[title][$contains]=${searchTerm.toLowerCase()}&populate=*`;
        setUrl(api);
      }

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      }
    };

    fetchProducts();
  }, [searchTerm]);


  useEffect(() => {
    async function fetchData() {
      const res = await fetch(`/api/admin/products`);
      const data= await res.json();
        const categoriesProduct=data.filter(v=>v.categories===selectedCategory)
      setProducts(categoriesProduct);
    }
    fetchData();
  }, [selectedCategory]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(()=>{
    async function f(){
      const res=await fetch(`/api/admin/categories`);
      const data=await res.json()
      setCatagories(data)
    }
   f()
  },[])

  return (
    <div className="flex h-full flex-col gap-8 p-8 bg-gray-50">
      <div className="w-full max-w-lg mx-auto flex items-center bg-white rounded-full shadow-lg p-4">
        <FaSearch className="mr-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by category or product..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full p-2 outline-none text-gray-700 rounded-full"
        />
      </div>
      
      <div className="flex flex-wrap lg:flex-nowrap gap-8">
        <div className="w-full lg:w-1/4 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Categories</h2>
          <ul className="space-y-2">
            {catagories.map((category, index) => (
              <li
                key={index}
                onClick={() => setSelectedCategory(category.name)}
                className={`p-3 text-center cursor-pointer rounded-lg font-medium transition-all ${
                  selectedCategory === category.name
                    ? 'bg-red-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-red-100'
                }`}
              >
                {category.name}
              </li>
            ))}
          </ul>
        </div>
        <div className="w-full lg:w-3/4 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {products?.length > 0 ? (
              products?.map((product, index) => (
                <Link href={`/checkout/${product.slug}`}    key={index} >
                <Cart 
               
                  title={product.title} 
                  img={product.thumbnail.url}  
                  slug={product.slug} 
                  price={product.price} 
                  size={product.size.sizes}
                />
                </Link>
              ))
            ) : (
              <p className="text-center col-span-full text-gray-500">No products found for this category or search term.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
