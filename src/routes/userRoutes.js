import express from "express";
import { verifyToken, verifySelfOrAdmin } from "../middleware/verifyToken.js";
import { verifyAdmin } from "../middleware/verifyRole.js";
import {
  getUserRole,
  getUserByEmail,
  updateUser,
  getAllUsers,
  updateUserStatus,
  deleteUser,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", verifyToken, verifyAdmin, getAllUsers);
router.patch("/status/:id", verifyToken, verifyAdmin, updateUserStatus);
router.delete("/:id", verifyToken, verifyAdmin, deleteUser);

router.get("/role/:email", verifyToken, verifySelfOrAdmin, getUserRole);
router.get("/:email", verifyToken, verifySelfOrAdmin, getUserByEmail);
router.patch("/:email", verifyToken, verifySelfOrAdmin, updateUser);

export default router;
