import express from "express";
import { getUsers, getUserProfile } from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/profile", protect, getUserProfile);

export default router;
