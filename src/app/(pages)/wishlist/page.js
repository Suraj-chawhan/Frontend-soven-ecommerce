"use client"

import React, { useEffect, useState } from 'react';
import Error from '../../../../Component/ErrorFetch/FetchError';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
function WishlistPage() {
  
  const [product, setProduct] = useState([]);
  const [change, setChange] = useState(false);
  const [jwt, setJwt] = useState(null);
  const { data: session } = useSession(); 
  const[userId,setUserId]=useState("")
  useEffect(() => {
    
    setJwt(session?.user?.accessToken);
    setUserId(session?.user?.userId)
  }, [session]);

  useEffect(() => {
   
    if (jwt) {
      const call = async () => {
        try {
          const res = await fetch(`/api/admin/wishlists`,{
            method: "GET",
            headers:{
              "Authorization": `Bearer ${jwt}`,
            }
          });

          const data = await res.json();
        
          const products=data?.filter(val=>val.userId===userId)
          console.log(products)

          setProduct(products); // Set data or empty array
        } catch (error) {
          console.error("Error fetching wishlist:", error);
        }
      };
      call();
    } else {
      const wishlistData = localStorage.getItem("wishlist");
      const wishlist = wishlistData ? JSON.parse(wishlistData) : []; // Only parse if wishlistData is not null
      setProduct(wishlist);
    }
  }, [change, jwt]);

  // Remove item from wishlist
  async function Remove(id) {
    alert(JSON.stringify(id))
    if (jwt) {
      try {
        const res = await fetch(`/api/admin/wishlists/${id}`, {
          method: "DELETE",
          headers:{
            "Authorization": `Bearer ${jwt}`,
          }
        });

        if (!res.ok) throw new Error(`Failed to remove item. Status: ${res.status}`);

        setProduct((prevProduct) => prevProduct.filter((item) => item._id !== id));
        console.log(`Item with id ${id} removed successfully.`);
      } catch (error) {
        console.error("Error removing item:", error);
      }
    } else {
      const data = JSON.parse(localStorage.getItem("wishlist") || "[]");
        if(data.length<=0){
          localStorage.setItem("wishlist",[]); 
        }else{
      const updatedData = data.filter(val => val.wishId!== id);
      localStorage.setItem("wishlist", JSON.stringify(updatedData)); // Save updated array as a JSON string
      setProduct(updatedData);
         }
    }
    setChange(v => !v);
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">My Wishlist</h1>

        {product.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {product.map(item => (
              <div key={item._id} className="bg-white shadow-lg rounded-lg overflow-hidden">
                <Image
                  src={item.img}
                  alt={item.name}
                  width={100}
                  height={100}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-800">{item.name}</h2>
                  <p className="text-gray-600 mt-2">{item.price}</p>
                  <button
                    className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
                    onClick={() =>console.log(item)} // Adjust for local storage ID
                  >
                    Remove from Wishlist
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-[-100px]">
            <Error text="No Product Added yet" />
          </div>
        )}
      </div>
    </div>
  );
}

export default WishlistPage;
