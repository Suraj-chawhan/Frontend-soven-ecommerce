import connectDB from "../../../../../Component/Admin/Mongodb/Connect";
import Social from "../../../../../Component/Admin/Mongodb/MongodbSchema/socialSchema";
import jwt from "jsonwebtoken";

// Function to verify the JWT token
const verifyToken = (req) => {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    throw new Error("Authorization header is missing");
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    throw new Error("Authentication token is missing");
  }

  try {
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET);
    return decoded;
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
};

// Handle POST: Create a new social media document
export async function POST(req) {
  await connectDB(); // Connect to MongoDB
  try {
    const user = verifyToken(req); // Verify user authentication
    const body = await req.json(); // Parse request body
    console.log(body);
    await Social.deleteMany();

    // Save the new document
    const social = new Social(body);
    await social.save();

    return new Response(
      JSON.stringify({ message: "Social media links created successfully" }),
      { status: 201 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ message: err.message || "An error occurred" }),
      { status: 400 }
    );
  }
}

// Handle GET: Retrieve the social media document
export async function GET() {
  await connectDB();
  try {
    const data = await Social.findOne(); // Fetch a single document
    if (!data) {
      return new Response(
        JSON.stringify({ message: "No social media links found" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    return new Response(
      JSON.stringify({ message: err.message || "An error occurred" }),
      { status: 400 }
    );
  }
}

// Handle PUT: Update the social media document
export async function PUT(req) {
  await connectDB();
  try {
    const user = verifyToken(req); // Verify user authentication
    const body = await req.json(); // Parse request body

    const updatedData = await Social.findOneAndUpdate({}, body, {
      new: true, // Return the updated document
      upsert: true, // Create a new document if none exists
    });

    return new Response(
      JSON.stringify({
        message: "Social media links updated successfully",
        data: updatedData,
      }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ message: err.message || "An error occurred" }),
      { status: 400 }
    );
  }
}

// Handle DELETE: Delete the social media document
export async function DELETE(req) {
  await connectDB();
  try {
    const user = verifyToken(req); // Verify user authentication
    console.log("Delete Call");
    // Delete the existing document
    const result = await Social.deleteOne();

    if (result.deletedCount === 0) {
      return new Response(
        JSON.stringify({ message: "No social media links found to delete" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ message: "Social media links deleted successfully" }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ message: err.message || "An error occurred" }),
      { status: 400 }
    );
  }
}
