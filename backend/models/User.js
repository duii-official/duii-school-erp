import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
      type: String, 
      required: true, 
      enum: ["admin", "teacher"], // Sirf admin aur teacher allowed hain
      default: "teacher" // By default, teacher hoga
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
