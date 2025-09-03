import React from 'react';
import './MainCard.css';

const pluralMap = {
  tomatoes: 'tomato',
  potatoes: 'potato',
  carrots: 'carrot',
  onions: 'onion',
  mushrooms: 'mushroom',
  peppers: 'pepper',
  cucumbers: 'cucumber',
  apples: 'apple',
  bananas: 'banana',
  oranges: 'orange',
  lemons: 'lemon',
  limes: 'lime',
  strawberries: 'strawberry',
  blueberries: 'blueberry',
  eggs: 'egg',
  olives: 'oil',
};

const ingredientStyles = {
  tomato: { backgroundColor: '#ffd5d1', emoji: '🍅' },
  potato: { backgroundColor: '#f7ebda', emoji: '🥔' },
  carrot: { backgroundColor: '#ffe1cc', emoji: '🥕' },
  onion: { backgroundColor: '#f6e9fb', emoji: '🧅' },
  garlic: { backgroundColor: '#fafafa', emoji: '🧄' },
  broccoli: { backgroundColor: '#d4f0d2', emoji: '🥦' },
  spinach: { backgroundColor: '#c8eac5', emoji: '🍃' },
  mushroom: { backgroundColor: '#ffd9d4', emoji: '🍄' },
  pepper: { backgroundColor: '#ffd6d1', emoji: '🌶️' },
  cucumber: { backgroundColor: '#d4f5d0', emoji: '🥒' },
  lettuce: { backgroundColor: '#e5f8d8', emoji: '🥬' },
  corn: { backgroundColor: '#fff7cc', emoji: '🌽' },
  eggplant: { backgroundColor: '#f0dbf8', emoji: '🍆' },

  apple: { backgroundColor: '#ffdbdb', emoji: '🍎' },
  banana: { backgroundColor: '#fff8d5', emoji: '🍌' },
  orange: { backgroundColor: '#ffe9cc', emoji: '🍊' },
  lemon: { backgroundColor: '#fffce0', emoji: '🍋' },
  lime: { backgroundColor: '#f2fad2', emoji: '🍈' },
  strawberry: { backgroundColor: '#ffd6da', emoji: '🍓' },
  blueberry: { backgroundColor: '#e3dbff', emoji: '🫐' },
  avocado: { backgroundColor: '#e3f6d8', emoji: '🥑' },
  pineapple: { backgroundColor: '#fff4c2', emoji: '🍍' },
  mango: { backgroundColor: '#ffe6b8', emoji: '🥭' },
  grapes: { backgroundColor: '#f3d7ff', emoji: '🍇' },
  
  chicken: { backgroundColor: '#ffe8d6', emoji: '🍗' },
  beef: { backgroundColor: '#ffd9cc', emoji: '🥩' },
  pork: { backgroundColor: '#ffe0eb', emoji: '🥓' },
  fish: { backgroundColor: '#d9f3ff', emoji: '🐟' },
  shrimp: { backgroundColor: '#ffe1e0', emoji: '🦐' },
  egg: { backgroundColor: '#e8e6e1', emoji: '⚪' },
  tofu: { backgroundColor: '#f8f8f8', emoji: '🧱' },
  
  milk: { backgroundColor: '#f9f9f9', emoji: '🥛' },
  cheese: { backgroundColor: '#fff2cc', emoji: '🧀' },
  butter: { backgroundColor: '#fff8d6', emoji: '🧈' },
  oil: { backgroundColor: '#fffde0', emoji: '🫒' },

  pasta: { backgroundColor: '#fff2d1', emoji: '🍝' },
  rice: { backgroundColor: '#fbfbfb', emoji: '🍚' },
  bread: { backgroundColor: '#ffe7d1', emoji: '🍞' },
  flour: { backgroundColor: '#fafafa', emoji: '🌾' },

  basil: { backgroundColor: '#d9f5d4', emoji: '🌿' },
  oregano: { backgroundColor: '#e5f7d4', emoji: '🌿' },
  parsley: { backgroundColor: '#d9f5d4', emoji: '🌿' },
  chili: { backgroundColor: '#ffd6d1', emoji: '🌶️' },
  salt: { backgroundColor: '#f9f9f9', emoji: '🧂' },
  clove: { backgroundColor: '#f2e2d2', emoji: '🍀' },

  default: { backgroundColor: '#f1f3f4', emoji: null }
};

const MainCard = ({
  ingredients,
  addIngredient,
  getRecipe,
}) => {
  const [currentIngredient, setCurrentIngredient] = React.useState('');
  
  const [cuisine, setCuisine] = React.useState('Any');
  const [diet, setDiet] = React.useState('None');
  const [time, setTime] = React.useState('Any');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentIngredient.trim() === '') return;
    addIngredient(currentIngredient);
    setCurrentIngredient('');
  };

  const getPreRecipeMessage = () => {
    const count = ingredients.length;
    switch (count) {
      case 1:
        return {
          heading: "That's a fantastic start! What's next, Chef?",
          subheading: "Let's add a few more items to discover the perfect dish for your taste.",
        };
      case 2:
        return {
          heading: 'Looking delicious! What else is on the list?',
          subheading: 'The best recipes are just a couple of ingredients away from being unlocked.',
        };
      case 3:
        return {
          heading: 'Almost there! Just one more ingredient.',
          subheading: 'Add the final item to create your custom, delicious AI-generated recipe.',
        };
      default:
        return {
          heading: 'Chef, ready to cook something creative?',
          subheading: 'Enter ingredients you have on hand and let Chef Claude work its magic!',
        };
    }
  };

  const message = getPreRecipeMessage();

  const renderIngredientTags = () => {
    return ingredients.map((ingredient, index) => {
      const normalizedIngredient = ingredient.toLowerCase().trim();
      const singularIngredient = pluralMap[normalizedIngredient] || normalizedIngredient;
      const style = ingredientStyles[singularIngredient] || ingredientStyles.default;

      return (
        <span
          key={index}
          className="ingredient-tag"
          style={{ backgroundColor: style.backgroundColor }}
        >
          {style.emoji && <span className="emoji">{style.emoji}</span>}
          {ingredient}
        </span>
      );
    });
  };

  const cardStyle = {
    minHeight: ingredients.length === 0 ? '275px' : '340px',
  };

  return (
    <div className="main-card-container" style={cardStyle}>
      <div className="main-card-left">
        {ingredients.length < 4 ? (
          <div className="welcome-view">
            <h1>{message.heading}</h1>
            <p className="subtitle">{message.subheading}</p>
            <form onSubmit={handleSubmit} className="ingredient-form">
              <input
                type="text"
                value={currentIngredient}
                onChange={(e) => setCurrentIngredient(e.target.value)}
                placeholder="e.g., chicken, pasta, tomatoes"
                className="ingredient-input"
              />
              <button type="submit" className="search-button">+</button>
            </form>
            {ingredients.length > 0 && (
              <div className="ingredients-list-container">
                <h2 className="section-title">Ingredients on hand:</h2>
                <div className="ingredients-list">
                  {renderIngredientTags()}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="active-view">
            <form onSubmit={handleSubmit} className="ingredient-form">
              <input
                type="text"
                value={currentIngredient}
                onChange={(e) => setCurrentIngredient(e.target.value)}
                placeholder="Add another ingredient..."
                className="ingredient-input"
              />
              <button type="submit" className="add-button">Add</button>
            </form>
            <div className="active-view-content">
              <div>
                <h2 className="section-title">Ingredients on hand:</h2>
                <div className="ingredients-list">
                  {renderIngredientTags()}
                </div>
              </div>
              <div className="spacer"></div>
              <div className="filters-section">
                <h2 className="section-title">Filters</h2>
                <div className="filters-grid">
                  <div className="filter-group">
                    <label htmlFor="cuisine-select">Cuisine</label>
                    <select id="cuisine-select" value={cuisine} onChange={(e) => setCuisine(e.target.value)} className="filter-select">
                      <option>Any</option>
                      <option>Italian</option>
                      <option>Mexican</option>
                      <option>Indian</option>
                      <option>Chinese</option>
                      <option>Japanese</option>
                    </select>
                  </div>
                  <div className="filter-group">
                    <label htmlFor="diet-select">Dietary</label>
                    <select id="diet-select" value={diet} onChange={(e) => setDiet(e.target.value)} className="filter-select">
                      <option>None</option>
                      <option>Vegetarian</option>
                      <option>Vegan</option>
                      <option>Non-Vegetarian</option>
                      <option>Gluten-Free</option>
                    </select>
                  </div>
                  <div className="filter-group">
                    <label htmlFor="time-select">Cooking Time</label>
                    <select id="time-select" value={time} onChange={(e) => setTime(e.target.value)} className="filter-select">
                      <option>Any</option>
                      <option>Under 15 min</option>
                      <option>Under 30 min</option>
                      <option>Under 1 hour</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="main-card-right">
        <img
          src="/right-column5.png"
          alt="A delicious meal"
        />
      </div>
      
      {ingredients.length > 3 && (
        <button onClick={() => getRecipe(cuisine, diet, time)} className="get-recipe-button">
        <span>Get a Recipe</span>
        </button>
      )}
    </div>
  );
};

export default MainCard;