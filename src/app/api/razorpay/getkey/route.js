export async function GET(req) {
  return new Response(JSON.stringify({ key: process.env.RAZORPAY_ID }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
