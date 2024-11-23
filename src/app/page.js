"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Cart from "../../Component/Cart";
import Seasonal from "../../Component/Seasonal";
import Banner from "../../Component/Banner";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import LoadingPage from "../../Component/LoadingPage";
import { useDispatch } from "react-redux";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import CategoryCard from "../../Component/CategoryCard";
gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("trouser");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [images, setImages] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { data: session, status } = useSession();
  const router = useRouter();
  const dispatch = useDispatch();

  const containerRef = useRef();
  const categoryRef = useRef();

  useEffect(() => {
    if (session?.user?.role === "admin") {
      const redirected = localStorage.getItem("adminRedirected");
      if (!redirected) {
        localStorage.setItem("adminRedirected", "true");
        router.push("/admin");
      }
    }
  }, [session, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [productResponse, categoryResponse, imageResponse] =
          await Promise.all([
            fetch("/api/admin/products"),
            fetch("/api/admin/categories"),
            fetch("/api/admin/banner"),
          ]);

        const [productData, categoryData, imageData] = await Promise.all([
          productResponse.json(),
          categoryResponse.json(),
          imageResponse.json(),
        ]);

        setProducts(productData);
        setCategories(categoryData);
        setImages(imageData);

        const sortedProducts = productData.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setRecentProducts(sortedProducts.slice(0, 5));

        const filtered = productData.filter(
          (product) => product.categories === selectedCategory
        );
        setFilteredProducts(filtered);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".banner-section",
        { opacity: 0, y: 0 },
        {
          opacity: 1,
          y: 0,
          duration: 1.5,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".banner-section",
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        ".products-section",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.5,
          stagger: 0.2,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".products-section",
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        ".categories-section",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.5,
          stagger: 0.2,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".categories-section",
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [session]);

  useEffect(() => {
    if (!status === "loading" && categoryRef?.current?.children) {
      gsap.fromTo(
        categoryRef.current.children,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.3,
          ease: "power2.out",
          delay: 0.5,
        }
      );
    }
  }, [status, categoryRef]);

  if (status === "loading") {
    return <LoadingPage />;
  }

  return (
    <div
      className="flex flex-col gap-10  overflow-hidden w-full h-full"
      ref={containerRef}
    >
      <div className="flex flex-wrap w-full h-screen">
        {/* Left Side - Image */}
        <div
          className="w-full md:w-1/2 h-1/2 md:h-full bg-cover bg-center relative"
          style={{
            backgroundImage: `url(${images[0]?.img})`,
          }}
        >
          <h1 className="absolute font-bold text-2xl sm:text-4xl lg:text-6xl xl:text-8xl text-roboto top-[50%] left-[10%] transform -translate-y-1/2 bg-gradient-to-r from-white via-red-500 to-gray-500 text-transparent bg-clip-text py-2 shadow-lg">
            Odd Outfits Be Fashionable
          </h1>
        </div>

        {/* Right Side */}
        <div className="w-full md:w-1/2 flex flex-col">
          {/* Top Half */}
          <div
            className="h-1/2 flex flex-col justify-center items-start p-6 bg-cover bg-center text-white"
            style={{ backgroundImage: `url(${images[1]?.img})` }}
          >
            <h2 className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4">
              Be the StandOut Style That Speaks
            </h2>
            <p className="mb-6 text-sm sm:text-base lg:text-lg">
              Discover the latest trends in fashion and stand out with our
              unique outfits. Your style, your way.
            </p>
            <button
              className="bg-red-600 px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-lg font-semibold rounded shadow hover:bg-red-700 transition"
              onClick={() => router.push("/moreProducts")}
            >
              Shop Now
            </button>
          </div>

          {/* Bottom Half - Categories Section */}
          <div className="h-1/2 bg-gray-100 py-8 md:py-2">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-center mb-6 sm:mb-8 text-roboto">
              Shop by Category
            </h3>
            <div
              className="grid grid-cols-2 gap-4 px-4 sm:grid-cols-3"
              ref={categoryRef}
            >
              {categories?.slice(0, 3)?.map((val) => (
                <Link href={`/categories/${val.name}`} key={val._id}>
                  <CategoryCard
                    key={val._id}
                    title={val.name}
                    image={val.img}
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className=" mt-[400px] md:mt-[0px]">
        {loading ? <Skeleton height={500} /> : <Banner images={images} />}
      </div>
      <div className="bg-gray-100  py-4 self-center w-full flex flex-col gap-4">
        <h1 className="flex align-center justify-center font-bold text-3xl products-section  text-4xl text-poppins">
          Newly Dropped
        </h1>
        <div className="flex gap-4 self-center products-section flex flex-col ">
          <div className="flex gap-10  sm:flex-wrap mx-2">
            {loading
              ? Array(5)
                  .fill(0)
                  .map((_, index) => (
                    <Skeleton key={index} width={200} height={300} />
                  ))
              : products.slice(0, 5).map((product) => (
                  <Link href={`/checkout/${product.slug}`} key={product.slug}>
                    <Cart
                      title={product.name}
                      size={product.sizes}
                      img={product.thumbnail}
                      slug={product.slug}
                      price={product.price}
                    />
                  </Link>
                ))}
          </div>
        </div>
        <div className="flex justify-center mt-4 ">
          <button
            className="p-2 bg-black text-white rounded-md hover:bg-gray-700"
            onClick={() => router.push("/moreProducts")}
          >
            Show More
          </button>
        </div>
      </div>

      {/* Seasonal Favorites */}
      <div className="bg-gray-100  flex  flex-col gap-8 py-8">
        <h1 className="flex align-center justify-center font-bold text-3xl categories-section  text-4xl text-poppins">
          Seasonal Favorites
        </h1>
        <div className="flex gap-8 self-center categories-section text-white  sm:flex-wrap mx-2">
          {loading
            ? Array(3)
                .fill(0)
                .map((_, index) => (
                  <Skeleton key={index} width={150} height={200} />
                ))
            : categories.map((category) => (
                <Link href={`/categories/${category.name}`} key={category.name}>
                  <Seasonal
                    title={category.name.toUpperCase()}
                    img={category.img}
                  />
                </Link>
              ))}
        </div>
      </div>

      {/* Category Buttons */}
      <div className="self-center w-full  flex gap-6 flex-col categories-section bg-gray-100 py-6 ">
        <h1 className="font-bold self-center text-4xl text-poppins">
          Filter By Catgories
        </h1>
        <div className="self-center flex  gap-4">
          {categories.map((category) => (
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
        <div className="self-center flex gap-6 products-section  sm:flex-wrap justify-center">
          {filteredProducts.map((product) => (
            <Link href={`/checkout/${product.slug}`} key={product._id}>
              <Cart
                title={product.title}
                size={product.sizes}
                img={product.thumbnail}
                slug={product.slug}
                price={product.price}
              />
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-gray-100 flex flex-col gap-8  py-8">
        <h1 className="font-bold self-center text-4xl products-section align-center  text-4xl text-poppins">
          Recently Added
        </h1>
        <div className="self-center flex gap-8 products-section  sm:flex-wrap mx-2">
          {loading
            ? Array(4)
                .fill(0)
                .map((_, index) => (
                  <Skeleton key={index} width={200} height={300} />
                ))
            : recentProducts.map((product) => (
                <Link href={`/checkout/${product.slug}`} key={product._id}>
                  <Cart
                    img={product.thumbnail}
                    size={product.sizes}
                    title={product.title}
                    slug={product.slug}
                    price={product.price}
                  />
                </Link>
              ))}
        </div>
      </div>
    </div>
  );
}
