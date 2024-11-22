import mongoose from "mongoose";

const socialSchema = new mongoose.Schema({
  youtube: { type: String },
  facebook: { type: String },
  linkedin: { type: String },
  pinterest: { type: String },
  instagram: { type: String },
  twitter: { type: String },
});

const Social =
  mongoose.models.SocialMedia || mongoose.model("SocialMedia", socialSchema);

export default Social;
