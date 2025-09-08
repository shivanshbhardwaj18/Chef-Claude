import pool from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

function normalizeUserRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    email: row.email,
    display_name: row.display_name ?? null,
    avatar_url: row.avatar_url ?? null,
    displayName: row.display_name ?? null,
    avatarUrl: row.avatar_url ?? null,
  };
}

// Signup
export const signup = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existingUser.rows.length > 0)
      return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      "INSERT INTO users (email, password_hash, display_name) VALUES ($1, $2, $3) RETURNING id, email, display_name, avatar_url",
      [email, hashedPassword, name]
    );

    const token = jwt.sign(
      { id: newUser.rows[0].id, email: newUser.rows[0].email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({ message: "User created successfully", user: normalizeUserRow(newUser.rows[0]), token });
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userResult.rows.length === 0)
      return res.status(400).json({ error: "Invalid email or password" });

    const user = userResult.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(400).json({ error: "Invalid email or password" });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ message: "Login successful", user: normalizeUserRow(user), token });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get current user info
export const getMe = async (req, res) => {
  try {
    const userId = req.user.id;
    const userResult = await pool.query(
      "SELECT id, email, display_name, avatar_url FROM users WHERE id = $1",
      [userId]
    );
    if (userResult.rows.length === 0)
      return res.status(404).json({ error: "User not found" });

    res.json({ user: normalizeUserRow(userResult.rows[0]) });
  } catch (err) {
    console.error("getMe error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const body = req.body || {};
    const incomingDisplayName = body.display_name ?? body.displayName;
    const incomingAvatarUrl = body.avatar_url ?? body.avatarUrl;

    
    const current = await pool.query("SELECT display_name, avatar_url FROM users WHERE id = $1", [userId]);
    if (current.rows.length === 0) return res.status(404).json({ error: "User not found" });

    const finalDisplayName = (typeof incomingDisplayName !== "undefined") ? incomingDisplayName : current.rows[0].display_name;
    const finalAvatarUrl = (typeof incomingAvatarUrl !== "undefined") ? incomingAvatarUrl : current.rows[0].avatar_url;

    const updatedUser = await pool.query(
      "UPDATE users SET display_name = $1, avatar_url = $2 WHERE id = $3 RETURNING id, email, display_name, avatar_url",
      [finalDisplayName, finalAvatarUrl, userId]
    );

    res.json({ user: normalizeUserRow(updatedUser.rows[0]) });
  } catch (err) {
    console.error("updateProfile error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Change password
export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6)
      return res.status(400).json({ error: "Password must be at least 6 characters" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
      "UPDATE users SET password_hash = $1 WHERE id = $2",
      [hashedPassword, userId]
    );

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("changePassword error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete account
export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    await pool.query("DELETE FROM users WHERE id = $1", [userId]);
    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    console.error("deleteAccount error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
