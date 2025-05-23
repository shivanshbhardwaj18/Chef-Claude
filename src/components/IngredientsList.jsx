import React, { useEffect, useState } from 'react';
import './IngredientsList.css';  // Import the CSS file for the styles

export default function IngredientsList(props) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);  // Trigger fade-in animation when component mounts
    }, []);

    const ingredientsListItems = props.ingredients.map((ingredient, index) => (
        <li key={ingredient} className={`ingredient-item fade-in ${isVisible ? 'show' : ''}`} style={{ animationDelay: `${index * 0.1}s` }}>
            {ingredient}
        </li>
    ));

    return (
        <section className={`abcd ${isVisible ? 'fade-in' : ''}`}>
            <h2 className='ingredients-header'>Ingredients on hand:</h2>
            <ul className="ingredients-list" aria-live="polite">
                {ingredientsListItems}
            </ul>
            {props.ingredients.length > 3 && (
                <div className="get-recipe-container">
                    <div ref={props.ref}>
                        <h3>Ready for a recipe?</h3>
                        <p>Generate a recipe from your list of ingredients.</p>
                    </div>
                    <button className="get-recipe-btn" onClick={props.getRecipe}>Get a recipe</button>
                </div>
            )}
        </section>
    );
}
