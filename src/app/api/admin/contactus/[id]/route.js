import jwt from "jsonwebtoken";
import connectDB from "../../../../../../Component/Admin/Mongodb/Connect";
import contactUs from "../../../../../../Component/Admin/Mongodb/MongodbSchema/contactusSchema";
import { ObjectId } from "mongodb";
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
      return new Response(JSON.stringify({ error: "InvalidcontactUs ID" }), {
        status: 400,
      });
    }

    const deletedconcontactUs = await contactUs.findByIdAndDelete(id);
    if (!deletedconcontactUs) {
      return new Response(JSON.stringify({ error: "concontactUs not found" }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({ message: "concontactUs deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deletingcontactUs:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Failed to deletecontactUs",
      }),
      { status: 500 }
    );
  }
}
