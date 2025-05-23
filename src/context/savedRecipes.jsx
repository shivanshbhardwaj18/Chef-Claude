import { useState, useEffect, useContext, createContext } from "react";
import { db } from "../firebase";
import { doc, onSnapshot, updateDoc, arrayUnion, arrayRemove, setDoc, getDoc } from "firebase/firestore";
import { useAuth } from "./useAuth";

const SavedRecipesContext = createContext();

function SavedRecipesProvider({ children }) {
  const { user } = useAuth();
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setSavedRecipes([]);
      setLoading(false);
      return;
    }

    const userDocRef = doc(db, "users", user.uid);

    // Check if user doc exists once to create if missing (optional)
    async function ensureUserDoc() {
      const docSnap = await getDoc(userDocRef);
      if (!docSnap.exists()) {
        await setDoc(userDocRef, { recipes: [] });
      }
    }
    ensureUserDoc();

    // Real-time listener on user's recipes doc
    const unsubscribe = onSnapshot(
      userDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setSavedRecipes(docSnap.data().recipes || []);
        } else {
          setSavedRecipes([]);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching saved recipes in real-time:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  async function addRecipe(newRecipe) {
    if (!user) return;
    try {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        recipes: arrayUnion(newRecipe),
      });
    } catch (error) {
      console.error("Error adding recipe:", error);
    }
  }

  async function removeRecipe(recipeToRemove) {
    if (!user) return;
    try {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        recipes: arrayRemove(recipeToRemove),
      });
    } catch (error) {
      console.error("Error removing recipe:", error);
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
