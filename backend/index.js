import express from "express";
import cors from "cors"; // ✅ import cors
import fetch from "node-fetch"; // ✅ if needed
import dotenv from "dotenv"; // ✅ to access .env

dotenv.config(); // Load environment variables

const app = express();
const PORT = 5000;

app.use(cors()); // ✅ allow cross-origin requests
app.use(express.json()); // ✅ parse incoming JSON

// Test route
app.get("/", (req, res) => {
  res.send("Hello from Chef Claude's backend!");
});

// New AI route (we'll fill this in next)
app.post("/get-recipe", async (req, res) => {
  const { ingredients, instruction = "" } = req.body;

  const ingredientsString = ingredients.join(", ");
  const prompt = `You are an assistant that receives a list of ingredients: ${ingredientsString} and suggests a recipe using some or all of those ingredients.${instruction} The recipe can include extra ingredients but try to keep it simple. Format your response in markdown: start with a natural recipe name or description, followed by a list of ingredients and instructions. Avoid using header like "Title" — keep the response conversational and easy to read in a humane manner`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_KEY}`,
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
    const recipe = data.choices?.[0]?.message?.content || "No recipe generated.";
    res.json({ recipe });
  } catch (error) {
    console.error("Error calling OpenRouter:", error.message);
    res.status(500).json({ error: "Something went wrong while generating recipe." });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
