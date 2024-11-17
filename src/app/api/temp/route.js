import connectDB from '../../../../Component/Admin/Mongodb/Connect';
import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  sizes: [
    {
      size: { type: String, required: true },
      enabled: { type: Boolean, default: true },
    },
  ],
});

const Product = mongoose.models.Temp || mongoose.model('Temp', ProductSchema);

export async function POST(req) {
  try {
    await connectDB(); // Ensure your database connection is established

    const { sizes } = await req.json(); // Correctly extract `sizes` from the request body
    console.log(sizes);

    // Use `sizes` when creating a new Product
    const newProduct = new Product({ sizes });
    await newProduct.save();

    return new Response(JSON.stringify({ message: 'Success' }), { status: 200 });
  } catch (err) {
    console.error(err); // Log the error for debugging
    return new Response(JSON.stringify({ message: err.message }), { status: 500 });
  }
}



export async function GET(){


    const data= await Product.find()
    return new Response(JSON.stringify(data))
}