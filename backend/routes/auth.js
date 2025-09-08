import express from "express";
import {
  signup,
  login,
  getMe,
  updateProfile,
  changePassword,
  deleteAccount,
} from "../controllers/authController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.get("/me", authenticateToken, getMe);
router.put("/update-profile", authenticateToken, updateProfile);
router.put("/change-password", authenticateToken, changePassword);
router.delete("/delete", authenticateToken, deleteAccount);

export default router;
