import connectDB from "../../../../../../Component/Admin/Mongodb/Connect";
import productSchema from "../../../../../../Component/Admin/Mongodb/MongodbSchema/productSchema";
import { ObjectId } from "mongodb";

export async function DELETE(req, { params }) {
  await connectDB();
  const { id } = params; // Retrieve productSchema ID from the request parameters

  if (!ObjectId.isValid(id)) {
    return new Response(JSON.stringify({ error: "Invalid productSchema ID" }), { status: 400 });
  }

  try {
    const deletedproductSchema = await productSchema.findByIdAndDelete(id);
    if (!deletedproductSchema) {
      return new Response(JSON.stringify({ error: "productSchema not found" }), { status: 404 });
    }
    return new Response(JSON.stringify({ message: "productSchema deleted successfully" }), { status: 200 });
  } catch (error) {
    console.error("Error deleting productSchema:", error);
    return new Response(JSON.stringify({ error: "Failed to delete productSchema" }), { status: 500 });
  }
}

export async function PUT(req, { params }) {
  await connectDB();
  const { id } = params;

  if (!ObjectId.isValid(id)) {
    return new Response(JSON.stringify({ error: "Invalid productSchema ID" }), { status: 400 });
  }

  try {
    const body = await req.json();
    const updatedproductSchema = await productSchema.findByIdAndUpdate(id, body, { new: true });
    if (!updatedproductSchema) {
      return new Response(JSON.stringify({ error: "productSchema not found" }), { status: 404 });
    }
    return new Response(JSON.stringify({ message: "productSchema updated successfully", productSchema: updatedproductSchema }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error updating productSchema:", error);
    return new Response(JSON.stringify({ error: "Failed to update productSchema" }), { status: 500 });
  }
}

export async function GET(req, { params }) {
  await connectDB();
  const { id } = params;

  if (!ObjectId.isValid(id)) {
    return new Response(JSON.stringify({ error: "Invalid productSchema ID" }), { status: 400 });
  }

  try {
    const productSchema = await productSchema.findById(id);
    if (!productSchema) {
      return new Response(JSON.stringify({ error: "productSchema not found" }), { status: 404 });
    }
    return new Response(JSON.stringify(productSchema), { status: 200 });
  } catch (error) {
    console.error("Error fetching productSchema:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch productSchema" }), { status: 500 });
  }
}
