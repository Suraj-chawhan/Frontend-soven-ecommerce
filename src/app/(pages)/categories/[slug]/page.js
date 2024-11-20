"use client"

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Cart from '../../../../../Component/Cart'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import LoadingPage from '../../../../../Component/LoadingPage'
function Page() {
  const { slug } = useParams();
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [price, setPrice] = useState([
    { label: "Under INR 999", v: false },
    { label: "INR 999 - INR 1499", v: false },
    { label: "INR 1499 and above", v: false }
  ]);
  const [products, setProducts] = useState([]);
  const [originalProducts, setOriginalProducts] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
const {status}=useSession()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/admin/products");
        const data = await res.json();


        const filterData=data.filter(val=>val.categories===slug)
   

        const allSizes = [
          ...new Set(filterData.flatMap((product) => product.sizes.map((s) => s.size))),
        ];
        const allColors = [
          ...new Set(filterData.flatMap((product) => product.colors.map((c) => c.color))),
        ];


   setColors(allColors)
   setSizes(allSizes)
        setProducts(filterData);
        setOriginalProducts(filterData);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [slug]);



  useEffect(() => {
    
    let filteredProducts = originalProducts;

  // Filter by sizes
  if (selectedSizes.length > 0) {
    filteredProducts = filteredProducts?.filter(product =>
      product.sizes.some(sizeObj =>
        selectedSizes.includes(sizeObj.size) && sizeObj.enabled === true
      )
    );
  }

  // Filter by colors
  if (selectedColors.length > 0) {
    filteredProducts = filteredProducts?.filter(product =>
      product.colors.some(colorObj =>
        selectedColors.includes(colorObj.color) && colorObj.enabled === true
      )
    );
  }

    if (price[0].v) {
      filteredProducts = filteredProducts.filter(product => product.price < 999);
    } else if (price[1].v) {
      filteredProducts = filteredProducts.filter(product => product.price >= 999 && product.price <= 1499);
    } else if (price[2].v) {
      filteredProducts = filteredProducts.filter(product => product.price > 1499);
    }

    setProducts(filteredProducts);
  }, [selectedSizes, selectedColors, price, originalProducts]);

  const handlePriceCheckboxChange = (index) => {
    setPrice(prevPrices => 
      prevPrices.map((item, i) => (i === index ? { ...item, v: !item.v } : item))
    );
  };

  const handleSizeCheckboxChange = (size) => {
    setSelectedSizes(prevSelected => {
      if (prevSelected.includes(size)) {
        return prevSelected.filter(s => s !== size); 
      } else {
        return [...prevSelected, size];
      }
    });
  };

  const handleColorCheckboxChange = (color) => {
    setSelectedColors(prevSelected => {
      if (prevSelected.includes(color)) {
        return prevSelected.filter(c => c !== color);
      } else {
        return [...prevSelected,color];
      }
    });
  };



  
  if(status==="loading"){
    return <LoadingPage/>
  }
 

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-4 gap-8">
        {/* Filters Section */}
        <div className="col-span-1 bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Filters</h2>

          <div className="mb-6">
            <h3 className="text-md font-semibold mb-2">Sizes</h3>
            <div className="space-y-2">
              {sizes?.map((val, index) => (
                <div className="flex items-center gap-2" key={index}>
                  <input 
                    type="checkbox" 
                    id={`size-${index}`} 
                    onChange={() => handleSizeCheckboxChange(val.size)} 
                    checked={selectedSizes.includes(val.size)} 
                  />
                  <label htmlFor={`size-${index}`} className="text-sm">{val.size}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-md font-semibold mb-2">Colors</h3>
            <div className="space-y-2">
              {colors?.map((val, index) => (
                <div className="flex items-center gap-2" key={index}>
                  <input 
                    type="checkbox" 
                    id={`color-${index}`} 
                    onChange={() => handleColorCheckboxChange(val.color)} 
                    checked={selectedColors.includes(val.color)} 
                  />
                  <label htmlFor={`color-${index}`} className="text-sm">{val.color}</label>
                </div>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div>
            <h3 className="text-md font-semibold mb-2">Prices</h3>
            <div className="space-y-2">
              {price.map((val, index) => (
                <div className="flex items-center gap-2" key={index}>
                  <input
                    type="checkbox"
                    id={`price-${index}`}
                    value={val.label}
                    onChange={() => handlePriceCheckboxChange(index)}
                    checked={val.v}
                  />
                  <label htmlFor={`price-${index}`} className="text-sm">{val.label}</label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-span-3">
          <h2 className="text-lg font-semibold mb-4">Products</h2>
          <div className="grid grid-cols-3 gap-8">
            {products?.map((val, index) => (
              <Link href={`/checkout/${val.slug}`} key={index}>
                <Cart title={val.title} img={val.thumbnail} size={val.sizes} slug={val.slug} price={val.price} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page;
