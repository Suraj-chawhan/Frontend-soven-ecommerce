"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { FaHeart } from 'react-icons/fa';
import Cart from '../../../../../Component/Cart';
import Button from '../../../../../Component/Chekout/Button';
import Description from '../../../../../Component/Chekout/Description';
import Image from 'next/image';
import Data from '../../../../../Component/Chekout/Data';
import { useDispatch,useSelector } from 'react-redux';
import { setFalse, setTrue } from '../../../../../Component/redux/cartToggle'; 
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import LoadingPage from '../../../../../Component/LoadingPage';
function Page() {
  const [isOpen, setIsOpen] = useState({ a: false, b: false, c: false, cart: false });
  const { slug } = useParams();
  const [product, setProduct] = useState({});
  const [catagory, setCatagory] = useState(null);
  const [suggestion, setSuggestion] = useState("");
  const [size, setSize] = useState([]);
  const [thumbnail, setThumbnail] = useState("");
 const dispatch=useDispatch()
 const[jwt,setJwt]=useState(null)
const[userId,setUserId]=useState("")
const[colors,setColors]=useState([])
const [col, setCol] = useState(null);
const{data:session,status}=useSession()

function handleColorChange(event) {
  setCol(event.target.value);
}

  useEffect(() => {
  
    async function fetchData() {
      try {
        const res = await fetch(`/api/admin/products`);
        const data = await res.json();
       const filterData=data.filter(v=>v.slug===slug)
      

        if (filterData) {
          setThumbnail(filterData[0].thumbnail);
          setProduct(filterData[0]);
      
          setSuggestion(filterData[0].categories);
          setSize(filterData[0].sizes);
        
          const productColors = filterData[0].colors || [];
          setColors(productColors)
          console.log(filterData[0].colors )
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    }
    fetchData();

  }, [slug]);


  useEffect(()=>{
    const id=session?.user?.userId
    const token=session?.user?.accessToken
    
    setJwt(token)
    setUserId(id)
  },[session])


  useEffect(()=>{
   
    async function call(){
      console.log(suggestion)
      const res=await fetch(`/api/admin/products`)
      const data=await res.json()
      const filterData=data.filter(val=>val.categories===suggestion)
      setCatagory(filterData)
      }
     call()
  },[suggestion])


  const handleImageClick = (url) => {
    setThumbnail(url);
  };

  function call(val) {
    if (val === 1) setIsOpen((v) => ({ ...v, a: !v.a }));
    if (val === 2) setIsOpen((v) => ({ ...v, b: !v.b }));
    if (val === 3) setIsOpen((v) => ({ ...v, c: !v.c }));
  }




  const addToBag = () => {

    const productData = {
      img: product?.thumbnail,
      title: product?.title,
      color: col,
      size: selectedSize,
      quantity: 1,
      price: product?.price,
      userId: userId,
      bagId: product?._id,
    };
    
  
    if (jwt) {
      async function postData() {
        try {
          const res = await fetch(`/api/admin/bag`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwt}`,
            },
          });
      
          if (!res.ok) throw new Error(`Fetch error: ${res.statusText}`);
      
          const data = await res.json();
          
          const filterData = data.filter(
            (v) =>
              v.userId === userId &&
              v.bagId === product._id &&
              v.size === productData.size &&
              v.color === productData.color
          );
      
          if (filterData.length === 0) {
            console.log("No data")
            const res=await fetch(`/api/admin/bag`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
              },
              body: JSON.stringify(productData),
            });
            const data=res.json()
            if(res.ok){console.log("Ok")}
            else{console.log(data)}
            dispatch(setTrue());
          } else {
            const existingItemId = filterData[0]._id;
            const updatedQuantity = filterData[0].quantity + 1;
      
            await fetch(`/api/admin/bag/${existingItemId}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
              },
              body: JSON.stringify({ quantity: updatedQuantity }),
            });
            dispatch(setTrue());
          }
        } catch (error) {
          console.error("Error in postData:", error);
        }
      }
      
      postData();
    } else {
    
      const bag = JSON.parse(localStorage.getItem('bags')) || [];
      const existingItemIndex = bag.findIndex(item => item.bagId === product._id);
  
      if (existingItemIndex !== -1) {
        bag[existingItemIndex].quantity += 1;
      } else {
        bag.push(productData);
      }
  
      localStorage.setItem('bags', JSON.stringify(bag));
      dispatch(setTrue());
    }
   
  };


  



  function AddtoWishList(){
   

    const productData={title:product?.title,img:product?.thumbnail,price:product?.price,slug:product.slug,userId:userId}
   if (jwt) {
     
     async function postData() {
      const res = await fetch("/api/admin/wishlists",{
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${jwt}`,
        },
      });
      
      const data = await res.json();
   

      const filterData=data.filter(v=>v.slug===productData.slug && v.userId===userId )

 
      if(filterData.length===0){
        console.log("no data")
 
         const res=await fetch(`/api/admin/wishlists`,{
        method:"POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${jwt}`,
        },
        body:JSON.stringify(productData)
      })
    }
    else{
      alert("Item Already Exist")
    }

     }
     postData();
   } else {
   
     const bag = JSON.parse(localStorage.getItem('wishlist')) || [];
     const itemExists = bag.some(item => item.slug === productData.slug);
     if(!itemExists){
      bag.push(productData)
      console.log(bag)
     localStorage.setItem('wishlist', JSON.stringify(bag));
     }
     else{
      alert("Item already Exist")
     }
   } 
  }

  const [selectedSize, setSelectedSize] = useState(null);

  function onClick(size) {
    setSelectedSize(size); 
  }


  if(status==="loading"){
    return <LoadingPage/>
  }
 
  
  return (

    <div className='flex flex-col gap-4 w-[100%] h-[100%]'>
      <button
  onClick={() => router.back()}
  className="self-start mb-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-300 ease-in-out transform hover:scale-105"
>
  ← Go Back
</button>

    <div className="flex gap-8 mx-auto p-4 lg:p-8 border-b-2 border-gray-300 w-full h-full">
      <div  className='flex gap-4  h-full' >
     <div className='flex flex-col gap-4 overflow-y-auto'>
     {product?.sideview?.length > 0 ? (
    product.sideview.map((val, index) => (
      <Image
        key={index}
        src={val.thumbnail}
        width={100}
        height={100}
        alt={`sideview ${index}`}
        onClick={() => handleImageClick(val.thumbnail)}
      />
    ))
  ) : (
    <h1>No sideview image</h1>
  )}
     </div>
     <div   className='w-[100vh] h-[50%] p-4' >
      <Image src={thumbnail} width={100} height={100}   className='w-[70%] h-[550px]' alt="thumbnail"/>
     </div>
     </div>
     
      <div className="w-[800px]  h-[100%] flex flex-col gap-8">
    
        <div>
          <h1 className="text-2xl font-bold">{product?.title}</h1>
          <p className="text-lg text-gray-600">INR {product?.price}</p>
        </div>
        <Data price={product?.price}/>
  
        <div>
          <h2 className="text-lg font-semibold">Select A Size</h2>
          <div className="flex gap-4 mt-2">
          {size.map((val) =>
            val.enabled ? (
              <Button
                key={val.size}
                val={val.size}
                onClick={onClick}
                enable={true}
                selected={selectedSize === val.size}
              />
            ) : null
          )}
          </div>
          <div>
        <h2 className="text-lg font-semibold">Select A Color</h2>
        <select
          value={col}
          onChange={handleColorChange}
          className="p-2 border border-gray-300 rounded-md"
        >
          <option value="" disabled>Select Color</option>
          {colors.map((color,index) =>
            color.enabled ? (
              <option
                key={color.color}
                value={color.color}
                
              >
                {color.color}
              </option>
            ) :<option key={index}>No color</option>
          )}
        </select>
      </div>

        </div>

        <div className="flex gap-4">
          <Button val={"Add To Bag"} onClick={addToBag} enable={col&&selectedSize?true:false} />
          <div className="relative w-[50%]">
            <FaHeart size="1.5em" className="absolute top-1/2 transform -translate-y-1/2 left-4" color="red" />
            <Button val={"Add To WishList"} enable={true} onClick={AddtoWishList}  />
          </div>
        </div>
        <Description isOpen={isOpen.a} call={() => call(1)} val={product?.description} title={"Description"} />
        <Description isOpen={isOpen.b} call={() => call(2)} val={product?.moreInformation} title={"More Information"} />
        <Description isOpen={isOpen.c} call={() => call(3)} val={product?.returnExchange} title={"Return Exchange"} />
      </div>

      
    </div>
    <h1 className='font-bold text-4xl self-center'>You May Like</h1>
    <div className='flex gap-2'>
    {
      catagory?.map((val,i)=>(<Link href={`/checkout/${val.slug}`} key={i}><Cart key={i} size={val.sizes} title={val.title} img={val.thumbnail}  slug={val.slug} price={val.price} /></Link>))
      }
      </div>
    </div>
  );
}

export default Page;
