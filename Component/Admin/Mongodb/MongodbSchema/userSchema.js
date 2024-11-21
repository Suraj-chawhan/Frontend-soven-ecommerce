import mongoose from "mongoose";
import bcrypt from "bcrypt";

const rolesEnum = ["user", "admin"];

const user = new mongoose.Schema({
  name: { type: String },
  lastName: { type: String },
  email: { type: String },
  password: { type: String },
  role: { type: String, enum: rolesEnum, default: "user" },
});

user.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10); // Hash password before saving
  next();
});

const User = mongoose.models.User || mongoose.model("User", user);
export default User;
