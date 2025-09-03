// src/components/Main.jsx

import React from "react";
import ClaudeRecipe from "./ClaudeRecipe.jsx";
import { getRecipeFromMistral } from "../ai.js";
import { useAuth } from "../context/useAuth";
import { useSavedRecipes } from "../context/savedRecipes.jsx";
import MainCard from "./MainCard.jsx";
import RecipeShowcase from "./RecipeShowcase.jsx";

export default function Main() {
  const [ingredients, setIngredients] = React.useState([]);
  const [recipe, setRecipe] = React.useState("");
  const recipeSection = React.useRef(null);
  const { user } = useAuth();
  const { addRecipe } = useSavedRecipes();

  React.useEffect(() => {
    if (recipe !== "" && recipeSection.current != null)
      recipeSection.current.scrollIntoView({ behavior: "smooth" });
  }, [recipe]);

  // --- THIS FUNCTION IS NOW CORRECTED ---
  // It now passes the raw data object to your ai.js helper
  async function getRecipe(cuisine, diet, time) {
    const recipeRequest = {
      ingredients: ingredients,
      cuisine: cuisine,
      diet: diet,
      time: time,
    };

    const recipeMarkdown = await getRecipeFromMistral(recipeRequest);
    setRecipe(recipeMarkdown);
  }

  function addIngredient(newIngredient) {
    if (!newIngredient) {
      alert("Please enter a valid ingredient.");
      return;
    }
    setIngredients((prevIngredients) => [...prevIngredients, newIngredient]);
  }

  function saveCurrentRecipe() {
    if (!recipe || recipe.trim() === "") {
      alert("Cannot save an empty recipe!");
      return;
    }
    if (!user) {
      alert("Please log in to save your recipe.");
      return;
    }
    addRecipe(recipe);
    alert("Recipe saved!");
  }

  return (
    <main className="Main">
      <MainCard
        ingredients={ingredients}
        addIngredient={addIngredient}
        getRecipe={getRecipe}
      />

      {!recipe && <RecipeShowcase />}

      <section
        className="suggested-recipe-container"
        style={{ display: recipe ? 'block' : 'none' }} // Use style to hide/show
        aria-live="polite"
        ref={recipeSection}
      >
        {recipe && (
          <>
            <ClaudeRecipe recipe={recipe} />
            <div className="recipe-actions">
            <button
              className="save-recipe-button"
              onClick={saveCurrentRecipe}
              style={{ marginTop: "1rem" }}
              disabled={!recipe || !user}
              title={!user ? "Log in to save recipes" : ""}
            >
              💾 Save Recipe
            </button>
            </div>
          </>
        )}
      </section>
      
      {recipe && <RecipeShowcase />}
    </main>
  );
}
