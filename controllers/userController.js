import {
  findUserById,
  registerUser,
  editUser,
} from "../services/userService.js";
import passport from "../config/passport.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Register a new user
export const register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).send("All fields are required.");
  }

  try {
    // Check if the username or email is already taken
    const existingUser = await registerUser(username, email, password);
    res.status(201).json({
      message: "User registered successfully!",
      user: {
        id: existingUser.id,
        username: existingUser.username,
        email: existingUser.email,
      },
    });
  } catch (err) {
    console.error("Error registering user:", err);
    if (err.code === "23505") {
      res.status(409).send("Username or email already exists.");
    } else {
      res.status(500).send("An error occurred during registration.");
    }
  }
};

// Log in an existing user
export const login = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    req.logIn(user, (err) => {
      if (err) return next(err);

      // Generate a JWT
      const token = jwt.sign(
        { id: user.id, username: user.username },

        process.env.JWT_SECRET, // Secret key from environment variable
        { expiresIn: "1h" } // Token expiration time
      );
      console.log("User", user);
      res.status(201).json({
        message: "User logged in successfully!",
        token, // Send token to the client
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      });
    });
  })(req, res, next);
};

export const logout = async (req, res) => {
  try {
    // Passport-specific: Log out the user
    req.logout((err) => {
      if (err) {
        console.error("Error during logout:", err);
        return res.status(500).send("An error occurred during logout.");
      }

      // Clear the authentication cookie if it's being used to store the JWT
      res.clearCookie("connect.sid"); // Adjust cookie name if different
      return res.status(200).json({ message: "User logged out successfully." });
    });
  } catch (error) {
    console.error("Unexpected error during logout:", error);
    res.status(500).send("An unexpected error occurred.");
  }
};

// Find an existing user
export const getUserById = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).send("Invalid user ID.");
  }
  try {
    const user = await findUserById(id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).send("User not found.");
    }
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).send("An error occurred while fetching the user.");
  }
};

// Update a user's information
export const updateUser = async (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).send("Invalid user ID.");
  }

  const { username, email, password } = req.body;

  // Ensure at least one field is provided
  if (!username && !email && !password) {
    return res
      .status(400)
      .send(
        "At least one field (username, email, or password) must be provided for update."
      );
  }

  try {
    const updates = {};

    if (username) updates.username = username;
    if (email) updates.email = email;
    if (password) updates.password = password;

    // Call the service to update the user
    const updatedUser = await editUser(id, updates);

    if (!updatedUser) {
      return res.status(404).send("User not found.");
    }

    res.status(200).json({
      message: "User updated successfully!",
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
      },
    });
  } catch (err) {
    console.error("Error updating user:", err);

    // Handle unique constraint violations
    if (err.code === "23505") {
      res.status(409).send("Username or email already exists.");
    } else {
      res.status(500).send("An error occurred while updating the user.");
    }
  }
};
