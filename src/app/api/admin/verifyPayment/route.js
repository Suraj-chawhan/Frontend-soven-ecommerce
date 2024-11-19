import PaymentVerify from "../../../../../Component/Admin/Mongodb/MongodbSchema/verifyPaymentSchema";
import connectDB from "../../../../../Component/Admin/Mongodb/Connect";
import jwt from 'jsonwebtoken';

// Helper function to verify JWT token
const verifyToken = (req) => {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    throw new Error('Authorization header is missing');
  }

  const token = authHeader.split(' ')[1]; // Assuming Bearer token format
  if (!token) {
    throw new Error('Authentication token is missing');
  }

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
    const user = verifyToken(req);

    // Parse request body
 const data= await req.json();

    console.log('Payment Data:', data);

    // Save payment details to the database
    const paymentData = new PaymentVerify(data);
    await paymentData.save();

    return new Response(
      JSON.stringify({ message: "Payment data stored successfully" }),
      { status: 200 }
    );
  } catch (err) {
    console.error('Error in POST:', err.message);
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
    const user = verifyToken(req);

    // Retrieve payment data for the authenticated user
    const data = await PaymentVerify.find({ userId: user.id });
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    console.error('Error in GET:', err.message);
    return new Response(
      JSON.stringify({ message: err.message || "Failed to retrieve payment data" }),
      { status: 500 }
    );
  }
}
