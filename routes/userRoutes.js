import express from "express";
import { check, validationResult } from "express-validator";
import {
  register,
  login,
  logout,
  getUserById,
} from "../controllers/userController.js";

import { ensureAuthenticated } from "../middleware/ensureAuthenticated.js";

const router = express.Router();

// Register route
router.post(
  "/register",
  [
    check("username")
      .isLength({ min: 3 })
      .withMessage("Username must be at least 3 characters."),
    check("email").isEmail().withMessage("Invalid email format."),
    check("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters."),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  register
);

// Login route
router.post("/login", login);

// Logout route
router.post("/logout", logout);

// Get existing user
router.get("/:id", ensureAuthenticated, getUserById);

export default router;
