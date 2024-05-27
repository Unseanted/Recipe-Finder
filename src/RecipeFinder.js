import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';

function RecipeFinder() {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [reviews, setReviews] = useState({});

  const apiKey = '856905dd30dc49479b230bc2dd34e2ce';

  const searchRecipes = async () => {
    try {
      const response = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?query=${query}&apiKey=${apiKey}&addRecipeInformation=true`);
      setRecipes(response.data.results);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  const addReview = (recipeId, review) => {
    setReviews(prevReviews => ({
      ...prevReviews,
      [recipeId]: [...(prevReviews[recipeId] || []), review]
    }));
  };

  const handleCardClick = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleCloseModal = () => {
    setSelectedRecipe(null);
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Food Recipe Finder</h1>
      <div className="input-group mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search for recipes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="input-group-append">
          <button onClick={searchRecipes} className="btn btn-primary">Search</button>
        </div>
      </div>
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

      {selectedRecipe && (
        <Modal show={true} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedRecipe.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <img src={selectedRecipe.image || 'https://via.placeholder.com/150'} className="img-fluid mb-3" alt={selectedRecipe.title} />
            <p dangerouslySetInnerHTML={{ __html: selectedRecipe.summary }}></p>
            <a href={selectedRecipe.sourceUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">View Full Recipe</a>
            <RecipeReviews recipeId={selectedRecipe.id} reviews={reviews[selectedRecipe.id]} addReview={addReview} />
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

function RecipeReviews({ recipeId, reviews, addReview }) {
  const [newReview, setNewReview] = useState('');

  const handleAddReview = () => {
    if (newReview.trim()) {
      addReview(recipeId, newReview);
      setNewReview('');
    }
  };

  return (
    <div>
      <h6>Reviews:</h6>
      <ul className="list-unstyled">
        {reviews && reviews.map((review, index) => (
          <li key={index} className="mb-2">
            <div className="border p-2">{review}</div>
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
  );
}

export default RecipeFinder;
