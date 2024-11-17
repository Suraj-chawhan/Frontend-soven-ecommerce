import connectDB from "../../../../../../Component/Admin/Mongodb/Connect";
import { ObjectId } from "mongodb";
import jwt from 'jsonwebtoken';
import categoriesSchema from "../../../../../../Component/Admin/Mongodb/MongodbSchema/categoriesSchema";

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
  const { id } = params; // Retrieve categoriesSchema ID from the request parameters

  try {
    // Verify JWT token
    const user = verifyToken(req); // Token is verified here

    // Validate the categoriesSchema ID
    if (!ObjectId.isValid(id)) {
      return new Response(JSON.stringify({ error: "Invalid categoriesSchema ID" }), { status: 400 });
    }

    // Perform the delete operation
    const deletedcategoriesSchema = await categoriesSchema.findByIdAndDelete(id);
    if (!deletedcategoriesSchema) {
      return new Response(JSON.stringify({ error: "categoriesSchema not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "categoriesSchema deleted successfully" }), { status: 200 });
  } catch (error) {
    console.error("Error deleting categoriesSchema:", error);
    return new Response(JSON.stringify({ error: error.message || "Failed to delete categoriesSchema" }), { status: 500 });
  }
}

// PUT handler
export async function PUT(req, { params }) {
  await connectDB();
  const { id } = params;

  try {
    // Verify JWT token
    const user = verifyToken(req); // Token is verified here

    // Validate the categoriesSchema ID
    if (!ObjectId.isValid(id)) {
      return new Response(JSON.stringify({ error: "Invalid categoriesSchema ID" }), { status: 400 });
    }

    // Get the request body
    const body = await req.json();
    const updatedcategoriesSchema = await categoriesSchema.findByIdAndUpdate(id, body, { new: true });
    if (!updatedcategoriesSchema) {
      return new Response(JSON.stringify({ error: "categoriesSchema not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "categoriesSchema updated successfully", categoriesSchema: updatedcategoriesSchema }), { status: 200 });
  } catch (error) {
    console.error("Error updating categoriesSchema:", error);
    return new Response(JSON.stringify({ error: error.message || "Failed to update categoriesSchema" }), { status: 500 });
  }
}

// GET handler
export async function GET(req, { params }) {
  await connectDB();
  const { id } = params;

  try {
    // Verify JWT token
    const user = verifyToken(req); // Token is verified here

    // Validate the categoriesSchema ID
    if (!ObjectId.isValid(id)) {
      return new Response(JSON.stringify({ error: "Invalid categoriesSchema ID" }), { status: 400 });
    }

    // Fetch the categoriesSchema
    const categoriesSchema = await categoriesSchema.findById(id);
    if (!categoriesSchema) {
      return new Response(JSON.stringify({ error: "categoriesSchema not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(categoriesSchema), { status: 200 });
  } catch (error) {
    console.error("Error fetching categoriesSchema:", error);
    return new Response(JSON.stringify({ error: error.message || "Failed to fetch categoriesSchema" }), { status: 500 });
  }
}
