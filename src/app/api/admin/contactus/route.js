import connectDB from "../../../../../Component/Admin/Mongodb/Connect";
import contactUs from "../../../../../Component/Admin/Mongodb/MongodbSchema/contactusSchema";
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

export async function GET(req) {
  await connectDB();
  try {
    const user = verifyToken(req);
    const categories = await contactUs.find();
    console.log(categories);

    return new Response(JSON.stringify(categories));
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }));
  }
}

export async function POST(req) {
  await connectDB();
  try {
    const body = await req.json();
    console.log(body);
    const newCategory = new contactUs(body);
    newCategory.save();

    return new Response(JSON.stringify({ message: "success" }));
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }));
  }
}
