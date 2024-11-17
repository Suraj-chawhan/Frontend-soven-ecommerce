
import connectDB from "../../../../../Component/Admin/Mongodb/Connect";
import Banner from "../../../../../Component/Admin/Mongodb/MongodbSchema/bannerSchema";



export async function POST(req) {
  await connectDB();
  try {
    const img = await req.json();
    

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
