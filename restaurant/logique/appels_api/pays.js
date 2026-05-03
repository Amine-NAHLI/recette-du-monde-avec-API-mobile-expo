/** GET liste des zones culinaires (strArea) depuis TheMealDB. */
export const fetchCuisines = async () => {
  const res = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list');
  const data = await res.json();
  return data.meals ? data.meals.map((meal) => meal.strArea) : [];
};
