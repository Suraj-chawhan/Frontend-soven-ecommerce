import GoogleUser from "../../../../../Component/Admin/Mongodb/MongodbSchema/googleUserSchema";
import connectDB from "../../../../../Component/Admin/Mongodb/Connect";
import jwt from "jsonwebtoken";



const verifyToken = (req) => {
  const token = req.headers.get("Authorization")?.split(" ")[1]; // Assuming Bearer token
  if (!token) {
    throw new Error("Authentication token missing");
  }

  try {
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET);
    return decoded; // Return the decoded token if verification is successful
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
};


export async function GET(req) {
  await connectDB();

  try {
    const user = verifyToken(req);
    const googleUsers = await GoogleUser.find();
    return new Response(JSON.stringify(googleUsers), { status: 200 });
  } catch (err) {
    return new Response(
      JSON.stringify({ message: err.message || "An error occurred" }),
      { status: 401 }
    );
  }
}
