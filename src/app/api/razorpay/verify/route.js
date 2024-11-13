import crypto from "crypto";

export async function POST(req) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, currency,payment_method } = await req.json();
    const razorpaySecret = process.env.RAZORPAY_SECRET;
    const strapiJwt = process.env.NEXT_PUBLIC_STRAPI_JWT;

    if (!razorpaySecret || !strapiJwt) {
      console.error("Environment variables missing: RAZORPAY_SECRET or STRAPI_JWT");
      return new Response(
        JSON.stringify({ message: "Missing environment variables" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const hmac = crypto.createHmac("sha256", razorpaySecret);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generated_signature = hmac.digest("hex");
    if (generated_signature === razorpay_signature) {
      const paymentData = {
        data: {
          razorpay_order_id,
          razorpay_payment_id,
          amount,
          currency,
          order_status: "success",
          payment_method,
        },
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${strapiJwt}`,
        },
        body: JSON.stringify(paymentData),
      });
      if (!response.ok) {
        const errorMessage = await response.text(); // Get the error message from Strapi
        console.error("Failed to save payment data to Strapi:", errorMessage);
        return new Response(
          JSON.stringify({ message: "Payment verification successful, but data storage failed", error: errorMessage }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }
      return new Response(
        JSON.stringify({ message: "Payment verified and stored successfully",status:true}),
    );
    } else {
      return new Response(
        JSON.stringify({ message: "Signature verification failed" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error("Error in payment verification:", error.message);
    return new Response(
      JSON.stringify({ message: "Error processing request", error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
