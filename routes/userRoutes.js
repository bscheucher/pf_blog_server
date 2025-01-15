import express from "express";
import { validateUserInput } from "../middleware/validateUserMiddleware.js";
import {
  register,
  login,
  logout,
  getUserById,
  updateUser,
} from "../controllers/userController.js";

import { authenticateToken } from "../middleware/authenticateToken.js";

const router = express.Router();

// Register route
router.post("/register", validateUserInput, register);

// Login route
router.post("/login", login);

// Logout route
router.post("/logout", logout);

// Get existing user
router.get("/:id",authenticateToken, getUserById);

router.put("/:id/update", validateUserInput, updateUser);

export default router;
