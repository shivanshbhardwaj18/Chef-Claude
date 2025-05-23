import React from "react";
import IngredientsList from "./IngredientsList.jsx";
import ClaudeRecipe from "./ClaudeRecipe.jsx";
import SavedRecipes from "./SavedRecipes.jsx";
import { getRecipeFromMistral } from "../ai.js";
import { useAuth } from "../context/useAuth";
import { useSavedRecipes } from "../context/savedRecipes.jsx";

export default function Main() {
  const [ingredients, setIngredients] = React.useState([]);
  const [recipe, setRecipe] = React.useState("");
  const [recipeType, setRecipeType] = React.useState("Any"); // Veg / Non-Veg / Any
  const recipeSection = React.useRef(null);
  const [showSaved, setShowSaved] = React.useState(false);
  const { user } = useAuth();
  const { addRecipe } = useSavedRecipes();
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    if (recipe !== "" && recipeSection.current != null)
      recipeSection.current.scrollIntoView({ behavior: "smooth" });
  }, [recipe]);

  async function getRecipe() {
    console.log("Ingredients:", ingredients);

    let instruction = "Give me a recipe using these ingredients.";
    if (recipeType === "Veg") {
      instruction += " Only return a vegetarian recipe.";
    } else if (recipeType === "Non-Veg") {
      instruction += " Only return a non-vegetarian recipe.";
    }
    else if (recipeType === "Vegan") {
      instruction += " Only return a vegan recipe.";
    }

    const recipeMarkdown = await getRecipeFromMistral(ingredients, instruction);
    console.log("Recipe from API:", recipeMarkdown);
    setRecipe(recipeMarkdown);
  }

  function addIngredient(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const newIngredient = formData.get("ingredient")?.trim();

    if (!newIngredient) {
      alert("Please enter a valid ingredient.");
      return;
    }

    setIngredients((prevIngredients) => [...prevIngredients, newIngredient]);

    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.focus();
    }
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
    <main className="MainInput">
      {/* Ingredient Input Form */}
      <form onSubmit={addIngredient} className="add-ingredient-form">
        <input
          ref={inputRef}
          className="MInput"
          placeholder="for eg: oregano"
          type="text"
          name="ingredient"
          aria-label="Add ingredient"
        />
        <button type="submit" className="MButton">
          + Add Ingredient
        </button>
      </form>


     {/* Welcome Message when no ingredients are added */}
     {ingredients.length === 0 && (
     <div className="empty-message">
     <h2>🍽️ Ready to cook something creative?</h2>
     <p>Enter at least 4 ingredients above to get a delicious AI-generated recipe!</p>
     <p>Try things like <i>tomato, garlic, onion, basil</i> 🍅🌿🧄🧅</p>
     </div>
     )}

     

      
      {/* Recipe Type Options (only shown when ingredients are present) */}
      {ingredients.length > 3 && (
        <div className="recipe-type-options">
          <label className="radio-label" >Recipe Type </label>
          <label className="radio-option" style={{accentColor:"black"}}>
            <input
              type="radio"
              name="recipeType"
              value="Any"
              checked={recipeType === "Any"}
              onChange={(e) => setRecipeType(e.target.value)}
            />
            Any
          </label>
          <label className="radio-option" style={{accentColor:"blue"}}>
            <input
              type="radio"
              name="recipeType"
              value="Vegan"
              checked={recipeType === "Vegan"}
              onChange={(e) => setRecipeType(e.target.value)}
            />
            Vegan
          </label>
          <label className="radio-option" style={{accentColor:"#28a745"}}>
            <input
              type="radio"
              name="recipeType"
              value="Veg"
              checked={recipeType === "Veg"}
              onChange={(e) => setRecipeType(e.target.value)}
            />
            Vegetarian
          </label>
          <label className="radio-option" style={{accentColor:"red"}}>
            <input
              type="radio"
              name="recipeType"
              value="Non-Veg"
              checked={recipeType === "Non-Veg"}
              onChange={(e) => setRecipeType(e.target.value)}
            />
            Non-Vegetarian
          </label>

          
        </div>
      )}

      {/* Ingredients List */}
      {ingredients.length > 0 && (
        <IngredientsList
          ref={recipeSection}
          ingredients={ingredients}
          getRecipe={getRecipe}
        />
      )}

      {ingredients.length > 0 && ingredients.length < 4 && (
  <div className="ingredient-reminder">
    <p>
      📝 You’ve added {ingredients.length}. Add atleast {4 - ingredients.length} more to get your recipe.
    </p>
  </div>
)}

      {/* Recipe Display */}
      {recipe && (
        <section
          className="suggested-recipe-container"
          aria-live="polite"
          ref={recipeSection}
        >
          <ClaudeRecipe recipe={recipe} />
          <button
            className="save-recipe-button"
            onClick={saveCurrentRecipe}
            style={{ marginTop: "1rem" }}
            disabled={!recipe || !user}
            title={!user ? "Log in to save recipes" : ""}
          >
            💾 Save Recipe
          </button>
        </section>
      )}

      {/* Toggle Saved Recipes */}
      <button
        className="show-hide-recipe"
        onClick={() => setShowSaved((prev) => !prev)}
        style={{ marginTop: "2rem" }}
      >
        {showSaved ? "Hide Saved Recipes" : "Show Saved Recipes"}
      </button>

      {showSaved && <SavedRecipes />}
    </main>
  );
}
