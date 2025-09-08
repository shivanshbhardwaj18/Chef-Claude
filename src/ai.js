export async function getRecipeFromMistral(recipeRequest) {
  try {
    const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

    // Prepare payload for backend
    const payload = { ...recipeRequest };

    // Only attach token if user wants to save the recipe
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      ...(payload.save && token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const response = await fetch(`${backendURL}/recipe/get-recipe`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Backend error:", text);
      return "Failed to generate recipe. Try again.";
    }

    const data = await response.json();
    return data.recipe || "No recipe generated.";
  } catch (err) {
    console.error("Error fetching recipe:", err);
    return "Sorry, something went wrong.";
  }
}
