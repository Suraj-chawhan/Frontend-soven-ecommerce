"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
// import Cart from "../../Component/Cart";
// import Seasonal from "../../Component/Seasonal";
import Banner from "../../Component/Banner";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import LoadingPage from "../../Component/LoadingPage";
import { useDispatch } from "react-redux";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);




function CategoryCard({ image, title, description }) {
  return (
    <div className="bg-white h-[400px] shadow-lg rounded overflow-hidden shadow-lg rounded   hover:-translate-y-2 hover:scale-105">
      <Image
        src={image}
        alt={title}
        width={100}
        height={300}
        className="w-full h-[300px] object-cover"
      />
      <div className="p-4">
        <h4 className="text-2xl font-bold mb-2">{title}</h4>
       
      </div>
    </div>
  );
}



function Cart({title,img,price,size,slug}) {
  return (
<div className="w-[300px] flex flex-col items-center shadow-lg rounded overflow-hidden  gap-1 opacity-100 transition-all duration-300 hover:-translate-y-2 hover:scale-105">
     <Image  src={img} width={300} height={400}   className="width-[300px] h-[400px] rounded-2xl" alt={`${title}`} priority /> 
    <h1>{title}</h1>
    <p>INR {price} rs</p>
    <div className="flex gap-4 text-gray-300 ">   
  {
    size.map((val,index)=> <Link href={`/checkout/${slug}`} className=' hover:text-red-500 hover:border-b-2 hover:border-black ' key={index}>{val.size}</Link>)
  }
  </div>

   </div>
  )
}


function Seasonal({title,img}) {
  return (
   <div className="relative transition-all duration-300 shadow-lg rounded overflow-hidden  hover:-translate-y-2 hover:scale-105">
    <Image src={img} width={350} height={300} className='w-[300px] h-[500px] rounded-2xl' priority  />
    <h1 className="absolute bottom-0 left-0 text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-pink-500 to-purple-500">
  {title}
</h1>

   </div>
  )
}



export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("trouser");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [images, setImages] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { data: session, status } = useSession(); // Use `status` to handle session state
  const router = useRouter();
  const dispatch = useDispatch();

  const containerRef = useRef(); // Reference for the main container
  const categoryRef=useRef()
  // Redirect admin users to the admin page
  useEffect(() => {
    if (session?.user?.role === "admin") {
      const redirected = localStorage.getItem("adminRedirected");
      if (!redirected) {
        localStorage.setItem("adminRedirected", "true");
        router.push("/admin");
      }
    }
  }, [session, router]);

  // Fetch data for products, categories, and banners
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

        setProducts(productData);
        setCategories(categoryData);
        setImages(imageData);

        const sortedProducts = productData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setRecentProducts(sortedProducts.slice(0, 5));

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

  // GSAP Animations
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

    return () => ctx.revert(); // Cleanup GSAP context on unmount
  }, [session]);




  useEffect(() => {
    if (!status==="loading" && categoryRef?.current?.children) {
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
  }, [status,categoryRef]);
  

  if (status === "loading") {
    return <LoadingPage />;
  }

  return (
    <div className="flex flex-col gap-10 relative overflow-hidden w-full h-full" ref={containerRef}>
      {/* Banner Section */}
      <div className="flex w-full h-screen">
      {/* Left Side - Image */}
      <div
        className="w-[50%] h-full bg-cover bg-center"
        style={{
          backgroundImage: `url(${images[0]?.img})`,
        }}
      ></div>

      {/* Right Side */}
      <div className="w-[50%] flex flex-col">
        {/* Top Half */}
        <div
          className="h-[50%] flex flex-col justify-center items-start p-8 bg-cover bg-center text-white"
          style={{ backgroundImage: `url(${images[1]?.img})` }}
        >
          <h2 className="text-4xl font-bold mb-4">Style That Speaks</h2>
          <p className="mb-6 text-lg">
            Discover the latest trends in fashion and stand out with our unique
            outfits. Your style, your way.
          </p>
          <button className="bg-red-600 px-6 py-3 text-lg font-semibold rounded shadow hover:bg-red-700 transition" onClick={()=>router.push("/moreProducts")}>
            Shop Now
          </button>
        </div>

        {/* Bottom Half - Categories Section */}
        <div className="h-[50%] bg-gray-100 py-12"   >
          <h3 className="text-3xl font-semibold text-center mb-8">
            Shop by Category
          </h3>
          <div className="grid grid-cols-3 gap-4 px-6"  ref={categoryRef} >
           {
            categories.slice(0,3)?.map(val=>{
              return(
                <CategoryCard  key={val._id} title={val.name} image={val.img}  />
              )
            })
           }
          </div>
        </div>
      </div>
    </div>

      <div className="banner-section">
        {loading ? <Skeleton height={500} /> : <Banner images={images} />}
      </div>
    <div className="bg-gray-100  py-4 self-center w-full flex flex-col gap-4">
     
      <h1 className="flex align-center justify-center font-bold text-3xl products-section">
        Newly Dropped
      </h1>
      <div className="flex gap-4 self-center products-section flex flex-col ">
        <div className="flex gap-10 ">
        {loading
          ? Array(5)
              .fill(0)
              .map((_, index) => <Skeleton key={index} width={200} height={300} />)
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
          <button className="p-2 bg-black text-white rounded-md hover:bg-gray-700" onClick={()=>router.push("/moreProducts")}>
            Show More
          </button>
        </div>
      </div>

      {/* Seasonal Favorites */}
      <div className="bg-gray-100  flex  flex-col gap-8 py-8">
      <h1 className="flex align-center justify-center font-bold text-3xl categories-section">
        Seasonal Favorites
      </h1>
      <div className="flex gap-8 self-center categories-section text-white">
        {loading
          ? Array(3)
              .fill(0)
              .map((_, index) => <Skeleton key={index} width={150} height={200} />)
          : categories.map((category) => (
              <Link href={`/categories/${category.name}`} key={category.name}>
                <Seasonal title={category.name.toUpperCase()} img={category.img} />
              </Link>
            ))}
      </div>
      </div>

      {/* Category Buttons */}
      <div className="self-center w-full  flex gap-6 flex-col categories-section bg-gray-100 py-6">
        <h1 className="font-bold self-center text-4xl">Filter By Catgories</h1>
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
      <div className="self-center flex gap-6 products-section">
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
      {/* Recently Added Products */}
      <div className="bg-gray-100 flex flex-col gap-8  py-8">
      <h1 className="font-bold self-center text-4xl products-section align-center ">Recently Added</h1>
      <div className="self-center flex gap-8 products-section">
        {loading
          ? Array(4)
              .fill(0)
              .map((_, index) => <Skeleton key={index} width={200} height={300} />)
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





