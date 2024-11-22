import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    size: { type: String },
    color: { type: String },
    userId: { type: String, required: true },
    img: { type: String },
    price: { type: Number, required: true },
    quantity: { type: Number, default: 1 },
    payment_method: { type: String, required: true },
    estimated_date: { type: Date },
    address: { type: String },
    razorpay_order_id: { type: String },
    razorpay_payment_id: { type: String },
    date: { type: String },
    status: { type: String },
    pincode: { type: String },
    phone_number: { type: String },
    name: { type: String },
  },
  { timestamps: true }
);

const myOrder = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default myOrder;
