"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Cart from "../../Component/Cart";
import Seasonal from "../../Component/Seasonal";
import Banner from "../../Component/Banner";
import Error from "../../Component/ErrorFetch/FetchError";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import NotLoggedInPage from "../../Component/NotLoggedIn";
import LoadingPage from "../../Component/LoadingPage";
export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("trouser");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [images, setImages] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { data: session,status } = useSession(); // Use `status` to handle session state
  const router = useRouter();





  useEffect(() => {
  
    const fetchData = async () => {
      try {
        setLoading(true);

        const [productResponse, categoryResponse, imageResponse] = await Promise.all([
          fetch("/api/admin/products"),
          fetch("/api/admin/categories"),
          fetch("/api/admin/banner"),
        ]);

        const [productData, categoryData, imageData] = await Promise.all([
          productResponse.json(),
          categoryResponse.json(),
          imageResponse.json(),
        ]);

        // Set fetched data
        setProducts(productData);
        setCategories(categoryData);
        setImages(imageData);

        // Sort recently added products
        const sortedProducts = productData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setRecentProducts(sortedProducts.slice(0, 5));

        // Filter products by default category
        const filtered = productData.filter((product) => product.categories === selectedCategory);
        setFilteredProducts(filtered);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  
  }, [selectedCategory]);




  if(status==="loading"){
    return <LoadingPage/>
  }
 

  return (
    <div className="flex flex-col gap-10 relative overflow-hidden w-full h-full">
      {/* Banner Section */}
      {loading ? <Skeleton height={500} /> : <Banner images={images} />}

      {/* Newly Dropped Products */}
      <h1 className="flex align-center justify-center font-bold text-3xl">Newly Dropped</h1>
      <div className="flex gap-4 self-center">
        {loading
          ? Array(5)
              .fill(0)
              .map((_, index) => <Skeleton key={index} width={200} height={300} />)
          : products.slice(0, 5).map((product) => (
              <Link href={`/checkout/${product.slug}`} key={product.slug}>
                <Cart title={product.name} size={product.sizes} img={product.thumbnail} slug={product.slug} price={product.price} />
              </Link>
            ))}
      </div>

      {/* Seasonal Favorites */}
      <h1 className="flex align-center justify-center font-bold text-3xl">Seasonal Favorites</h1>
      <div className="flex gap-8 self-center">
        {loading
          ? Array(3)
              .fill(0)
              .map((_, index) => <Skeleton key={index} width={150} height={200} />)
          : categories.map((category) => (
              <Link href={`/categories/${category.name}`} key={category.name}>
                <Seasonal title={category.name} img={category.img} />
              </Link>
            ))}
      </div>

      {/* Category Buttons */}
      <div className="self-center flex gap-4">
        { categories.map((category) => (
              <button
                key={category.name}
                className="p-2 border-2 border-black hover:bg-black hover:text-white font-bold rounded-2xl"
                onClick={() => setSelectedCategory(category.name)}
              >
                {category.name.toUpperCase()}
              </button>
            ))}
      </div>

      {/* Filtered Products Section */}
      <div className="self-center flex gap-2">
        { filteredProducts.map((product) => (
              <Link href={`/checkout/${product.slug}`} key={product._id}>
                <Cart title={product.title} size={product.sizes} img={product.thumbnail} slug={product.slug} price={product.price} />
              </Link>
            ))}
      </div>

      {/* Recently Added Products */}
      <h1 className="font-bold self-center text-4xl">Recently Added</h1>
      <div className="self-center flex gap-4">
        {loading
          ? Array(4)
              .fill(0)
              .map((_, index) => <Skeleton key={index} width={200} height={300} />)
          : recentProducts.map((product) => (
              <Link href={`/checkout/${product.slug}`} key={product._id}>
                <Cart img={product.thumbnail} size={product.sizes} title={product.title} slug={product.slug} price={product.price} />
              </Link>
            ))}
      </div>
    </div>
  );
}
