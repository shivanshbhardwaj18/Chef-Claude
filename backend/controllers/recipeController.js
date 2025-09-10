import fetch from "node-fetch";
import pool from "../db.js";


function extractTitleFromMarkdown(markdown) {
  if (!markdown) return "AI Recipe";
  const lines = markdown.split("\n").map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) return "AI Recipe";
  const raw = lines[0].replace(/^[-*#>\s]+/, "").replace(/[*_`]+/g, "").trim();
  return raw.length > 0 ? (raw.length > 120 ? raw.slice(0, 117) + "..." : raw) : "AI Recipe";
}

// Generate AI recipe (with optional save if authenticated)
export const getRecipe = async (req, res) => {
  const { ingredients = [], cuisine, diet, time, save, content } = req.body;
  const userId = req.user?.id;

  console.log("[getRecipe] save flag:", save);
  console.log("[getRecipe] content provided:", !!content);
  console.log("[getRecipe] received ingredients length:", Array.isArray(ingredients) ? ingredients.length : "not-array");
  console.log("[getRecipe] req.user:", req.user ? { id: req.user.id, email: req.user.email } : null);
  console.log("[getRecipe] Authorization header present:", !!req.headers?.authorization);

  // If content is provided (for saving existing recipe), use it directly
  if (content && save) {
    if (!userId) {
      console.warn("[getRecipe] save requested with content but no authenticated user");
      return res.status(401).json({ error: "Authentication required to save recipe" });
    }

    try {
      const title = extractTitleFromMarkdown(content);
      
      const savedRecipe = await pool.query(
        `INSERT INTO recipes (user_id, title, instructions, source)
         VALUES ($1, $2, $3, $4) RETURNING id, title, instructions, source, user_id, created_at`,
        [userId, title, content, "AI"]
      );

      const recipeId = savedRecipe.rows[0].id;

      await pool.query(
        `INSERT INTO saved_recipes (user_id, recipe_id) VALUES ($1, $2)`,
        [userId, recipeId]
      );

      return res.json({
        recipe: content,
        saved: savedRecipe.rows[0],
      });
    } catch (err) {
      console.error("Error saving existing recipe:", err && err.stack ? err.stack : err);
      return res.status(500).json({ error: "Something went wrong while saving recipe." });
    }
  }

  const ingredientsString = Array.isArray(ingredients) ? ingredients.join(",") : String(ingredients || "");

  let instruction = "";
  if (cuisine && cuisine !== "Any") instruction += ` The recipe should be a ${cuisine} dish.`;
  if (diet && diet !== "None") instruction += ` It should also be ${diet}.`;
  if (time && time !== "Any") instruction += ` The cooking time should be ${time}.`;

  const prompt = `You are an assistant that receives a list of ingredients: ${ingredientsString} and suggests a recipe using some or all of those ingredients.${instruction} try to keep it simple, follow the ${instruction} provided strictly. Format your response in markdown: start with a natural recipe name or description, followed by a list of ingredients and instructions. Avoid using header like "Title" — keep the response conversational and easy to read in a humane manner`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct",
        messages: [
          { role: "system", content: "You suggest recipes using ingredients." },
          { role: "user", content: prompt },
        ],
      }),
    });

    const data = await response.json();
    const recipeText = data.choices?.[0]?.message?.content || "No recipe generated.";

    // If client requested save=true, require authentication and save to DB
    if (save) {
      if (!userId) {
        console.warn("[getRecipe] save requested but no authenticated user (req.user missing)");
        return res.status(401).json({ error: "Authentication required to save recipe" });
      }

      const title = extractTitleFromMarkdown(recipeText);
      const instructions = recipeText.split("\n").slice(1).join("\n").trim();

      const savedRecipe = await pool.query(
        `INSERT INTO recipes (user_id, title, instructions, source)
         VALUES ($1, $2, $3, $4) RETURNING id, title, instructions, source, user_id, created_at`,
        [userId, title, instructions, "AI"]
      );

      const recipeId = savedRecipe.rows[0].id;

      await pool.query(
        `INSERT INTO saved_recipes (user_id, recipe_id) VALUES ($1, $2)`,
        [userId, recipeId]
      );

      return res.json({
        recipe: recipeText,
        saved: savedRecipe.rows[0],
      });
    }

    return res.json({ recipe: recipeText });
  } catch (err) {
    console.error("Error in getRecipe:", err && err.stack ? err.stack : err);
    return res.status(500).json({ error: "Something went wrong while generating recipe." });
  }
};

// Fetch saved recipes for the logged-in user
export const getSavedRecipes = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: "Authentication required" });

  try {
    const result = await pool.query(
      `SELECT r.id, r.title, r.instructions, r.source, sr.saved_at
       FROM saved_recipes sr
       JOIN recipes r ON sr.recipe_id = r.id
       WHERE sr.user_id = $1
       ORDER BY sr.saved_at DESC`,
      [userId]
    );

    res.json({ savedRecipes: result.rows });
  } catch (err) {
    console.error("Error fetching saved recipes:", err && err.stack ? err.stack : err);
    res.status(500).json({ error: "Failed to fetch saved recipes" });
  }
};

// Delete a saved recipe
export const deleteRecipe = async (req, res) => {
  const userId = req.user?.id;
  const recipeId = req.params.id;

  if (!userId) return res.status(401).json({ error: "Authentication required" });

  try {
    await pool.query(
      `DELETE FROM saved_recipes WHERE user_id = $1 AND recipe_id = $2`,
      [userId, recipeId]
    );

    res.json({ success: true, message: "Recipe removed successfully." });
  } catch (err) {
    console.error("Error deleting recipe:", err && err.stack ? err.stack : err);
    res.status(500).json({ success: false, error: "Failed to remove recipe." });
  }
};