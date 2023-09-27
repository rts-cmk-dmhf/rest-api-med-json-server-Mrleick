import React from "react";

const Recipe = ({ title, ingredients }) => {
  return (
    <div>
      <h1>{title}</h1>
      <ol>
        {ingredients.map((ingredient) => (
          <li>{ingredient.text}</li>
        ))}
      </ol>
    </div>
  );
};
export default Recipe;
