import jwt from "jsonwebtoken";
import Bag from "../../../../../Component/Admin/Mongodb/MongodbSchema/bagSchema";
import connectDB from "../../../../../Component/Admin/Mongodb/Connect";

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
      await Bag.insertMany(data);
    } else {
      const bagProduct = new Bag(data);
      await bagProduct.save();
    }

    return new Response(
      JSON.stringify({ message: "Data added successfully" }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ message: err.message || "An error occurred" }),
      { status: 401 }
    );
  }
}

export async function GET(req) {
  try {
    const user = verifyToken(req);

    const data = await Bag.find();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    return new Response(
      JSON.stringify({ message: err.message || "An error occurred" }),
      { status: 401 }
    );
  }
}
