// src/ai.js

export async function getRecipeFromMistral(recipeRequest) {
  try {
    const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

    const response = await fetch(`${backendURL}/get-recipe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // Send the entire recipeRequest object in the body
      body: JSON.stringify(recipeRequest),
    });

    const data = await response.json();
    return data.recipe || "No recipe generated.";
  } catch (error) {
    console.error("Error fetching from backend:", error.message);
    return "Sorry, something went wrong.";
  }
}
