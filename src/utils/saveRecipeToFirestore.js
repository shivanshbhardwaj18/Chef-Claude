// src/utils/saveRecipeToFirestore.js
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

export async function saveRecipeToFirestore(userId, recipe) {
  try {
    const recipeId = recipe.title.replace(/\s+/g, "-").toLowerCase(); // unique-ish id
    const recipeRef = doc(db, "users", userId, "recipes", recipeId);
    await setDoc(recipeRef, recipe);
    console.log("Recipe saved to Firestore");
  } catch (error) {
    console.error("Error saving recipe:", error);
  }
}
