"use client"
import React, { useEffect,useState } from 'react';
import Error from '../../../../Component/ErrorFetch/FetchError';
import { useSession } from 'next-auth/react';
const MyOrdersPage = () => {
const[orders,setOrders]=useState([])
const {data:session}=useSession()

const[userId,setUserId]=useState("")
const [jwt,setJwt]=useState("")
useEffect(()=>{


if(jwt){
async function call(){

    try{
    

        const res=await fetch("/api/admin/my-orders",{
          method:"GET",
            headers:{
                "Authorization":`Bearer ${jwt}`
            }
        })
        const data=await res.json()
        console.log("My order"+JSON.stringify(data))
         const newOrders=data.filter(v=>v.userId===userId)
 console.log("filter"+newOrders)
        setOrders(newOrders)

    }catch(err){
        console.log(err)
    }
   
}
call()
}


else{
  setOrders([])
}



},[jwt])


useEffect(()=>{

  const jwt=session?.user?.accessToken
  const id=session?.user?.userId
  setJwt(jwt)
  setUserId(id)
},[session])

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
