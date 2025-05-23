import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { SavedRecipesProvider } from "./context/savedRecipes";
import { AuthProvider } from "./context/AuthContext"; 
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SavedRecipesProvider>
          <App />
        </SavedRecipesProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
