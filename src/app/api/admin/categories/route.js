import connectDB from "../../../../../Component/Admin/Mongodb/Connect";
import categoriesSchema from "../../../../../Component/Admin/Mongodb/MongodbSchema/categoriesSchema";
import jwt from "jsonwebtoken";

const verifyToken = (req) => {
  const token = req.headers.get("Authorization")?.split(" ")[1]; // Extract Bearer token
  if (!token) {
    throw new Error("Authentication token missing");
  }
  try {
    return jwt.verify(token, process.env.NEXTAUTH_SECRET); // Verify JWT
  } catch {
    throw new Error("Invalid or expired token");
  }
};

export async function GET(req) {
  await connectDB();
  try {

    const categories = await categoriesSchema.find();
    console.log(categories)
    
    return new Response(JSON.stringify(categories));
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }));
  }
}

export async function POST(req) {
  await connectDB();
  try {
    const user = verifyToken(req); // Verify token
    const body = await req.json();
    const newCategory = new categoriesSchema(body);
    newCategory.save();
    return new Response(JSON.stringify({message:"success"}));
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }));
  }
}
