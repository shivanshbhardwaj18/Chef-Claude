import React from "react";
import ClaudeRecipe from "./ClaudeRecipe.jsx";
import { getRecipeFromMistral } from "../ai.js";
import { useAuth } from "../context/useAuth";
import { useSavedRecipes } from "../context/savedRecipes.jsx";
import MainCard from "./MainCard.jsx";
import RecipeShowcase from "./RecipeShowcase.jsx";
import { useNavigate } from "react-router-dom";
import CTASection from "./CTASection.jsx";

export default function Main() {
  const [ingredients, setIngredients] = React.useState([]);
  const [recipe, setRecipe] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const recipeSection = React.useRef(null);
  const { user } = useAuth();
  const { addRecipe } = useSavedRecipes();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (recipe !== "" && recipeSection.current != null) {
      recipeSection.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [recipe]);

  async function getRecipe(cuisine, diet, time) {
    const recipeRequest = {
      ingredients: ingredients,
      cuisine: cuisine,
      diet: diet,
      time: time,
    };

    const recipeMarkdown = await getRecipeFromMistral(recipeRequest);
    setRecipe(recipeMarkdown);

    // reset save state when new recipe is generated
    setSaved(false);
    setSaving(false);
  }

  function addIngredient(newIngredient) {
    if (!newIngredient) return;
    setIngredients((prevIngredients) => [...prevIngredients, newIngredient]);
  }

  async function saveCurrentRecipe() {
    if (!recipe || recipe.trim() === "") return;

    if (!user) {
      navigate("/login");
      return;
    }

    const recipeObj = {
      content: recipe,
      ingredients,
    };

    try {
      setSaving(true);
      const savedObj = await addRecipe(recipeObj);
      if (savedObj) {
        setSaved(true);
      } else {
        console.warn("Recipe was not saved (backend indicated failure).");
      }
    } catch (err) {
      console.error("Error saving recipe:", err);
    } finally {
      setSaving(false);
    }
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
        style={{ display: recipe ? "block" : "none" }}
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
                style={{ marginTop: "1rem", cursor: "pointer" }}
                disabled={!recipe || saving || saved}
                title={!user ? "Log in to save recipes" : ""}
              >
                {!user
                  ? "🔒 Log in to Save"
                  : saving
                  ? "Saving..."
                  : saved
                  ? "Saved ✅"
                  : "💾 Save Recipe"}
              </button>
            </div>
          </>
        )}
      </section>

      {recipe && <RecipeShowcase />}

      <CTASection/>
    </main>
  );
}
