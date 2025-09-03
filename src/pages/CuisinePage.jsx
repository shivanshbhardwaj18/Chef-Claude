import React from 'react';
import { useParams } from 'react-router-dom';
import { cuisines } from '../data/cuisines.js';
import './CuisinePage.css';

const CuisinePage = () => {
  const { id } = useParams();
  const cuisine = cuisines.find(c => c.id === parseInt(id));

  if (!cuisine) {
    return <div className="cuisine-not-found"><h1>Cuisine not found!</h1></div>;
  }

  return (
    <div className="cuisine-page-wrapper">
      <header 
        className="cuisine-hero" 
        style={{ backgroundImage: `url(${cuisine.imageUrl})` }}
      >
        <div className="cuisine-hero-overlay">
          <h1 className="cuisine-main-title">{cuisine.name}</h1>
        </div>
      </header>

      <main className="cuisine-content-container">
        <section className="cuisine-description-section">
          <p className="cuisine-description">{cuisine.description}</p>
        </section>

        <section className="popular-recipes-section">
          <h2 className="popular-recipes-title">Popular Dishes</h2>
          <div className="popular-recipes-grid">
            {cuisine.popularRecipes.map((recipe, index) => (
              <div key={index} className="popular-recipe-card">
                <img src={recipe.imageUrl} alt={recipe.title} />
                <div className="popular-recipe-card-title">{recipe.title}</div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default CuisinePage;
