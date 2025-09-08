import express from "express";
import { getRecipe, getSavedRecipes, deleteRecipe } from "../controllers/recipeController.js";
import { authenticateToken, authenticateTokenOptional } from "../middleware/auth.js";

const router = express.Router();

router.post("/get-recipe",authenticateTokenOptional, getRecipe);
router.get("/saved", authenticateToken, getSavedRecipes);
router.delete("/:id", authenticateToken, deleteRecipe);

export default router;
