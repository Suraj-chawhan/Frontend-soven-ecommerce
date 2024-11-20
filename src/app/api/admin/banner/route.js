
import connectDB from "../../../../../Component/Admin/Mongodb/Connect";
import Banner from "../../../../../Component/Admin/Mongodb/MongodbSchema/bannerSchema";


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


export async function POST(req) {
  await connectDB();
  try {
    const user=verifyToken(req)
    const img = await req.json();
    console.log(img)

    const category = new Banner(img);
    await category.save();

    return new Response(JSON.stringify({ message: "success" }));
  } catch (err) {
    return new Response(
      JSON.stringify({ message: err.message || "An error occurred" })
    );
  }
}



export async function GET() {
  await connectDB();
  try {
    const data = await Banner.find();
    return new Response(JSON.stringify(data));
  } catch (err) {
    return new Response(
      JSON.stringify({ message: err.message || "An error occurred" })
    );
  }
}
