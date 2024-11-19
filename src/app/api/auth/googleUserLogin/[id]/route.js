import connectDB from "../../../../../../Component/Admin/Mongodb/Connect";
import GoogleUser from "../../../../../../Component/Admin/Mongodb/MongodbSchema/googleUserSchema";
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


export async function PUT(req, { params }) {
    await connectDB();
  
    try {
      const { id } = params; // Get the Google user ID from the URL parameters
      const user = verifyToken(req); // Verify user token
  
      // Parse the incoming request body to get the updated data
      const data = await req.json();
  
      // Check if data contains the necessary fields (you can extend this check based on your schema)
      if (!data || Object.keys(data).length === 0) {
        return new Response(
          JSON.stringify({ message: "No data provided for update" }),
          { status: 400 }
        );
      }
  
      // Find and update the Google user in the database
      const updatedUser = await GoogleUser.findByIdAndUpdate(id, data, {
        new: true, // Return the updated document
        runValidators: true, // Ensure schema validation
      });
  
      if (!updatedUser) {
        return new Response(
          JSON.stringify({ message: "User not found" }),
          { status: 404 }
        );
      }
  
      return new Response(JSON.stringify(updatedUser), { status: 200 });
    } catch (err) {
      return new Response(
        JSON.stringify({ message: err.message || "An error occurred" }),
        { status: 500 }
      );
    }
  }
  
  export async function DELETE(req,{ params }) {
    await connectDB();
  
    try {
      const { id } = params; // Get the Google user ID from the URL parameters
      const user = verifyToken(req); // Verify user token
  
      // Delete the user by their ID
      const deletedUser = await GoogleUser.findByIdAndDelete(id);
  
      if (!deletedUser) {
        return new Response(
          JSON.stringify({ message: "User not found" }),
          { status: 404 }
        );
      }
  
      return new Response(
        JSON.stringify(deletedUser),
        { status: 200 }
      );
    } catch (err) {
      return new Response(
        JSON.stringify({ message: err.message || "An error occurred" }),
        { status: 500 }
      );
    }
  }