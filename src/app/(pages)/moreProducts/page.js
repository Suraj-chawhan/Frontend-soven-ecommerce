"use client";

import React, { useEffect, useState } from "react";
import Cart from "../../../../Component/Cart";
import Link from "next/link";
import { useSession } from "next-auth/react";
import LoadingPage from "../../../../Component/LoadingPage";
import { useRouter } from "next/navigation";
function Page() {
  const router = useRouter();
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [price, setPrice] = useState([
    { label: "Under INR 999", v: false },
    { label: "INR 999 - INR 1499", v: false },
    { label: "INR 1499 and above", v: false },
  ]);
  const [products, setProducts] = useState([]);
  const [originalProducts, setOriginalProducts] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const { status } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/admin/products");
        const data = await res.json();
        const allSizes = [
          ...new Set(
            data.flatMap((product) => product.sizes.map((s) => s.size))
          ),
        ];
        const allColors = [
          ...new Set(
            data.flatMap((product) => product.colors.map((c) => c.color))
          ),
        ];

        setSizes(allSizes);
        setColors(allColors);
        setProducts(data);
        setOriginalProducts(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filteredProducts = originalProducts;
    if (selectedSizes.length > 0) {
      filteredProducts = filteredProducts?.filter((product) =>
        product.sizes.some(
          (sizeObj) =>
            selectedSizes.includes(sizeObj.size) && sizeObj.enabled === true
        )
      );
    }

    if (selectedColors.length > 0) {
      filteredProducts = filteredProducts?.filter((product) =>
        product.colors.some(
          (colorObj) =>
            selectedColors.includes(colorObj.color) && colorObj.enabled === true
        )
      );
    }

    // Filter by price range
    if (price[0].v) {
      filteredProducts = filteredProducts.filter(
        (product) => product.price < 999
      );
    } else if (price[1].v) {
      filteredProducts = filteredProducts.filter(
        (product) => product.price >= 999 && product.price <= 1499
      );
    } else if (price[2].v) {
      filteredProducts = filteredProducts.filter(
        (product) => product.price > 1499
      );
    }

    setProducts(filteredProducts);
  }, [selectedSizes, selectedColors, price, originalProducts]);

  const handlePriceCheckboxChange = (index) => {
    setPrice((prevPrices) =>
      prevPrices.map((item, i) =>
        i === index ? { ...item, v: !item.v } : item
      )
    );
  };

  const handleSizeCheckboxChange = (size) => {
    setSelectedSizes((prevSelected) =>
      prevSelected.includes(size)
        ? prevSelected.filter((s) => s !== size)
        : [...prevSelected, size]
    );
  };

  const handleColorCheckboxChange = (color) => {
    setSelectedColors((prevSelected) =>
      prevSelected.includes(color)
        ? prevSelected.filter((c) => c !== color)
        : [...prevSelected, color]
    );
  };

  if (status === "loading") {
    return <LoadingPage />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => router.back()}
        className=" mb-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-300 ease-in-out transform hover:scale-105"
      >
        ← Go Back
      </button>
      <div className="grid grid-cols-4 gap-8">
        {/* Filters Section */}
        <div className="col-span-1 bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Filters</h2>

          <div className="mb-6">
            <h3 className="text-md font-semibold mb-2">Sizes</h3>
            <div className="space-y-2">
              {sizes.map((size, index) => (
                <div className="flex items-center gap-2" key={index}>
                  <input
                    type="checkbox"
                    id={`size-${index}`}
                    onChange={() => handleSizeCheckboxChange(size)}
                    checked={selectedSizes.includes(size)}
                  />
                  <label htmlFor={`size-${index}`} className="text-sm">
                    {size}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-md font-semibold mb-2">Colors</h3>
            <div className="space-y-2">
              {colors.map((color, index) => (
                <div className="flex items-center gap-2" key={index}>
                  <input
                    type="checkbox"
                    id={`color-${index}`}
                    onChange={() => handleColorCheckboxChange(color)}
                    checked={selectedColors.includes(color)}
                  />
                  <label htmlFor={`color-${index}`} className="text-sm">
                    {color}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-md font-semibold mb-2">Prices</h3>
            <div className="space-y-2">
              {price.map((val, index) => (
                <div className="flex items-center gap-2" key={index}>
                  <input
                    type="checkbox"
                    id={`price-${index}`}
                    onChange={() => handlePriceCheckboxChange(index)}
                    checked={val.v}
                  />
                  <label htmlFor={`price-${index}`} className="text-sm">
                    {val.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="col-span-3">
          <h2 className="text-lg font-semibold mb-4">Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <Link href={`/checkout/${product.slug}`} key={index}>
                <Cart
                  title={product.title}
                  img={product.thumbnail}
                  size={product.sizes}
                  slug={product.slug}
                  price={product.price}
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
