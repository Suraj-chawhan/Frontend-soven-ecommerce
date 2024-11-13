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

function Page() {
  const [isOpen, setIsOpen] = useState({ a: false, b: false, c: false, cart: false });
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [catagory, setCatagory] = useState(null);
  const [suggestion, setSuggestion] = useState("");
  const [size, setSize] = useState([]);
  const [thumbnail, setThumbnail] = useState("");
 const dispatch=useDispatch()
 const[jwt,setJwt]=useState(null)
const[userId,setUserId]=useState("")
const[colors,setColors]=useState([])
const [col, setCol] = useState(null);


function handleColorChange(event) {
  setCol(event.target.value);
}

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`${ process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/products?filters[slug][$eq]=${slug}&populate=*`);
        const data = await res.json();
        if (data?.data?.length > 0) {
          setProduct(data?.data[0]);
          setSuggestion(data?.data[0]?.catagories[0].name);
          setSize(data?.data[0]?.size.sizes);
          setThumbnail(data?.data[0]?.thumbnail.url);
          const productColors = data?.data[0]?.color.colors || [];
          setColors(productColors)
          const enabledColors = productColors.filter((color) => color.enabled);

          if (enabledColors.length === 1) {
            setCol(enabledColors[0].color);
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    }
    fetchData();

  }, [slug]);


  useEffect(()=>{
     const userId=localStorage.getItem("userId")
    const jwt = localStorage.getItem("jwt");
  
    setJwt(jwt)
    setUserId(userId)
  },[])


  useEffect(()=>{
   
    async function call(){
      console.log(suggestion)
      const res=await fetch(`${ process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/products?filters[catagories][name][$eq]=${suggestion}&populate=*`)
      const data=await res.json()
      setCatagory(data.data)
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
      img: thumbnail,
      title: product?.title,
      color:col,
      size: selectedSize,
      quantity: 1,
      price:product?.price,
      userId: userId,
      bagId:product?.documentId
    };
  
    if (jwt) {
      async function postData() {

        const res = await fetch(`${ process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/bags?filters[userId][$eq]=${userId}&filters[bagId][$eq]=${product?.documentId}`,{
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwt}`,
          },
        });
        const data = await res.json();
        console.log(data)
        if (data.data.length===0) {
          await fetch(`${ process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/bag/bulk-create`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${jwt}`,
            },
            body: JSON.stringify([productData]),
          });
          dispatch(setTrue());
        } else {
      
          const existingItemId = data.data[0].id;
          const updatedQuantity = data.data[0].quantity + 1;
          
          await fetch(`${ process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/bags/${existingItemId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${jwt}`, 
            },
            body: JSON.stringify({ quantity: updatedQuantity }),

          });
          dispatch(setTrue());
        }
      }
      postData();
    } else {
    
      const bag = JSON.parse(localStorage.getItem('bags')) || [];
      const existingItemIndex = bag.findIndex(item => item.bagId === product.documentId);
  
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
    const userId=localStorage.getItem("userId")

    const productData={img:product?.thumbnail.url,wishId:product?.documentId,price:product.price,slug:product.slug,userId:userId,name:product.title}
   if (jwt) {
     
     async function postData() {
      const res = await fetch(`${ process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/wishlists?filters[userId][$eq]=${userId}&filters[id][$eq]=${productData.wishId}`,{
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${jwt}`,
        },
      });
      const data = await res.json();
      if(data.data.length===0){
      const res=await fetch(`${ process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/wishlist/bulk-create`,{
        method:"POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${jwt}`,
        },
        body:JSON.stringify([productData])
      })
    }
    else{
      alert("Item Already Exist")
    }

     }
     postData();
   } else {
   
     const bag = JSON.parse(localStorage.getItem('wishlist')) || [];
     const itemExists = bag.some(item => item.wishId === productData.wishId);
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


  
  return (

    <div className='flex flex-col gap-4 w-[100%] h-[100%]'>
    <div className="flex gap-8 mx-auto p-4 lg:p-8 border-b-2 border-gray-300 w-full h-full">
      <div  className='flex gap-4  h-full' >
     <div className='flex flex-col gap-4 overflow-y-auto'>
     {product?.sideview?.length > 0 ? (
    product.sideview.map((val, index) => (
      <Image
        key={index}
        src={val.url}
        width={100}
        height={100}
        alt={`sideview ${index}`}
        onClick={() => handleImageClick(val.url)}
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
            val.enable ? (
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
          {colors.map((color) =>
            color.enabled ? (
              <option
                key={color.color}
                value={color.color}
                style={{ backgroundColor: color.code }}
              >
                {color.color}
              </option>
            ) : null
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
        <Description isOpen={isOpen.a} call={() => call(1)} val={product?.description[0].children[0].text} title={"Description"} />
        <Description isOpen={isOpen.b} call={() => call(2)} val={product?.moreinformation[0].children[0].text} title={"More Information"} />
        <Description isOpen={isOpen.c} call={() => call(3)} val={product?.returnexchange[0].children[0].text} title={"Return Exchange"} />
      </div>

      
    </div>
    <h1 className='font-bold text-4xl self-center'>You May Like</h1>
    <div className='flex gap-2'>
    {
      catagory?.map((val,i)=>(<Link href={`/checkout/${val.slug}`} key={i}><Cart key={i} size={val.size.sizes} title={val.title} img={val.thumbnail.url}  slug={val.slug} price={val.price} /></Link>))
      }
      </div>
    </div>
  );
}

export default Page;
