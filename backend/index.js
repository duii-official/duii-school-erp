import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import Student from "./models/student.js";
import paymentRoutes from './routes/paymentRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js'
dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/students", studentRoutes); // ✅ No duplicate route
app.use('/api/payment', paymentRoutes);
app.use('/api/dashboard', dashboardRoutes);

// ✅ Server Health Check
app.get("/", (req, res) => {
  res.json({
    status: "✅ Backend Connected!",
    database: "✅ Database Connected!",
    jwt: "✅ JWT Configured!",
    uptime: `${process.uptime().toFixed(2)}s`,
    mode: process.env.NODE_ENV || "development",
  });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
