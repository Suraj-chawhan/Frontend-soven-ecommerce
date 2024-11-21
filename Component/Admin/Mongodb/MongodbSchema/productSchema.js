import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    sizes: [
      {
        size: { type: String },
        enabled: { type: Boolean, default: true },
      },
    ],
    colors: [
      {
        color: { type: String },
        enabled: { type: Boolean, default: true },
      },
    ],
    thumbnail: { type: String },
    sideImages: [String],
    categories: { type: String },
    moreInformation: { type: String },
    returnExchange: { type: String },
    description: { type: String },
  },
  { timestamps: true }
);

const productSchema =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);
export default productSchema;
