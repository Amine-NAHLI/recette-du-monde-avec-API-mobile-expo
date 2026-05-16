/** GET liste des zones culinaires (strArea) depuis TheMealDB. */
export const fetchCuisines = async () => {
  try {
    const res = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list');
    if (!res.ok) throw new Error("Erreur réseau");
    const data = await res.json();
    return data.meals ? data.meals.map((meal) => meal.strArea) : [];
  } catch (error) {
    console.error("fetchCuisines error:", error);
    return [];
  }
};

/** GET liste des catégories depuis TheMealDB. */
export const fetchCategories = async () => {
  try {
    const res = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?c=list');
    if (!res.ok) throw new Error("Erreur réseau");
    const data = await res.json();
    return data.meals ? data.meals.map((m) => m.strCategory) : [];
  } catch (error) {
    console.error("fetchCategories error:", error);
    return [];
  }
};
