export async function getRecipeFromMistral(ingredientsArr, instruction = "") {
  try {
    const response = await fetch("http://localhost:5000/get-recipe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ingredients: ingredientsArr,
        instruction,
      }),
    });

    const data = await response.json();
    return data.recipe || "No recipe generated.";
  } catch (error) {
    console.error("Error fetching from backend:", error.message);
    return "Sorry, something went wrong.";
  }
}
