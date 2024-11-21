import contactUs from "../../../../../Component/Admin/Mongodb/MongodbSchema/contactusSchema";
import connectDB from "../../../../../Component/Admin/Mongodb/Connect";
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

export async function POST(req) {
  await connectDB();
  try {
    const user = verifyToken(req);

    const { name, email, message } = await req.json();

    const details = new contactUs({
      name,
      email,
      message,
    });

    await details.save();

    return new Response(JSON.stringify({ message: "success" }), {
      status: 200,
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ message: err.message || "An error occurred" }),
      { status: 500 }
    );
  }
}

export async function GET(req) {
  await connectDB();
  try {
    const user = verifyToken(req);

    const data = await contactUs.find();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    return new Response(
      JSON.stringify({ message: err.message || "An error occurred" }),
      { status: 500 }
    );
  }
}
