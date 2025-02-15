import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

export const SavedRecipes = () => {
  const [showform, setShowform] = useState(false);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [newRecipeName, setNewRecipeName] = useState("");
  const [newRecipeImageUrl, setNewRecipeImageUrl] = useState("");
  const [newRecipeCookingTime, setNewRecipeCookingTime] = useState(0);
  const [newRecipeIngredients,setNewRecipeIngredients]=useState([]);
  const [editingRecipeId, setEditingRecipeId] = useState(null); 
  const userID = useGetUserID();
  const [cookies] = useCookies(["access_token"]);
  
  
  const setNewIng = (e, idx) => {
    const { value } = e.target;
    const ingredients = [...newRecipeIngredients];
    ingredients[idx] = value;
    setNewRecipeIngredients(ingredients);
  }

  const addNewIng = () => {
    const ingredients = [...newRecipeIngredients];
    ingredients.push("");
    setNewRecipeIngredients(ingredients);
  }

  const fetchSavedRecipes = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/recipes/savedRecipes/${userID}`
      );
      setSavedRecipes(response.data.savedRecipes);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
  
    fetchSavedRecipes();
  }, [userID]);
   
  const editRecipe = async (recipeID) => {""
    try {
      const response = await axios.put(
        `http://localhost:3001/recipes/edit/${recipeID}`,
        {
          name: newRecipeName,
          ingredients:newRecipeIngredients,
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
      
      setNewRecipeName("");
      setNewRecipeIngredients([]);
      setNewRecipeImageUrl("");
      setNewRecipeCookingTime(0);
      setEditingRecipeId(null); 
      setShowform(false);
    } catch (err) {
      console.log(err);
    }
  };

  
  const deleteRecipe = async (recipeID) => {
    if (window.confirm("Are you sure")) {
      try {
        // await axios.delete(`http://localhost:3001/recipes/delete/${recipeID}`);
        // setSavedRecipes(savedRecipes.filter(recipe => recipe._id !== recipeID));

        await axios.delete(`http://localhost:3001/recipes/${userID}/savedRecipes/${recipeID}`);
        fetchSavedRecipes();

      } catch (err) {
        console.error("Error deleting recipe:", err);
      }
    }
  };

  
  const startEditing = (recipe) => {
    console.log(recipe.ingredients);
    setShowform(true);
    setEditingRecipeId(recipe._id);
    setNewRecipeName(recipe.name);
    setNewRecipeIngredients(recipe.ingredients);
    setNewRecipeImageUrl(recipe.imageUrl);
    setNewRecipeCookingTime(recipe.cookingTime);
    
  };

  return (
    <div>
      <h1>Saved Recip""es</h1>

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

          <h5>Ingredients</h5>
        {
          newRecipeIngredients.map((val, idx) => (
            <input
              key={idx}
              type="text"
              placeholder="Ingredients"
              value={val}
              onChange={(event) => setNewIng(event, idx)}
              required
            />
          ))
        }

        <button onClick={addNewIng} className="btn btn-info" >add ing</button>
        <button type="submit" className="btn btn-primary">
          {editingRecipeId ? "Update Recipe" : "Add Recipe"}
        </button>
        {editingRecipeId && (
          <button className="btn btn-success"
            type="button"
            onClick={() => {
              setEditingRecipeId(null);
              setNewRecipeName("");
              setNewRecipeImageUrl("");
              setNewRecipeCookingTime(0);
              setNewRecipeIngredients("");
              setShowform(false)
            }}
          >
            Cancel
          </button>
        )}
        </form>
        :<></>
      }

      <div className="container">
        
        <div style={{display:"flex", flexWrap:"wrap", gap:'15px'}}>
          {
            savedRecipes.map((recipe, idx) => (
              <div key={idx} className="card" style={{width: "300px"}}>
                <img style={{height:"200px"}} src={recipe.imageUrl} alt={recipe.name} className="card-img-top"/>
                <div className="card-body">
                  <h5 className="card-title">{recipe.name}</h5>
                  <p className="card-text">{recipe.Ingredients}</p>
                  <p className="card-text">{recipe.instructions}</p>
                  <p>Cooking Time: {recipe.cookingTime} minutes</p>
                  {
                    !editingRecipeId || editingRecipeId !== recipe._id ? (
                      <button className="btn btn-success" onClick={() => startEditing(recipe)}>Edit</button>
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