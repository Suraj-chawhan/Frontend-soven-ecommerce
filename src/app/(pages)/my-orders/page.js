"use client"
import React, { useEffect,useState } from 'react';
import Error from '../../../../Component/ErrorFetch/FetchError';
const MyOrdersPage = () => {
const[orders,setOrders]=useState([])
useEffect(()=>{
async function call(){

  const jwt=localStorage.getItem("jwt")
  const userId=localStorage.getItem("userId")
    try{
    

        const res=await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/my-orders?filters[userId]=${userId}`,{
            headers:{
                "Authorization":`Bearer ${jwt}`
            }
        })
        const data=await res.json()
     
        setOrders(data.data)
    }catch(err){
        console.log(err)
    }
}
call()
},[])

if(!orders)return <Error  text={"No orders Found"} />

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-6">My Orders</h1>
      <div className="space-y-4">
        {orders?.map((order) => (
          <div key={order.id} className="bg-white shadow-md rounded-lg p-4 flex flex-col lg:flex-row items-start lg:items-center">
            <img src={order.img} alt={order.title} className="w-24 h-24 rounded-lg object-cover lg:mr-6" />
            <div className="flex flex-col w-full">
              <h2 className="text-lg font-semibold text-gray-800">{order.title}</h2>
              <p className="text-gray-600 mb-1">Order ID: {order.documentId}</p>
              <p className="text-gray-600 mb-1">Ordered on: {order.date}</p>
              <p className={`text-sm font-semibold`}>
               Order staus             </p>
              <div className="flex flex-col lg:flex-row justify-between w-full mt-4">
                <p className="text-gray-700">Quantity: {order.quantity}</p>
                <p className="text-gray-700">Order Total: ${order.price*order.quantity}</p>
                <p className="text-gray-700">Payment: Method:{order.payment_method}</p>
                <p className="text-gray-700">Delivery Estimate: {order.estimated_date} </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrdersPage;
