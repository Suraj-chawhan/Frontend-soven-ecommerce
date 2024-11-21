import connectDB from "../../../../../../Component/Admin/Mongodb/Connect";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import Bag from "../../../../../../Component/Admin/Mongodb/MongodbSchema/bagSchema";

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

export async function DELETE(req, { params }) {
  await connectDB();
  const { id } = params;
  try {
    const user = verifyToken(req);
    if (!ObjectId.isValid(id)) {
      return new Response(JSON.stringify({ error: "Invalid Bag ID" }), {
        status: 400,
      });
    }
    const deletedBag = await Bag.findByIdAndDelete(id);
    if (!deletedBag) {
      return new Response(JSON.stringify({ error: "Bag not found" }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({ message: "Bag deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting Bag:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to delete Bag" }),
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  await connectDB();
  const { id } = params;

  try {
    const user = verifyToken(req);

    if (!ObjectId.isValid(id)) {
      return new Response(JSON.stringify({ error: "Invalid Bag ID" }), {
        status: 400,
      });
    }
    const body = await req.json();
    const updatedBag = await Bag.findByIdAndUpdate(id, body, { new: true });
    if (!updatedBag) {
      return new Response(JSON.stringify({ error: "Bag not found" }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({ message: "Bag updated successfully", Bag: updatedBag }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating Bag:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to update Bag" }),
      { status: 500 }
    );
  }
}

export async function GET(req, { params }) {
  await connectDB();
  const { id } = params;

  try {
    const user = verifyToken(req);
    if (!ObjectId.isValid(id)) {
      return new Response(JSON.stringify({ error: "Invalid Bag ID" }), {
        status: 400,
      });
    }

    const bag = await Bag.findById(id);
    if (!bag) {
      return new Response(JSON.stringify({ error: "Bag not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(bag), { status: 200 });
  } catch (error) {
    console.error("Error fetching Bag:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to fetch Bag" }),
      { status: 500 }
    );
  }
}
