import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Import the CSS file
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { Modal, Button } from 'react-bootstrap'; // Import Bootstrap Modal components

function RecipeFinder() {
  const [query, setQuery] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [view, setView] = useState('main'); // State variable to manage the view

  const apiKey = '856905dd30dc49479b230bc2dd34e2ce';

  const searchRecipes = async () => {
    try {
      const response = await axios.get(`https://api.spoonacular.com/recipes/complexSearch`, {
        params: {
          query,
          includeIngredients: ingredients,
          cuisine,
          apiKey,
          addRecipeInformation: true
        }
      });
      setRecipes(response.data.results);
      setView('results'); // Switch to the results view
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  const fetchReviews = async (recipeId) => {
    try {
      const response = await axios.get(`http://localhost:5000/reviews/${recipeId}`);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const addReview = async (recipeId, review) => {
    try {
      const response = await axios.post('http://localhost:5000/reviews', { recipeId, review });
      setReviews(prevReviews => [...prevReviews, response.data]);
    } catch (error) {
      console.error('Error adding review:', error);
    }
  };

  const handleCardClick = (recipe) => {
    setSelectedRecipe(recipe);
    fetchReviews(recipe.id);
  };

  const handleCloseModal = () => {
    setSelectedRecipe(null);
    setReviews([]);
  };

  const handleAddReview = () => {
    if (newReview.trim()) {
      addReview(selectedRecipe.id, newReview);
      setNewReview('');
    }
  };

  const handleBack = () => {
    setView('main'); // Switch back to the main view
    setRecipes([]); // Clear the recipes
    setQuery(''); // Clear the query
    setIngredients(''); // Clear the ingredients
    setCuisine(''); // Clear the cuisine
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Recipe Finder</h1>

      {view === 'main' && (
        <div className="input-group mb-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search for recipes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <input
            type="text"
            className="form-control"
            placeholder="Ingredients (comma separated)"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
          />
          <input
            type="text"
            className="form-control"
            placeholder="Cuisine"
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
          />
          <div className="input-group-append">
            <button onClick={searchRecipes} className="btn btn-primary">Search</button>
          </div>
        </div>
      )}

      {view === 'results' && (
        <>
          <button onClick={handleBack} className="btn btn-secondary mb-4">Back</button>
          <div className="row">
            {recipes.map(recipe => (
              <div className="col-md-4 mb-4" key={recipe.id}>
                <div className="card" onClick={() => handleCardClick(recipe)}>
                  <img src={recipe.image || 'https://via.placeholder.com/150'} className="card-img-top" alt={recipe.title} />
                  <div className="card-body">
                    <h5 className="card-title">{recipe.title}</h5>
                    <p className="card-text">
                      {recipe.summary.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 150)}...
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {selectedRecipe && (
        <Modal show={true} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedRecipe.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <img src={selectedRecipe.image || 'https://via.placeholder.com/150'} className="img-fluid mb-3" alt={selectedRecipe.title} />
            <p dangerouslySetInnerHTML={{ __html: selectedRecipe.summary }}></p>
            <a href={selectedRecipe.sourceUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">View Full Recipe</a>
            <div className="mt-4">
              <h6>Reviews:</h6>
              <ul className="list-unstyled">
                {reviews.map((review, index) => (
                  <li key={index} className="mb-2">
                    <div className="border p-2">{review.review}</div>
                  </li>
                ))}
              </ul>
              <div className="input-group mt-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Add a review..."
                  value={newReview}
                  onChange={(e) => setNewReview(e.target.value)}
                />
                <div className="input-group-append">
                  <button onClick={handleAddReview} className="btn btn-secondary">Add Review</button>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      <footer className="mt-5">
        <p className="text-center">
          We hope you find that desired recipe that soothes the perfect moment laced with memories.
        </p>
      </footer>
    </div>
  );
}

export default RecipeFinder;
