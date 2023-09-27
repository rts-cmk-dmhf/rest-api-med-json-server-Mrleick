import React, { useState, useEffect } from "react";
import Mad from "./assets/mad.jpg";

const RecipeApp = () => {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [newRecipeName, setNewRecipeName] = useState("");
  const [newIngredient, setNewIngredient] = useState({ navn: "", mængde: "" });
  const [ingredientList, setIngredientList] = useState([]);

  const fetchRecipes = async () => {
    try {
      const response = await fetch("http://localhost:3000/recipes");
      if (!response.ok) {
        throw new Error("Fejl ved hentning af opskrifter");
      }
      const data = await response.json();
      setRecipes(data);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRecipes();
  };

  const handleAddIngredient = () => {
    if (newIngredient.navn.trim() !== "") {
      setIngredientList([...ingredientList, newIngredient]);
      setNewIngredient({ navn: "", mængde: "" });
    }
  };

  const handleDeleteRecipe = async (recipeId) => {
    try {
      const updatedRecipes = recipes.map((recipe) =>
        recipe.id === recipeId ? { ...recipe, isDeleted: true } : recipe
      );

      setRecipes(updatedRecipes);
    } catch (error) {
      console.error("Fejl ved sletning af opskrift:", error.message);
    }
  };

  const handleAddRecipe = async (e) => {
    e.preventDefault();

    const newRecipeObject = {
      navn: newRecipeName,
      ingredienser: ingredientList,
    };

    try {
      const response = await fetch("http://localhost:3000/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRecipeObject),
      });

      if (response.status === 201) {
        const responseData = await response.json();
        setRecipes([...recipes, responseData]); // Opdater opskriftslisten med den nye opskrift
        setNewRecipeName("");
        setNewIngredient({ navn: "", mængde: "" });
        setIngredientList([]);
      } else {
        console.error("Fejl ved oprettelse af opskrift:", response.statusText);
      }
    } catch (error) {
      console.error("Fejl ved oprettelse af opskrift:", error.message);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto p-6">
        <h1 className="text-4xl text-center font-bold mb-8">Opskrifter</h1>
        <form className="flex justify-center mb-8" onSubmit={handleSearch}>
          <input
            className="border px-4 py-2 rounded-l-lg w-3/4 focus:outline-none focus:border-blue-500"
            type="text"
            placeholder="Søg efter opskrift"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            className="bg-orange-400 text-white px-4 py-2 rounded-r-lg"
            type="submit"
          >
            Søg
          </button>
        </form>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {recipes
            .filter((recipe) => !recipe.isDeleted)
            .map((recipe, id) => (
              <div className="bg-white rounded-lg shadow-md p-4" key={id}>
                <h2 className="text-xl font-bold mb-2">{recipe.navn}</h2>
                <img
                  className="mx-auto w-full rounded-lg mb-2"
                  src={Mad}
                  alt=""
                />
                <h2 className="text-lg font-bold mb-1">Ingredienser:</h2>
                <ul className="list-disc pl-4">
                  {recipe.ingredienser.map((ingredient, id) => (
                    <li className="mb-1" key={id}>
                      <span className="font-medium">{ingredient.navn}:</span>{" "}
                      {ingredient.mængde}
                    </li>
                  ))}
                </ul>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg mt-2 mx-auto"
                  onClick={() => handleDeleteRecipe(recipe.id)}
                >
                  Slet opskrift
                </button>
              </div>
            ))}
        </div>

        <h2 className="text-4xl text-center font-bold mt-8 mb-4">
          Tilføj opskrift
        </h2>
        <form
          className="flex flex-col max-w-[600px] gap-[10px] mb-8 mx-auto"
          onSubmit={handleAddRecipe}
        >
          <input
            className="border px-4 py-2 rounded-l-lg focus:outline-none focus:border-blue-500"
            type="text"
            placeholder="Indtast opskriftens navn"
            value={newRecipeName}
            onChange={(e) => setNewRecipeName(e.target.value)}
          />
          <div className="flex">
            <input
              className="border px-4 py-2 rounded-l-lg focus:outline-none focus:border-blue-500"
              type="text"
              placeholder="Indtast ingrediens"
              value={newIngredient.navn}
              onChange={(e) =>
                setNewIngredient({ ...newIngredient, navn: e.target.value })
              }
            />
            <input
              className="border px-4 py-2 w-1/4 rounded-r-lg focus:outline-none focus:border-blue-500"
              type="text"
              placeholder="Mængde"
              value={newIngredient.mængde}
              onChange={(e) =>
                setNewIngredient({ ...newIngredient, mængde: e.target.value })
              }
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-r-lg"
              type="button"
              onClick={handleAddIngredient}
            >
              Tilføj ingrediens
            </button>
          </div>
          <ul className="list-disc pl-4 mt-2">
            {ingredientList.map((ingredient, id) => (
              <li className="mb-1" key={id}>
                <span className="font-medium">{ingredient.navn}:</span>{" "}
                {ingredient.mængde}
              </li>
            ))}
          </ul>
          <button
            className="w-[200px] bg-orange-400 text-white px-4 py-2 rounded-lg mt-2 mx-auto"
            type="submit"
          >
            Tilføj opskrift
          </button>
        </form>
      </div>
    </div>
  );
};

export default RecipeApp;
