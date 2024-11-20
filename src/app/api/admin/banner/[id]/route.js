import Banner from "../../../../../../Component/Admin/Mongodb/MongodbSchema/bannerSchema";
import connectDB from "../../../../../../Component/Admin/Mongodb/Connect";
import jwt from 'jsonwebtoken';
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
  
export async function DELETE(req, { params }) {
  await connectDB();

  try {
    const user = verifyToken(req); // Pass req to verifyToken
    const { id } = params; // Retrieve the ID from the params

    // Perform the delete operation
    const userFindAndDelete = await Banner.findOneAndDelete(id); // Use _id to find the document

    if (!userFindAndDelete) {
      return new Response(JSON.stringify({ message: 'Banner not found' }), { status: 404 });
    }

    console.log("Deleted Successfully Banner");
    return new Response(JSON.stringify(userFindAndDelete), { status: 200 }); // Return the deleted banner details
  } catch (err) {
    console.error('Error deleting banner:', err);
    return new Response(JSON.stringify({ message: err.message }), { status: 500 });
  }
}
