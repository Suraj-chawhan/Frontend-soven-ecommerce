// pages/api/phonepePayment.js
import crypto from "crypto";
import axios from "axios";

export async function POST(req) {
  try {
    const { amount, orderId } = await req.json();

    // Validate input data
    if (!amount || !orderId) {
      return new Response(JSON.stringify({ error: "Amount and Order ID are required." }), { status: 400 });
    }

    const payload = {
      merchantId: "PGTESTPAYUAT",
      amount: amount,
      orderId: orderId,
    };
    
    const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString("base64");
    const saltKey = "96434309-7796-489d-8924-ab56988a6076"; // Your provided salt key
    const saltIndex = "1" // Ensure this is a string

    // Concatenate the payload with the endpoint and salt key for hashing
    const concatenatedString = `${payloadBase64}/pg/v1/pay${saltKey}`;

    // Generate the SHA256 hash signature
    const hmac = crypto.createHmac("sha256", saltKey);
    hmac.update(concatenatedString);
    const hash = hmac.digest("hex");

    // Create the X-VERIFY header
    const xVerifyHeader = `${hash}###${saltIndex}`;

    const options = {
      method: "POST",
      url: "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay",
      headers: {
        "Content-Type": "application/json",
        "X-VERIFY": xVerifyHeader,
      },
      data: payload,
    };

    // Implement retry logic with exponential backoff
    const MAX_RETRIES = 5;
    let retries = 0;
    let response;

    while (retries < MAX_RETRIES) {
      try {
        response = await axios.request(options);
        return new Response(JSON.stringify(response.data), { status: 200 });
      } catch (error) {
        if (error.response && error.response.status === 429) {
          // If rate limit is hit, wait before retrying
          const waitTime = Math.pow(2, retries) * 1000; // Exponential backoff
          console.warn(`Rate limit hit, retrying in ${waitTime / 1000}s...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          retries++;
        } else {
          // Handle other errors
          console.error("PhonePe Payment Error:", error.response ? error.response.data : error);
          return new Response(JSON.stringify({ error: "Payment processing failed" }), { status: error.response?.status || 500 });
        }
      }
    }

    // If we reach here, it means we exhausted retries
    return new Response(JSON.stringify({ error: "Exceeded maximum retries. Please try again later." }), { status: 500 });
  } catch (error) {
    console.error("PhonePe Payment Error:", error);
    return new Response(JSON.stringify({ error: "Payment processing failed due to a network error." }), { status: 500 });
  }
}
