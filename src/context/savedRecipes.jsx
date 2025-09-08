import { useState, useEffect, useContext, createContext } from "react";
import { useAuth } from "./useAuth";

const SavedRecipesContext = createContext();

function SavedRecipesProvider({ children }) {
  const { user, token } = useAuth();
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch saved recipes from backend
  useEffect(() => {
    if (!user || !token) {
      setSavedRecipes([]);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchSavedRecipes() {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/recipe/saved`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const text = await res.text();
          console.error("Failed fetching saved recipes:", res.status, text);
          if (!cancelled) setSavedRecipes([]);
          return;
        }

        const data = await res.json();
        if (!cancelled) setSavedRecipes(data.savedRecipes || []);
      } catch (err) {
        console.error("Error fetching saved recipes:", err);
        if (!cancelled) setSavedRecipes([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchSavedRecipes();
    return () => { cancelled = true; };
  }, [user, token]);

  async function addRecipe(recipe) {
    if (!user || !token) return null;

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/recipe/get-recipe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...recipe, save: true }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Error saving recipe (status):", res.status, text);
        return null;
      }

      const data = await res.json();

      if (data.saved) {
        setSavedRecipes(prev => [data.saved, ...prev]);
        return data.saved;
      } else {
        console.warn("Save API returned no saved recipe:", data);
        return null;
      }
    } catch (err) {
      console.error("Error saving recipe:", err);
      return null;
    }
  }

  async function removeRecipe(recipeId) {
    if (!user || !token) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/recipe/${recipeId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setSavedRecipes(prev => prev.filter(r => r.id !== recipeId));
        return true;
      } else {
        const text = await res.text();
        console.error("Failed to remove recipe:", res.status, text);
        return false;
      }
    } catch (err) {
      console.error("Error removing recipe:", err);
      return false;
    }
  }

  return (
    <SavedRecipesContext.Provider
      value={{ savedRecipes, addRecipe, removeRecipe, loading }}
    >
      {children}
    </SavedRecipesContext.Provider>
  );
}

function useSavedRecipes() {
  return useContext(SavedRecipesContext);
}

export { useSavedRecipes, SavedRecipesProvider };
