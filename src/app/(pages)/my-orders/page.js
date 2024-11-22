"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Error from "../../../../Component/ErrorFetch/FetchError";
import LoadingPage from "../../../../Component/LoadingPage";
import { useRouter } from "next/navigation";
import Image from "next/image";
const MyOrdersPage = () => {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { data: session, status } = useSession();
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

  if (status === "loading") {
    return (
      <div>
        <LoadingPage />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <button
          onClick={() => router.back()}
          className=" mb-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-300 ease-in-out transform hover:scale-105"
        >
          ← Go Back
        </button>
        <Error text={error} />
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div>
        <button
          onClick={() => router.back()}
          className=" mb-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-300 ease-in-out transform hover:scale-105"
        >
          ← Go Back
        </button>
        <Error text="No orders found." />
      </div>
    );
  }

  function convert(timestamp) {
    const readableDate = new Date(timestamp);
    return readableDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }); // Example format: "November 21, 2024"
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <button
        onClick={() => router.back()}
        className="self-start mb-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-300 ease-in-out transform hover:scale-105"
      >
        ← Go Back
      </button>
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
        My Orders
      </h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white shadow-lg rounded-lg p-4 flex flex-col items-center space-y-4"
          >
            <Image
              src={order.img}
              alt={order.title}
              width={150}
              height={150}
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-lg object-cover"
            />
            <div className="w-full text-center">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                {order.title}
              </h2>
              <p className="text-gray-600 text-sm">
                Order ID: {order.razorpay_order_id}
              </p>
              <p className="text-gray-600 text-sm">
                Payment ID: {order.razorpay_payment_id}
              </p>
              <p className="text-gray-600 text-sm">
                Ordered on: {convert(order.date)}
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
