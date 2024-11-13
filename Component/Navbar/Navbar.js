"use client";

import React, { useState, useEffect } from "react";
import { FaUser, FaShoppingBag, FaHeart, FaSearch, FaBars } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { setTrue } from "../redux/cartToggle.js";
import Image from "next/image";
import CartDrawer from "./CartDrawer.js";
import BottomNavigationMobile from "./BottomNavigationMobile.js";
import SlideingNavigation from "./SlideingNavigation.js";

  
const Navbar = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [auth, setAuth] = useState(false);
  const [product, setProduct] = useState([]);
  
  const [change,setChange]=useState(true)
  const [totalPrice, setTotalPrice] = useState(0);
 const[jwt,setJwt]=useState(null)
 const[userId,setUserId]=useState('')
  const isToggled = useSelector((state) => state.toggle.isToggled);

  const router = useRouter();

  const dispatch = useDispatch();


  // Fetch and set jwt and userId from localStorage
useEffect(() => {
  const jwt = localStorage.getItem("jwt");
  const id = localStorage.getItem("userId");

  if (jwt) setJwt(jwt);
  if (id) setUserId(id);

  if (jwt) setAuth(true);  // Set auth state if jwt is present
}, []);

// Trigger syncDataToStrapi after both jwt and userId are set
useEffect(() => {
  if (jwt && userId) {
    console.log("Sync is called");
    syncDataToStrapi(jwt, userId);
    syncDataToStrapiWishList(jwt);
  }
}, [jwt, userId]); // Only run this effect when jwt and userId are available

const syncDataToStrapi = async (jwt) => {
  const data = localStorage.getItem("bags");

  if (data) {
    try {
      const parsedData = JSON.parse(data);
      
      const existingRes = await fetch(`${ process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/bags?filters[userId][$eq]=${userId}`,{
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${jwt}`,  // Add this line
        },
      });
      const existingData = await existingRes.json();
      console.log("Existing data: ", existingData);

      const newData = parsedData.filter(newItem => 
        !existingData.data.some(existingItem => 
          existingItem.img === newItem.img &&
          existingItem.title === newItem.title &&
          existingItem.color === newItem.color &&
          existingItem.size === newItem.size &&
          existingItem.price === newItem.price &&
          existingItem.quantity === newItem.quantity &&
          existingItem.userId === newItem.userId
        )
      );

      console.log("New data to sync: ", JSON.stringify(newData));

      const updatedNewData = newData.map(item => ({ ...item, userId }));

      if (updatedNewData.length > 0) {
        const res = await fetch(`${ process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/bag/bulk-create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwt}`,  // Add this line
          },
          body: JSON.stringify(updatedNewData),
       
        
        });

        if (!res.ok) throw new Error("Failed to sync new data to Strapi");

        const responseData = await res.json();
        console.log("New data synced successfully:", responseData);
        localStorage.removeItem("bags");
      } else {
        console.log("No new data to sync");
      }
    } catch (error) {
      console.error("Error syncing data to Strapi:", error);
    }
  }
};



//Sync wishllist
const syncDataToStrapiWishList = async (jwt) => {
  const data = localStorage.getItem("wishlist");


  if (data) {
    try {
      const parsedData = JSON.parse(data);
    
      const existingRes = await fetch(`${ process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/wishlists?filters[userId][$eq]=${userId}`,{   
         headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwt}`,  // Add this line
      },});
      const existingData = await existingRes.json();
      console.log("exist "+existingData)
      const newData = parsedData.filter(newItem => 
        !existingData.data.some(existingItem => 
          existingItem.img === newItem.img &&
          existingItem.title === newItem.title &&
          existingItem.color === newItem.color &&
          existingItem.size === newItem.size &&
          existingItem.price===newItem.price&&
          existingItem.quantity===newItem.quantity
        )
      );
      console.log( JSON.stringify(newData));
      const updatedNewData = newData.map(item => ({ ...item, userId }));
      if (updatedNewData.length > 0) {
        const res = await fetch(`${ process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/wishlist/bulk-create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwt}`,
          },
          body: JSON.stringify(updatedNewData),
        });

        if (!res.ok) throw new Error("Failed to sync new data to Strapi");
        
        const responseData = await res.json();
        console.log("New data synced successfully:", responseData);
        localStorage.removeItem("wishlist")
      } else {
        console.log("No new data to sync");
      }
    } catch (error) {
      console.error("Error syncing data to Strapi:", error);
    }
  }
};







  useEffect(() => {
   
    if (jwt) {
      fetchBagsFromAPI(jwt);
      
    } else {
      handleLocalStorageBags();
    }
  }, []);


  const fetchBagsFromAPI = async (jwt) => {
    try {
      const res = await fetch(`${ process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/bags?filters[userId][$eq]=${userId}&populate=*`,{
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${jwt}`,  // Add this line
        },
      })
      if (!res.ok) throw new Error("Failed to fetch bag data from API");

      const data = await res.json();
      setProduct(data.data);
      console.log("Fetched bag data:", data.data);
    } catch (error) {
      console.error("Error fetching bag data:", error);
    }
  };



  useEffect(() => {
   
    const total = product?.reduce((acc, val) => acc + val.price * val.quantity, 0);
    setTotalPrice(total);
}, [product]);



  const handleLocalStorageBags = () => {
    const data = JSON.parse(localStorage.getItem("bags"));
    if (data) {
      try {
        console.log(data)
        setProduct(data);
      } catch (error) {

        console.error("Error parsing 'bag' data from localStorage:", error);
      }
    }
  };



  useEffect(() => {
    if(jwt){
   fetchBagsFromAPI(jwt)
    }
    else{
    const data = localStorage.getItem("bags");
    if (data) {
      handleLocalStorageBags(); 
    }
  }
  }, [isToggled,change]);



  const updateQuantity = async (index, isIncrement) => {
    const updatedProducts = [...product];
    
    if (isIncrement) {
      updatedProducts[index].quantity += 1;
    } else if (updatedProducts[index].quantity > 1) {
      updatedProducts[index].quantity -= 1;
    } else if (updatedProducts[index].quantity === 1 && !isIncrement) {
      // Quantity is 0, remove from the bag
      if (jwt) {
        // Delete from API
        try {
          const res = await fetch(`${ process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/bags/${updatedProducts[index].id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${jwt}`,
            },
          });
          if (!res.ok) throw new Error("Failed to delete item from API");
          console.log("Item deleted from API");
        } catch (error) {
          console.error("Error deleting item from API:", error);
        }
      } else {
        // Remove from local storage
        updatedProducts.splice(index, 1);
        localStorage.setItem("bags", JSON.stringify(updatedProducts));
        console.log("Item removed from local storage");
      }
      // Update state after deletion
      setProduct(updatedProducts);
      return;
    }
  
    setProduct(updatedProducts);
    console.log("Updated products:", updatedProducts);
  
    const formattedData = updatedProducts.map(item => ({
      img: item.img,
      title: item.title,
      color: item.color,
      size: item.size,
      quantity: item.quantity,
      price: item.price,
      userId: item.userId,
    }));
  
    if (jwt) {
      // Update quantity in API if jwt is available
      try {
        const res = await fetch(`${ process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/bags/${updatedProducts[index].id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwt}`,
          },
          body: JSON.stringify({ quantity: updatedProducts[index].quantity }),
        });
        if (!res.ok) throw new Error("Failed to update quantity in API");
      } catch (error) {
        console.error("Error updating quantity:", error);
      }
    } else {
      // Update local storage if not using API
      localStorage.setItem("bags", JSON.stringify(formattedData));
    }
  };
  


  // Remove item from wishlist


async function Remove(id) {
  alert(id)
  if (jwt) {
    alert("jwt present")
    try {
      const res = await fetch(`${ process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/bags/${id}`, {
        method: "DELETE",
        headers:{
          "Authorization": `Bearer ${jwt}`,
        }
      });

      if (!res.ok) throw new Error(`Failed to remove item. Status: ${res.status}`);

      setProduct((prevProduct) => prevProduct.filter((item) => item.id !== id));
      console.log(`Item with id ${id} removed successfully.`);
    } catch (error) {
      console.error("Error removing item:", error);
    }
  } else {
    const data = JSON.parse(localStorage.getItem("bags") || "[]");
      if(data.length<=0){
        localStorage.setItem("bags",[]); 
      }else{
    const updatedData = data.filter(val => val.wishId!== id);
    localStorage.setItem("bags", JSON.stringify(updatedData)); // Save updated array as a JSON string
    setProduct(updatedData);
       }
  }
  setChange(v => !v);
}

  return (
    <div className="relative flex flex-col z-50">
      <div className="flex flex-col bg-white border-1 border-gray-100 hover:border-b-2 hover:border-black p-4 text-black">
        <div className="flex items-center justify-between">
          <button onClick={() => setIsNavOpen(!isNavOpen)}>
            <FaBars className="text-xl" />
          </button>
          <Link href="/">
            <Image src="/logo.jpg"  width={100} height={100} className="w-[100px] h-[5x]" alt="logo" />
          </Link>
          <div className="flex gap-4 items-center">
            <Link href="/search">
              <FaSearch className="text-lg" />
            </Link>
            <div className="hidden md:flex gap-4 items-center">
              <button onClick={() => router.push("/login")}>
                <FaUser className="text-lg" />
              </button>
              <button onClick={() => dispatch(setTrue())}>
                <FaShoppingBag className="text-lg" />
              </button>
              <button onClick={() => router.push("/wishlist")}>
                <FaHeart className="text-lg" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <SlideingNavigation auth={auth} setAuth={setAuth} isNavOpen={isNavOpen} setIsNavOpen={setIsNavOpen} product={product}/>
      {isNavOpen && <div className="fixed inset-0 bg-black opacity-50 z-40" onClick={() => setIsNavOpen(false)} />}

      <BottomNavigationMobile />
      <CartDrawer totalPrice={totalPrice} product={product} updateQuantity={updateQuantity} Remove={Remove} />
    </div>
  );
};

export default Navbar;
