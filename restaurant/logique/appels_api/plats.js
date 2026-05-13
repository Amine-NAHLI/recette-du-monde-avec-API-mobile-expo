/** GET plats filtres par zone ; ajoute `area` sur chaque plat pour l UI. */
export const fetchDishesByCountry = async (area) => {
  try {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
    const data = await res.json();
    const dishes = data.meals || [];
    return dishes.map((dish) => ({ ...dish, area }));
  } catch (e) {
    return [];
  }
};

/** GET plats par catégorie. */
export const fetchByCategory = async (cat) => {
  try {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat}`);
    const data = await res.json();
    return data.meals || [];
  } catch (e) {
    return [];
  }
};
