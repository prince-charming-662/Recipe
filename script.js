document.getElementById('search-recipes').addEventListener('click', fetchRecipes);

async function fetchRecipes() {
    const ingredientInput = document.getElementById('ingredient-input').value;
    const recipeResults = document.getElementById('recipe-results');
    recipeResults.innerHTML = ''; // Clear previous results

    if (!ingredientInput.trim()) {
        recipeResults.innerHTML = '<p>Please enter at least one ingredient.</p>';
        return;
    }

    try {
        const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=56fab633fa174c6585ec8db7e9cf54d3&includeIngredients=${encodeURIComponent(ingredientInput)}&number=5`);
        const data = await response.json();

        if (data.results.length === 0) {
            recipeResults.innerHTML = '<p>No recipes found. Try different ingredients.</p>';
            return;
        }

        for (const recipe of data.results) {
            // Fetch detailed information to get the sourceUrl
            const recipeDetailResponse = await fetch(`https://api.spoonacular.com/recipes/${recipe.id}/information?apiKey=56fab633fa174c6585ec8db7e9cf54d3`);
            const recipeDetail = await recipeDetailResponse.json();

            const recipeItem = document.createElement('div');
            recipeItem.classList.add('recipe-item');
            recipeItem.innerHTML = `
                <img src="${recipe.image}" alt="${recipe.title}">
                <h3>${recipe.title}</h3>
                <a href="${recipeDetail.sourceUrl}" target="_blank">View Recipe</a>
            `;
            recipeResults.appendChild(recipeItem);
        }
    } catch (error) {
        console.error('Error fetching recipes:', error);
        recipeResults.innerHTML = '<p>Sorry, something went wrong. Please try again later.</p>';
    }
}
