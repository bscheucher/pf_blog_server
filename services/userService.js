import pool from "../config/database.js";
import bcrypt from "bcrypt";

// Register a new user
export const registerUser = async (username, email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const query =
    "INSERT INTO blog_users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *";
  const values = [username, email, hashedPassword];
  const result = await pool.query(query, values);
  return result.rows[0];
};

// Find a user by username
export const findUserByUsername = async (username) => {
  const result = await pool.query(
    "SELECT * FROM blog_users WHERE username = $1",
    [username]
  );
  return result.rows[0];
};

// Find a user by ID
export const findUserById = async (id) => {
  const result = await pool.query(
    "SELECT * FROM blog_users WHERE id = $1",
    [id]
  );
  return result.rows[0];
};
