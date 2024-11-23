import mongoose from "mongoose";

const contact = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
});

const contactUs =
  mongoose.models.Contactus || mongoose.model("Contactus", contact);
export default contactUs;
