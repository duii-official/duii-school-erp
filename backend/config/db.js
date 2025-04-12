import mongoose from "mongoose";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // ✅ Default Admin User (Only If No Users Exist)
    const existingAdmin = await User.findOne({ email: "admin@duii.com" });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("admin123", 10);

      await User.create({
        name: "Admin User",
        email: "admin@duii.com",
        password: hashedPassword,
        role: "admin", // ✅ Ensure admin role
      });

      console.log("✅ Default Admin Created: admin@duii.com | Password: admin123");
    }

    // ✅ Default Teacher User (Only If No Teachers Exist)
    const existingTeacher = await User.findOne({ email: "teacher@duii.com" });

    if (!existingTeacher) {
      const hashedPassword = await bcrypt.hash("teacher123", 10);

      await User.create({
        name: "Default Teacher",
        email: "teacher@duii.com",
        password: hashedPassword,
        role: "teacher", // ✅ Ensure teacher role
      });

      console.log("✅ Default Teacher Created: teacher@duii.com | Password: teacher123");
    }

  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }

  // // ✅ Add Another Admin (If Not Already Exist)
  // const existingSecondAdmin = await User.findOne({ email: "secondadmin@duii.com" });

  // if (!existingSecondAdmin) {
  //   const hashedPassword = await bcrypt.hash("secondadmin123", 10);

  //   await User.create({
  //     name: "Second Admin User",
  //     email: "secondadmin@duii.com",
  //     password: hashedPassword,
  //     role: "admin", // ✅ Ensure admin role
  //   });

  //   console.log("✅ Second Admin Created: secondadmin@duii.com | Password: secondadmin123");
  // }





};

export default connectDB;
