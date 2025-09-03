import React from 'react';
import { useParams } from 'react-router-dom'; 
import { recipes } from '../data/recipes.js'; 
import './RecipePage.css'; 

const RecipePage = () => {
  const { id } = useParams();
  
  const recipe = recipes.find(r => r.id === parseInt(id));

  if (!recipe) {
    return <div className="recipe-not-found"><h1>Recipe Not Found</h1></div>;
  }

  return (
    <div className="recipe-page-wrapper">
      <header className="recipe-hero">
        <img src={recipe.imageUrl} alt={recipe.title} className="hero-image" />
        <div className="hero-overlay">
          <h1 className="recipe-main-title">{recipe.title}</h1>
        </div>
      </header>

      <main className="recipe-content-container">
        <div className="key-info-bar">
          <div className="info-item">
            <span className="info-icon">⏱️</span>
            <span className="info-label">Cook Time</span>
            <span className="info-value">{recipe.cookTime}</span>
          </div>
          <div className="info-item">
            <span className="info-icon">👥</span>
            <span className="info-label">Servings</span>
            <span className="info-value">{recipe.servings}</span>
          </div>
          <div className="info-item">
            <span className="info-icon">📊</span>
            <span className="info-label">Difficulty</span>
            <span className="info-value">{recipe.difficulty}</span>
          </div>
        </div>

        <div className="recipe-body-grid">
          <aside className="ingredients-section">
            <h2 className="section-title">Ingredients</h2>
            <ul className="ingredients-list">
              {recipe.ingredients.map((ing, index) => (
                <li key={index}>
                  <label>
                    <input type="checkbox" className="ingredient-checkbox" />
                    <span className="checkmark"></span>
                    <span className="ingredient-name">{ing.name}</span>
                    <span className="ingredient-quantity">{ing.quantity}</span>
                  </label>
                </li>
              ))}
            </ul>
          </aside>

          <section className="instructions-section">
            <h2 className="section-title">Instructions</h2>
            <ol className="instructions-list">
              {recipe.instructions.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
            <button className="cook-mode-button">
              Enter Cook Mode
            </button>
          </section>
        </div>
      </main>
    </div>
  );
};

export default RecipePage;