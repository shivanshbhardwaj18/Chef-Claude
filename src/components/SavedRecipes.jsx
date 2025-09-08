import { useSavedRecipes } from "../context/savedRecipes.jsx";
import ReactMarkdown from "react-markdown";

export default function SavedRecipes() {
  const { savedRecipes, removeRecipe } = useSavedRecipes();

  if (savedRecipes.length === 0) {
    return <p style={{ padding: "1rem" }}>No saved recipes yet.</p>;
  }

  return (
    <section style={{ padding: "1rem" }}>
      <h2>📚 Your Saved Recipes</h2>
      {savedRecipes.map((recipe) => (
        <div
          key={recipe.id}
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "1rem",
            marginBottom: "1rem",
            backgroundColor: "#f9f9f9",
            position: "relative",
          }}
        >
          <h3>{recipe.title}</h3>
          <ReactMarkdown>{recipe.instructions}</ReactMarkdown>
          <button
            onClick={() => removeRecipe(recipe.id)}
            className="Remove-Saved"
          >
            🗑️ Remove
          </button>
        </div>
      ))}
    </section>
  );
}
