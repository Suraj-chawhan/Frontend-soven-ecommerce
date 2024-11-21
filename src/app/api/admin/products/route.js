import connectDB from "../../../../../Component/Admin/Mongodb/Connect";
import productSchema from "../../../../../Component/Admin/Mongodb/MongodbSchema/productSchema";
export async function POST(req) {
    await connectDB();
    try {
      const {sizes,colors,title,slug,price,quantity,thumbnail,sideImages,categories,description,returnExchange,moreInformation}=await req.json()
      console.log(sizes)
      const newProduct = new productSchema({
       sizes,colors,title,slug,price,quantity,thumbnail,sideImages,categories,description,returnExchange,moreInformation
      });
  
      await newProduct.save();
  
      return new Response(JSON.stringify({ message: 'Product created successfully!' }), { status: 201 });
    } catch (err) {
      console.error('Error:', err.message);
      return new Response(JSON.stringify({ error: err.message }), { status: 400 });
    }
  }
  

  export async function GET() {
    await connectDB();
    try {
      const products = await productSchema.find(); // Fetch all products
      return new Response(JSON.stringify(products));
    } catch (err) {
      console.error('Error:', err.message);
      return new Response(JSON.stringify({ error: err.message }), { status: 400 });
    }
  }