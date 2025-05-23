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
      {savedRecipes.map((recipe, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "1rem",
            marginBottom: "1rem",
            backgroundColor: "#f9f9f9",
            position: "relative",
          }}
        >
          <ReactMarkdown>{recipe}</ReactMarkdown>
          <button
            onClick={() => removeRecipe(recipe)}  // pass recipe string here
            className="Remove-Saved"
          >
            🗑️ Remove
          </button>
        </div>
      ))}
    </section>
  );
}
