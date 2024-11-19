

import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  razorpay_order_id: { type: String, required: true }, // Razorpay order ID
  razorpay_payment_id: { type: String, required: true }, // Razorpay payment ID
  amount: { type: Number}, // Payment amount
  currency: { type: String, default: "INR" }, // Payment currency (default is INR)
  order_status: { type: String}, // Order status
  payment_method: { type: String, required: true }, // Payment method (e.g., "UPI", "Card", "NetBanking")
  userId:{type:String},
  createdAt: { type: Date, default: Date.now }, // Timestamp for payment creation
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

const PaymentVerify =  mongoose.models.Payment ||mongoose.model("Payment", paymentSchema);

export default PaymentVerify;

