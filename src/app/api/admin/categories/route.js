import categoriesSchema from "../../../../../Component/Admin/Mongodb/MongodbSchema/categoriesSchema";
import connectDB from "../../../../../Component/Admin/Mongodb/Connect";

export async function POST(req) {
  await connectDB();
  try {
    const { name, slug, img } = await req.json();
    console.log("Category Name:", name);

    const category = new categoriesSchema({
      name,
      slug,
      img,
    });
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
    const data = await categoriesSchema.find();
    return new Response(JSON.stringify(data));
  } catch (err) {
    return new Response(
      JSON.stringify({ message: err.message || "An error occurred" })
    );
  }
}
