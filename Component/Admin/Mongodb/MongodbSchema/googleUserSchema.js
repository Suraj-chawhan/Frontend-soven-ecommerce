import mongoose from "mongoose";

const rolesEnum = ["user", "admin"]; // Define roles

const googleUserSchema = new mongoose.Schema({
  name: {
    type: String,
  
    trim: true,
  },
  email: {
    type: String,
    
    unique: true, // Ensure no duplicate emails
    trim: true,
    lowercase: true,
  },
  role: {
    type: String,
    enum: rolesEnum, 
    default: "user", 
  },
}, { timestamps: true });

const GoogleUser = mongoose.models.GoogleUser || mongoose.model("GoogleUser", googleUserSchema);

export default GoogleUser;
