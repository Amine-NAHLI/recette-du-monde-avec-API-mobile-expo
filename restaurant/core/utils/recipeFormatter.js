export const buildRecipeDetails = (meal, id) => {
  if (!meal) return null;

  const ingredients = [];
  for (let i = 1; i <= 20; i += 1) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`] || '';
    if (ingredient) {
      ingredients.push(`${measure} ${ingredient}`.trim());
    }
  }

  return {
    idMeal: id,
    name: meal.strMeal,
    ingredients,
    instructions: (meal.strInstructions || '')
      .split('\r\n')
      .filter((step) => step.trim().length > 10),
    url: meal.strMealThumb,
  };
};
