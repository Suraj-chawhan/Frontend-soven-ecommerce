import connectDB from "../../../../../../Component/Admin/Mongodb/Connect";
import { ObjectId } from "mongodb";
import jwt from 'jsonwebtoken';
import Wishlist from "../../../../../../Component/Admin/Mongodb/MongodbSchema/wishlistSchema";

// Token verification function
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

// DELETE handler
export async function DELETE(req, { params }) {
  await connectDB();
  const { id } = params; // Retrieve Wishlist ID from the request parameters

  try {
    // Verify JWT token
    const user = verifyToken(req); // Token is verified here

    
    if (!ObjectId.isValid(id)) {
      return new Response(JSON.stringify({ error: "Invalid Wishlist ID" }), { status: 400 });
    }

    // Perform the delete operation
    const deletedWishlist = await Wishlist.findByIdAndDelete(id);
    if (!deletedWishlist) {
      return new Response(JSON.stringify({ error: "Wishlist not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Wishlist deleted successfully" }), { status: 200 });
  } catch (error) {
    console.error("Error deleting Wishlist:", error);
    return new Response(JSON.stringify({ error: error.message || "Failed to delete Wishlist" }), { status: 500 });
  }
}

// PUT handler
export async function PUT(req, { params }) {
  await connectDB();
  const { id } = params;

  try {
    // Verify JWT token
    const user = verifyToken(req); // Token is verified here

    // Validate the Wishlist ID
    if (!ObjectId.isValid(id)) {
      return new Response(JSON.stringify({ error: "Invalid Wishlist ID" }), { status: 400 });
    }

    // Get the request body
    const body = await req.json();
    const updatedWishlist = await Wishlist.findByIdAndUpdate(id, body, { new: true });
    if (!updatedWishlist) {
      return new Response(JSON.stringify({ error: "Wishlist not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Wishlist updated successfully", Wishlist: updatedWishlist }), { status: 200 });
  } catch (error) {
    console.error("Error updating Wishlist:", error);
    return new Response(JSON.stringify({ error: error.message || "Failed to update Wishlist" }), { status: 500 });
  }
}

// GET handler
export async function GET(req, { params }) {
  await connectDB();
  const { id } = params;

  try {
    // Verify JWT token
    const user = verifyToken(req); // Token is verified here

    // Validate the Wishlist ID
    if (!ObjectId.isValid(id)) {
      return new Response(JSON.stringify({ error: "Invalid Wishlist ID" }), { status: 400 });
    }

    // Fetch the Wishlist
    const Wishlistdata = await Wishlist.findById(id);
    if (!Wishlistdata) {
      return new Response(JSON.stringify({ error: "Wishlist not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(Wishlistdata), { status: 200 });
  } catch (error) {
    console.error("Error fetching Wishlist:", error);
    return new Response(JSON.stringify({ error: error.message || "Failed to fetch Wishlist" }), { status: 500 });
  }
}
