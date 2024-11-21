import connectDB from "../../../../../../Component/Admin/Mongodb/Connect";
import GoogleUser from "../../../../../../Component/Admin/Mongodb/MongodbSchema/googleUserSchema";
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

export async function PUT(req, { params }) {
  await connectDB();

  try {
    const { id } = params;
    const user = verifyToken(req);
    const data = await req.json();

    if (!data || Object.keys(data).length === 0) {
      return new Response(
        JSON.stringify({ message: "No data provided for update" }),
        { status: 400 }
      );
    }

    const updatedUser = await GoogleUser.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(updatedUser), { status: 200 });
  } catch (err) {
    return new Response(
      JSON.stringify({ message: err.message || "An error occurred" }),
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  await connectDB();

  try {
    const { id } = params;
    const user = verifyToken(req);

    const deletedUser = await GoogleUser.findByIdAndDelete(id);

    if (!deletedUser) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(deletedUser), { status: 200 });
  } catch (err) {
    return new Response(
      JSON.stringify({ message: err.message || "An error occurred" }),
      { status: 500 }
    );
  }
}
