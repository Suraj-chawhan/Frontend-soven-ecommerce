"use client";

import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import Cart from "../../../../Component/Cart";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useRouter } from "next/navigation";
function Page() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const fetchProductsAndCategories = async () => {
      setLoadingProducts(true);
      setLoadingCategories(true);

      try {
        const productResponse = await fetch(`/api/admin/products`);
        const productData = await productResponse.json();
        setAllProducts(productData);

        const categoryResponse = await fetch(`/api/admin/categories`);
        const categoryData = await categoryResponse.json();
        setCategories(categoryData);

        setLoadingProducts(false);
        setLoadingCategories(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoadingProducts(false);
        setLoadingCategories(false);
      }
    };

    fetchProductsAndCategories();
  }, []);

  useEffect(() => {
    const filterProducts = () => {
      let filtered = [...allProducts];
      if (searchTerm) {
        filtered = filtered.filter((product) =>
          product.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      if (selectedCategory) {
        filtered = filtered.filter(
          (product) => product.categories === selectedCategory
        );
      }

      setFilteredProducts(filtered);
    };

    filterProducts();
  }, [searchTerm, selectedCategory, allProducts]);
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleClearCategory = () => {
    setSelectedCategory("");
  };

  return (
    <div className="flex h-full flex-col gap-8 p-8 bg-gray-50">
      <button
        onClick={() => router.back()}
        className="self-start mb-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-300 ease-in-out transform hover:scale-105"
      >
        ← Go Back
      </button>

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

      {selectedCategory && (
        <button
          onClick={handleClearCategory}
          className="text-sm text-blue-500 hover:text-blue-700 mb-4"
        >
          Clear Category Filter
        </button>
      )}

      <div className="flex flex-wrap lg:flex-nowrap gap-8">
        {/* Categories Sidebar */}
        <div className="w-full lg:w-1/4 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Categories
          </h2>
          <ul className="space-y-2">
            {loadingCategories ? (
              <Skeleton height={30} />
            ) : (
              categories.map((category, index) => (
                <li
                  key={index}
                  onClick={() => handleCategoryClick(category.name)}
                  className={`p-3 text-center cursor-pointer rounded-lg font-medium transition-all ${
                    selectedCategory === category.name
                      ? "bg-red-500 text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-red-100"
                  }`}
                >
                  {category.name}
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Products Display */}
        <div className="w-full lg:w-3/4 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {loadingProducts ? (
              <>
                <Skeleton height={300} />
                <Skeleton height={300} />
                <Skeleton height={300} />
              </>
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
                <Link href={`/checkout/${product.slug}`} key={index}>
                  <Cart
                    title={product.title}
                    img={product.thumbnail}
                    slug={product.slug}
                    price={product.price}
                    size={product.sizes}
                  />
                </Link>
              ))
            ) : (
              <p className="text-center col-span-full text-gray-500">
                No products found for this category or search term.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
