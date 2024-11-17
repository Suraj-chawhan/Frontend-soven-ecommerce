import contactUs from "../../../../../Component/Admin/Mongodb/MongodbSchema/contactusSchema";
import connectDB from "../../../../../Component/Admin/Mongodb/Connect";
import jwt from 'jsonwebtoken';


const verifyToken = (req) => {
  const token = req.headers.get('Authorization')?.split(' ')[1]; // Assuming Bearer token

  if (!token) {
    throw new Error('Authentication token missing');
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
    // Verify JWT token
    const user = verifyToken(req); // Token is verified here

    const { name, email, message } = await req.json();

    const details = new contactUs({
      name,
      email,
      message
    });

    await details.save();

    return new Response(JSON.stringify({ message: "success" }), { status: 200 });
  } catch (err) {
    return new Response(
      JSON.stringify({ message: err.message || "An error occurred" }),
      { status: 500 }
    );
  }
}

export async function GET(req) {
  await connectDB();
  try {
    // Verify JWT token
    const user = verifyToken(req); // Token is verified here

    const data = await contactUs.find();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    return new Response(
      JSON.stringify({ message: err.message || "An error occurred" }),
      { status: 500 }
    );
  }
}
