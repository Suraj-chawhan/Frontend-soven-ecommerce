import connectDB from "../../../../../../Component/Admin/Mongodb/Connect";
import User from "../../../../../../Component/Admin/Mongodb/MongodbSchema/userSchema";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken"

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


// DELETE a user by ID
export async function DELETE(req, { params }) {
  await connectDB();
  const { id } = params;
   const user=verifyToken(req)
  if (!ObjectId.isValid(id)) {
    return new Response(JSON.stringify({ error: "Invalid user ID" }), { status: 400 });
  }

  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }
    return new Response(JSON.stringify({ message: "User deleted successfully" }), { status: 200 });
  } catch (error) {
    console.error("Error deleting user:", error);
    return new Response(JSON.stringify({ error: "Failed to delete user" }), { status: 500 });
  }
}

// PUT (update) a user by ID
export async function PUT(req, { params }) {
  await connectDB();
  const { id } = params;
  const user=verifyToken(req)
  if (!ObjectId.isValid(id)) {
    return new Response(JSON.stringify({ error: "Invalid user ID" }), { status: 400 });
  }

  try {
    const body = await req.json();
    const updatedUser = await User.findByIdAndUpdate(id, body, { new: true });
    if (!updatedUser) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }
    return new Response(
      JSON.stringify({ message: "User updated successfully", user: updatedUser }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return new Response(JSON.stringify({ error: "Failed to update user" }), { status: 500 });
  }
}
