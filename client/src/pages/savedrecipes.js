import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import axios from "axios";

export const SavedRecipes = () => {
  const [showform, setShowform] = useState(false);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [newRecipeName, setNewRecipeName] = useState("");
  const [newRecipeDescription, setNewRecipeDescription] = useState("");
  const [newRecipeImageUrl, setNewRecipeImageUrl] = useState("");
  const [newRecipeCookingTime, setNewRecipeCookingTime] = useState(0);
  const [editingRecipeId, setEditingRecipeId] = useState(null); // Track the ID of the recipe being edited
  const userID = useGetUserID();

  // Fetch saved recipes on component mount
  useEffect(() => {
    const fetchSavedRecipes = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/recipes/savedRecipes/${userID}`
        );
        setSavedRecipes(response.data.savedRecipes);
      } catch (err) {
        console.log(err);
      }
    };

    fetchSavedRecipes();
  }, [userID]);

  // Function to handle adding a new recipe
  

  // Function to handle editing a recipe
  const editRecipe = async (recipeID) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/recipes/edit/${recipeID}`,
        {
          name: newRecipeName,
          description: newRecipeDescription,
          imageUrl: newRecipeImageUrl,
          cookingTime: newRecipeCookingTime,
        }
      );
      const updatedRecipe = response.data.updatedRecipe;
      setSavedRecipes(savedRecipes.map(recipe => {
        if (recipe._id === recipeID) {
          return updatedRecipe;
        }
        return recipe;
      }));
      // Clear input fields after editing
      setNewRecipeName("");
      setNewRecipeDescription("");
      setNewRecipeImageUrl("");
      setNewRecipeCookingTime(0);
      setEditingRecipeId(null); // Reset editing state
      setShowform(false);
    } catch (err) {
      console.log(err);
    }
  };

  // Function to handle deleting a recipe
  const deleteRecipe = async (recipeID) => {
    if (window.confirm("Are you sure")) {
      try {
        await axios.delete(`${process.env.REACT_APP_SERVER_URL}/recipes/delete/${recipeID}`);
        setSavedRecipes(savedRecipes.filter(recipe => recipe._id !== recipeID));
      } catch (err) {
        console.error("Error deleting recipe:", err);
      }
    }
  };

  // Function to set editing state
  const startEditing = (recipe) => {
    setShowform(true);
    setEditingRecipeId(recipe._id);
    setNewRecipeName(recipe.name);
    setNewRecipeDescription(recipe.description);
    setNewRecipeImageUrl(recipe.imageUrl);
    setNewRecipeCookingTime(recipe.cookingTime);
  };

  return (
    <div>
      <h1>Saved Recipes</h1>

      {/* Form for adding/editing recipe */}
      {
        showform == true ?
        <form
        onSubmit={(e) => {
          e.preventDefault();
          if (editingRecipeId) {
            editRecipe(editingRecipeId);
          } 
        }}
      >
        <input
          type="text"
          placeholder="Recipe Name"
          value={newRecipeName}
          onChange={(e) => setNewRecipeName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Recipe Description"
          value={newRecipeDescription}
          onChange={(e) => setNewRecipeDescription(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Image URL"
          value={newRecipeImageUrl}
          onChange={(e) => setNewRecipeImageUrl(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Cooking Time (minutes)"
          value={newRecipeCookingTime}
          onChange={(e) =>
            setNewRecipeCookingTime(parseInt(e.target.value))
          }
          required
        />
        <button type="submit" className="btn btn-primary">
          {editingRecipeId ? "Update Recipe" : "Add Recipe"}
        </button>
        {editingRecipeId && (
          <button className="btn btn-success"
            type="button"
            onClick={() => {
              setEditingRecipeId(null);
              setNewRecipeName("");
              setNewRecipeDescription("");
              setNewRecipeImageUrl("");
              setNewRecipeCookingTime(0);
              setShowform(false)
            }}
          >
            Cancel
          </button>
        )}
        </form>
        :<></>
      }

      {/* Display saved recipes */}
      {/* <ul>
        {savedRecipes.map((recipe) => (
          <li key={recipe._id}>
            <div>
              <h2>{recipe.name}</h2>
              {!editingRecipeId || editingRecipeId !== recipe._id ? (
                <button onClick={() => startEditing(recipe)}>Edit</button>
              ) : null}
              <button onClick={() => deleteRecipe(recipe._id)}>Delete</button>
            </div>
            <p>{recipe.description}</p>
            <img src={recipe.imageUrl} alt={recipe.name} />
            <p>Cooking Time: {recipe.cookingTime} minutes</p>
          </li>
        ))}
      </ul> */}

      <div className="container">
        
        <div style={{display:"flex", flexWrap:"wrap", gap:'15px'}}>
          {
            savedRecipes.map((recipe, idx) => (
              <div key={idx} className="card" style={{width: "300px"}}>
                <img style={{height:"200px"}} src={recipe.imageUrl} alt={recipe.name} className="card-img-top"/>
                <div className="card-body">
                  <h5 className="card-title">{recipe.name}</h5>
                  <p className="card-text">{recipe.instructions}</p>
                  <p>Cooking Time: {recipe.cookingTime} minutes</p>
                  {
                    !editingRecipeId || editingRecipeId !== recipe._id ? (
                      <button className="btn btn-info" onClick={() => startEditing(recipe)}>Edit</button>
                    ) : null
                  }
                  <button className="btn btn-danger"
                  onClick={() => deleteRecipe(recipe._id)}>Delete</button>
                </div>
              </div>
            ))
          }

        </div>
      </div>
    </div>
  );
};
export default SavedRecipes; 