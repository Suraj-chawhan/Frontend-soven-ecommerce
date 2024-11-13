"use client"



const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const fetchData = async (amount) => {
  const res = await fetch("/api/razorpay/getkey");
  const data = await res.json();
  const getkey = data.key;

  const re1 = await fetch("/api/razorpay/createOrder", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ amount }),
  });

  const data2 = await re1.json();
  return { getkey, order: data2.order };
};

const verifyPayment = async (response) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = response;
  const verifyRes = await fetch("/api/razorpay/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    }),
  });

  return await verifyRes.json();
};

// Function to post bag data to myorder API
const postOrder = async (products, jwt,payment_method,estimated_date,formVal) => {
  try {
    // Extract required fields from each product
    const extractedProducts = products.map(product => ({
      size: product.size,
      color: product.color,
      userId: product.userId,
      img: product.img,
      price: product.price,
      title: product.title,
      quantity:product.quantity,
      payment_method,
      estimated_date,
      address:formVal
    }));

    console.log(extractedProducts)
    console.log(jwt)

    const response = await fetch(`${ process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/my-order/bulk-create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwt}`,
      },
      body: JSON.stringify(extractedProducts),
    });

    if (!response.ok) throw new Error("Failed to post order data");
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error posting order data:", error);
  }
};


const deleteOrder = async (products,jwt) => {
  try {
    // Loop through each product's ID
    for (const product of products) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/bags/${product.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${jwt}`, // Include authorization if required
        },
      });

      if (!res.ok) {
        console.log(`Error while deleting product with ID ${product.id}`);
        continue;
      }
      console.log(`Deleted product with ID ${product.id} successfully`);
    }
  } catch (err) {
    console.log("An error occurred:", err);
  }
};




export const handlePayment = async (amount, products,jwt,showOrderConfirm,estimated_date,formVal) => {  // Pass `router` if you use Next.js router
  const isScriptLoaded = await loadRazorpayScript();
  if (!isScriptLoaded) {
    console.error("Razorpay SDK failed to load");
    return false;
  }

  try {
    const { getkey, order } = await fetchData(amount);
    const options = {
      key: getkey,
      amount: order.amount,
      currency: "INR",
      name: "Acme Corp",
      description: "Test Transaction",
      order_id: order.id,
      callback_url: "/api/razorpay/verify",
      prefill: {
        name: "Gaurav Kumar",
        email: "gaurav.kumar@example.com",
        contact: "9000090000",
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
      handler:async function (response) {
       const  updatedResponse={...response,payment_method:"Razorpay"}
        const verifyData = await verifyPayment(updatedResponse);
        
        if (verifyData.status) {
          console.log("Payment verification successful:", verifyData);
          postOrder(products,jwt,"Razorpay",estimated_date,formVal)
          deleteOrder(products,jwt)
          showOrderConfirm()
        } else {
          console.error("Payment verification failed:", verifyData);
        }
      },
    };
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  } catch (err) {
    console.log(err);
  }
};
