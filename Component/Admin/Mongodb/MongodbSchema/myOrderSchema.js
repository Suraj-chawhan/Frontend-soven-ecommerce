import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Product title
  size: { type: String }, // Size of the product
  color: { type: String }, // Color of the product
  userId: { type: String, required: true }, // User ID of the customer
  img: { type: String }, // Image URL of the product
  price: { type: Number, required: true }, // Price of the product
  quantity: { type: Number, default: 1 }, // Quantity of the product
  payment_method: { type: String, required: true }, // Payment method used
  estimated_date: { type: Date }, // Estimated delivery date
  address: {type:String}
}, { timestamps: true }); 

const myOrder =  mongoose.models.Order || mongoose.model("Order", orderSchema);

export default myOrder;
