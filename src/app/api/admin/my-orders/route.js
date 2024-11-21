import myOrder from "../../../../../Component/Admin/Mongodb/MongodbSchema/myOrderSchema";
import connectDB from "../../../../../Component/Admin/Mongodb/Connect";
import jwt from "jsonwebtoken";

const verifyToken = (req) => {
  const token = req.headers.get("Authorization")?.split(" ")[1];

  if (!token) {
    throw new Error("Authentication token missing");
  }

  try {
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET);
    return decoded;
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
};

export async function POST(req) {
  await connectDB();
  try {
    const user = verifyToken(req);

    const data = await req.json();

    if (Array.isArray(data)) {
      await myOrder.insertMany(data);
    } else {
      const order = new myOrder(data);
      await order.save();
    }

    return new Response(JSON.stringify({ message: "success" }), {
      status: 200,
    });
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
    const user = verifyToken(req);
    console.log("GET call my order");
    const data = await myOrder.find();
    return new Response(JSON.stringify(data));
  } catch (err) {
    return new Response(
      JSON.stringify({ message: err.message || "An error occurred" }),
      { status: 500 }
    );
  }
}
