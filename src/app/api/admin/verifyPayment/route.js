import PaymentVerify from "../../../../../Component/Admin/Mongodb/MongodbSchema/verifyPaymentSchema";
import connectDB from "../../../../../Component/Admin/Mongodb/Connect";
import jwt from 'jsonwebtoken';

// Token verification function
const verifyToken = (req) => {
  const token = req.headers.get('Authorization')?.split(' ')[1]; // Assuming Bearer token

  if (!token) {
    throw new Error('Authentication token missing');
  }
a
  try {
    // Verify the token using your secret key
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET);
    return decoded; // Return the decoded token if verification is successful
  } catch (err) {
    throw new Error('Invalid or expired token');
  }
};

export async function POST(req) {
  await connectDB();
  try {
    // Verify the JWT token
    const user = verifyToken(req); // Token is verified here

    const { razorpay_order_id, razorpay_payment_id, amount, currency, order_status, payment_method } = await req.json();

    const paymentData = new PaymentVerify({
      razorpay_order_id, razorpay_payment_id, amount, currency, order_status, payment_method
    });
    await paymentData.save();

    return new Response(JSON.stringify({ message: "Payment data stored successfully" }), { status: 200 });
  } catch (err) {
    return new Response(
      JSON.stringify({ message: err.message || "Failed to store payment data" }),
      { status: 500 }
    );
  }
}

export async function GET(req) {
  await connectDB();
  try {
    // Verify the JWT token
    const user = verifyToken(req); // Token is verified here

    const data = await PaymentVerify.find();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    return new Response(
      JSON.stringify({ message: err.message || "Failed to retrieve payment data" }),
      { status: 500 }
    );
  }
}
