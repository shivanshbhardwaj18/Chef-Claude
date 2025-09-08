import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import recipeRoutes from "./routes/recipe.js";
import pool from "./db.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);       // /auth/signup, /auth/login
app.use("/recipe", recipeRoutes);   // /recipe/get-recipe

// Test route
app.get("/", (req, res) => res.send("Hello from ChefVerse backend!"));

// DB test
app.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ success: true, time: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, async () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("✅ Connected to Postgres at:", result.rows[0].now);
  } catch (err) {
    console.error("❌ Postgres connection failed:", err.message);
  }
});
