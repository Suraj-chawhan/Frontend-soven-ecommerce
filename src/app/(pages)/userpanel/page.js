"use client";

import React, { useState, useEffect } from "react";
import Bag from "../../../../Component/Order";
import Error from "../../../../Component/ErrorFetch/FetchError";
import { handlePayment } from "../../../../Component/PaymentGateway/Razorpay/Razorpay";
import { useRouter } from "next/navigation";
import OrderConfirmationPopup from "../../../../Component/OrderConfirm";
import { useSession } from "next-auth/react";
import LoadingPage from "../../../../Component/LoadingPage";
import NotLoggedInPage from "../../../../Component/NotLoggedIn";

//Shipping Logic Add here
function ShippingForm({ formVal, setFormVal, onProceed }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormVal((prev) => ({ ...prev, [name]: value }));
  };

  const handleProceed = (e) => {
    e.preventDefault();
    onProceed();
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Shipping Information</h2>
      <form className="space-y-4">
        {["name", "contact", "address", "pincode", "state", "district"].map(
          (field) => (
            <div key={field} className="flex flex-col">
              <label className="font-semibold text-gray-700 capitalize">
                {field}
              </label>
              <input
                type="text"
                name={field}
                value={formVal[field] || ""}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded"
                required
              />
            </div>
          )
        )}
        <button
          onClick={handleProceed}
          className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
        >
          Proceed to Payment
        </button>
      </form>
    </div>
  );
}

// Order Summary Component
function OrderSummary({ bag, Remove, updateQuantity }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
      <div className="flex flex-col gap-4 h-full overflow-scroll">
        {bag.length > 0 ? (
          bag.map((val, index) => (
            <Bag
              key={index}
              index={index}
              product={val}
              Remove={() => Remove(val._id)}
              updateQuantity={updateQuantity}
            />
          ))
        ) : (
          <Error text="No Product Found" />
        )}
      </div>
    </div>
  );
}

// Main Checkout Page Component
export default function CheckoutPage() {
  const router = useRouter();
  const [view, setView] = useState("form");
  const [product, setProduct] = useState([]);
  const [formVal, setFormVal] = useState({});
  const [userId, setUserId] = useState("");
  const [total, setTotal] = useState(0);
  const [jwt, setJwt] = useState("");
  const [change, setChange] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    const savedAddress = localStorage.getItem("address");
    if (savedAddress) {
      console.log("present");
      setFormVal(JSON.parse(savedAddress));

      //Shipping Temp
      const fetchShippingRate = async () => {
        const url =
          "https://apiv2.shiprocket.in/v1/external/courier/serviceability/";

        const params = new URLSearchParams({
          pickup_postcode: "442917",
          delivery_postcode: "400060",
          cod: 0,
          length: 10,
          breadth: 15,
          height: 20,
          weight: 2.5,
        }).toString();

        try {
          const response = await fetch(`${url}?${params}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjU0MDg3NDcsInNvdXJjZSI6InNyLWF1dGgtaW50IiwiZXhwIjoxNzMyMjg0OTYzLCJqdGkiOiJyNVl4Q2pJOFBCM3A4emthIiwiaWF0IjoxNzMxNDIwOTYzLCJpc3MiOiJodHRwczovL3NyLWF1dGguc2hpcHJvY2tldC5pbi9hdXRob3JpemUvdXNlciIsIm5iZiI6MTczMTQyMDk2MywiY2lkIjo1MjExMDAwLCJ0YyI6MzYwLCJ2ZXJib3NlIjpmYWxzZSwidmVuZG9yX2lkIjowLCJ2ZW5kb3JfY29kZSI6IiJ9.n0ewOnS9nU-TB1zf7Q-4vTPZEXY0te10we-5WVBbnRQ`,
              "Content-Type": "application/json",
            },
          });

          const data = await response.json();
          console.log("Shipping rates:", data);

          const indiaPostEstimate = data.data.available_courier_companies.find(
            (company) =>
              company.courier_name === "India Post-Speed Post Air Prepaid"
          );

          if (indiaPostEstimate) {
            setEstimated(indiaPostEstimate.etd);
          } else {
            console.log("India Post not found");
          }
        } catch (error) {
          console.error("Error fetching shipping rates:", error);
        }
      };

      fetchShippingRate();

      setView("payment");
    }
  }, []);

  useEffect(() => {
    const jwtToken = session?.user?.accessToken;
    const id = session?.user?.userId;

    setUserId(id);
    setJwt(jwtToken);
  }, [session]);

  useEffect(() => {
    const fetchBagsFromAPI = async (jwt) => {
      try {
        const res = await fetch(`/api/admin/bag`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch bag data from API");

        const data = await res.json();
        const filterData = data.filter((val) => val.userId === userId);
        console.log(filterData);
        setProduct(filterData);
      } catch (error) {
        console.error("Error fetching bag data:", error);
      }
    };

    fetchBagsFromAPI(jwt);
  }, [userId, jwt, change]);

  const handleProceed = () => {
    localStorage.setItem("address", JSON.stringify(formVal));
    setView("payment");
  };

  useEffect(() => {
    const totalAmount = product?.reduce(
      (acc, val) => acc + val.price * val.quantity,
      0
    );
    setTotal(totalAmount);
  }, [product]);

  async function Remove(id) {
    if (jwt) {
      try {
        const res = await fetch(`/api/admin/bag/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });

        if (!res.ok)
          throw new Error(`Failed to remove item. Status: ${res.status}`);

        setProduct((prevProduct) =>
          prevProduct.filter((item) => item._id !== id)
        );
      } catch (error) {
        console.error("Error removing item:", error);
      }
    } else {
      const data = JSON.parse(localStorage.getItem("bags") || "[]");
      if (data.length <= 0) {
        localStorage.setItem("bags", []);
      } else {
        const updatedData = data.filter((val) => val.wishId !== id);
        localStorage.setItem("bags", JSON.stringify(updatedData)); // Save updated array as a JSON string
        setProduct(updatedData);
      }
    }
    setChange((v) => !v);
  }

  const updateQuantity = async (index, isIncrement) => {
    const updatedProducts = [...product];

    if (isIncrement) {
      updatedProducts[index].quantity += 1;
    } else if (updatedProducts[index].quantity > 1) {
      updatedProducts[index].quantity -= 1;
    } else if (updatedProducts[index].quantity === 1 && !isIncrement) {
      if (jwt) {
        try {
          const res = await fetch(
            `/api/admin/bag/${updatedProducts[index].id}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
              },
            }
          );
          if (!res.ok) throw new Error("Failed to delete item from API");
          console.log("Item deleted from API");
          alert("post");
        } catch (error) {
          console.error("Error deleting item from API:", error);
        }
      } else {
        updatedProducts.splice(index, 1);
        localStorage.setItem("bags", JSON.stringify(updatedProducts));
        console.log("Item removed from local storage");
      }

      setProduct(updatedProducts);
      return;
    }

    setProduct(updatedProducts);
    console.log("Updated products:", updatedProducts);

    const formattedData = updatedProducts.map((item) => ({
      img: item.img,
      title: item.title,
      color: item.color,
      size: item.size,
      quantity: item.quantity,
      price: item.price,
      userId: item.userId,
    }));

    if (jwt) {
      try {
        const res = await fetch(`/api/admin/bag/${updatedProducts[index].id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify({ quantity: updatedProducts[index].quantity }),
        });
        if (!res.ok) throw new Error("Failed to update quantity in API");
      } catch (error) {
        console.error("Error updating quantity:", error);
      }
    } else {
      localStorage.setItem("bags", JSON.stringify(formattedData));
    }
  };

  const [isOrderConfirmed, setOrderConfirmed] = useState(false);

  function showOrderConfirmationPopup() {
    setOrderConfirmed(true);
    setTimeout(() => {
      router.push("/my-orders");
    }, 3000);
  }

  const [estimated, setEstimated] = useState(null);

  if (status === "loading") {
    return <LoadingPage />;
  }

  if (!session) {
    return <NotLoggedInPage />;
  }
  return (
    <div className="flex flex-col md:flex-row gap-8 p-8 bg-gray-100 min-h-screen">
      <button
        onClick={() => router.back()}
        className="self-start mb-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-300 ease-in-out transform hover:scale-105"
      >
        ← Go Back
      </button>
      {view === "payment" && (
        <aside className="md:w-[70%]">
          <OrderSummary
            bag={product}
            total={total}
            Remove={Remove}
            updateQuantity={updateQuantity}
          />
        </aside>
      )}

      <main className="flex-1 md:w-[28%] bg-white p-6 rounded-lg shadow-md">
        {view === "form" ? (
          <ShippingForm
            formVal={formVal}
            setFormVal={setFormVal}
            onProceed={handleProceed}
          />
        ) : (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Payment Options</h2>

            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <button
              className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
              onClick={() =>
                handlePayment(
                  total,
                  product,
                  jwt,
                  showOrderConfirmationPopup,
                  estimated,
                  formVal.address,
                  userId
                )
              }
            >
              Confirm and Pay
            </button>
          </div>
        )}
      </main>
      <OrderConfirmationPopup showPopup={isOrderConfirmed} />
    </div>
  );
}
