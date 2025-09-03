import React from 'react';
import { Link } from 'react-router-dom';
import Carousel from './Carousel.jsx';
import './RecipeShowcase.css';

// --- Placeholder Data ---
const popularRecipes = [
{ id: 1, title: 'Avocado Toast with Egg', imageUrl: '/avocado-toast2.png' },
{ id: 2, title: 'Spicy Ramen Noodles', imageUrl: '/spicy-ramen1.png' },
{ id: 3, title: 'Grilled Salmon Salad', imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80' },
{ id: 4, title: 'Blueberry Pancakes', imageUrl: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80' },
{ id: 5, title: 'Chicken Curry', imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=952&q=80' },
];

const cuisines = [
{ id: 1, name: 'Italian', imageUrl: 'https://images.squarespace-cdn.com/content/v1/5e484ab628c78d6f7e602d73/1599248222831-ZMHAFYJT9T3IXH3IVGKY/What-to-eat-in-Italy.png' },
{ id: 2, name: 'Mexican', imageUrl: '/Mexican-Cuisine.png' },
{ id: 3, name: 'Japanese', imageUrl: '/Japanese-Cuisine.png' },
{ id: 4, name: 'Indian', imageUrl: '/Indian-Cuisine.png' },
{ id: 5, name: 'Mediterranean', imageUrl: '/Medit-Cuisine.png' },
];

// --- Card Components ---
const RecipeCard = ({ item }) => (
  <Link to={`/recipe/${item.id}`} className="recipe-card-link">
    <div className="recipe-card">
      <img src={item.imageUrl} alt={item.title} />
      <div className="recipe-card-title">{item.title}</div>
    </div>
  </Link>
);

const CuisineCard = ({ item }) => (
  <Link to={`/cuisine/${item.id}`} className="cuisine-card-link">
    <div className="cuisine-card">
      <img src={item.imageUrl} alt={item.name} />
      <div className="cuisine-card-name">{item.name}</div>
    </div>
  </Link>
);


const RecipeShowcase = () => {
  return (
    <div className="recipe-showcase-container">
      <Carousel 
        title="Popular Recipes"
        items={popularRecipes}
        renderItem={(item) => <RecipeCard item={item} />}
      />
      <Carousel 
        title="Cuisines"
        items={cuisines}
        renderItem={(item) => <CuisineCard item={item} />}
      />
    </div>
  );
};

export default RecipeShowcase;
