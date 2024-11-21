import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    razorpay_order_id: { type: String, required: true },
    razorpay_payment_id: { type: String, required: true },
    amount: { type: Number },
    currency: { type: String, default: "INR" },
    order_status: { type: String },
    payment_method: { type: String, required: true },
    userId: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const PaymentVerify =
  mongoose.models.Payment || mongoose.model("Payment", paymentSchema);

export default PaymentVerify;
