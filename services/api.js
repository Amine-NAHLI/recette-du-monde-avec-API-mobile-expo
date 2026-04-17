export const fetchCuisines = async () => {
    const res = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list');
    const data = await res.json();
    return data.meals ? data.meals.map(m => m.strArea) : [];
};

export const fetchDishesByCountry = async (area) => {
    try {
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
        const data = await res.json();
        const dishes = data.meals || [];
        return dishes.map(d => ({ ...d, area }));
    } catch (e) {
        return [];
    }
};

export const fetchRecipeById = async (id) => {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    const data = await res.json();
    return data.meals?.[0];
};
