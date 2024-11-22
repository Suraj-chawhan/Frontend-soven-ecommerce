import crypto from "crypto";
import { getToken } from "next-auth/jwt";

export async function POST(req) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
      currency,
      payment_method,
      userId,
    } = await req.json();

    console.log(
      "Received Data:",
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
      currency,
      payment_method,
      userId
    );

    const razorpaySecret = process.env.RAZORPAY_SECRET;
    const token = await getToken({ req });

    if (!razorpaySecret || !process.env.NEXT_PUBLIC_API_URL || !token) {
      console.error("Environment variables missing or token not found");
      return new Response(
        JSON.stringify({
          message: "Missing environment variables or unauthorized",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const hmac = crypto.createHmac("sha256", razorpaySecret);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generated_signature = hmac.digest("hex");

    if (generated_signature === razorpay_signature) {
      const paymentData = {
        razorpay_order_id,
        razorpay_payment_id,
        amount,
        currency,
        payment_method,
        userId,
        order_status: "success",
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/verifyPayment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.accessToken}`,
          },
          body: JSON.stringify(paymentData),
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        console.error("Failed to save payment data in Strapi:", errorMessage);
        return new Response(
          JSON.stringify({
            message: "Payment verified, but failed to save data",
            error: errorMessage,
          }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({
          message: "Payment verified and saved successfully",
          razorpay_order_id,
          razorpay_payment_id,
          status: true,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } else {
      console.error("Signature verification failed");
      return new Response(
        JSON.stringify({ message: "Invalid payment signature" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error("Error in payment verification:", error.message);
    return new Response(
      JSON.stringify({
        message: "Error processing request",
        error: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
