"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Error from "../../../../Component/ErrorFetch/FetchError";
import LoadingPage from "../../../../Component/LoadingPage";

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { data: session ,status} = useSession();
  const [userId, setUserId] = useState("");
  const [jwt, setJwt] = useState("");

  useEffect(() => {
    if (session) {
      setJwt(session?.user?.accessToken || "");
      setUserId(session?.user?.userId || "");
    }
  }, [session]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!jwt || !userId) return;

      try {
        setLoading(true);
        const res = await fetch("/api/admin/my-orders", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch orders");

        const data = await res.json();
        const filteredOrders = data.filter((order) => order.userId === userId);
        setOrders(filteredOrders);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Unable to fetch your orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [jwt, userId]);


if(status==="loading"){
  return <LoadingPage/>
}


  if (error) {
    return <Error text={error} />;
  }

  if (!orders.length) {
    return <Error text="No orders found." />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">My Orders</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white shadow-lg rounded-lg p-4 flex flex-col items-center space-y-4"
          >
            <img
              src={order.img}
              alt={order.title}
              className="w-32 h-32 rounded-lg object-cover"
            />
            <div className="w-full text-center">
              <h2 className="text-xl font-semibold text-gray-800">
                {order.title}
              </h2>
              <p className="text-gray-600 text-sm">Order ID: {order.documentId}</p>
              <p className="text-gray-600 text-sm">
                Ordered on: {order.date}
              </p>
              <p
                className={`text-sm font-semibold mt-2 ${
                  order.status === "Delivered"
                    ? "text-green-600"
                    : "text-yellow-600"
                }`}
              >
                Order Status: {order.status}
              </p>
            </div>
            <div className="w-full flex flex-col items-center space-y-2">
              <p className="text-gray-700">
                Quantity: <span className="font-bold">{order.quantity}</span>
              </p>
              <p className="text-gray-700">
                Total:{" "}
                <span className="font-bold">
                  ${order.price * order.quantity}
                </span>
              </p>
              <p className="text-gray-700">
                Payment Method:{" "}
                <span className="font-bold">{order.payment_method}</span>
              </p>
              <p className="text-gray-700">
                Estimated Delivery:{" "}
                <span className="font-bold">{order.estimated_date}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrdersPage;
