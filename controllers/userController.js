import { findUserById } from "../services/userService.js";
import { registerUser } from "../services/userService.js";
import passport from "../config/passport.js";

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
      res.status(201).json({
        message: "User logged in successfully!",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      });
    });
  })(req, res, next);
};

// Log out a user
export const logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).send("An error occurred during logout.");
    }
    res.status(200).send("Logged out successfully.");
  });
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
