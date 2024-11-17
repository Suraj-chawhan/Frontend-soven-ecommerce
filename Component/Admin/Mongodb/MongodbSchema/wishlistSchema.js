import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
  title: { type: String, required: true },
  img: { type: String, required: true },
  size: { type: String },
  color: { type: String },
  userId: { type: String, required: true },
  price: { type: Number, required: true },
  slug:{type:String,required:true} 
}, { timestamps: true });

const Wishlist = mongoose.models.Wishlist || mongoose.model("Wishlist", wishlistSchema);

export default Wishlist;
