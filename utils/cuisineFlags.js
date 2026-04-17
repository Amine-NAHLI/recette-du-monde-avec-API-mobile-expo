/**
 * Mapping des nationalités (TheMealDB) vers leurs emojis drapeaux.
 * Inclut toutes les régions actuellement disponibles dans l'API.
 */
export const CUISINE_FLAGS = {
  American: '🇺🇸',
  British: '🇬🇧',
  Canadian: '🇨🇦',
  Chinese: '🇨🇳',
  Croatian: '🇭🇷',
  Dutch: '🇳🇱',
  Egyptian: '🇪🇬',
  Filipino: '🇵🇭',
  French: '🇫🇷',
  Greek: '🇬🇷',
  Indian: '🇮🇳',
  Irish: '🇮🇪',
  Italian: '🇮🇹',
  Jamaican: '🇯🇲',
  Japanese: '🇯🇵',
  Kenyan: '🇰🇪',
  Malaysian: '🇲🇾',
  Mexican: '🇲🇽',
  Moroccan: '🇲🇦',
  Norwegian: '🇳🇴',
  Polish: '🇵🇱',
  Portuguese: '🇵🇹',
  Russian: '🇷🇺',
  Spanish: '🇪🇸',
  Thai: '🇹🇭',
  Tunisian: '🇹🇳',
  Turkish: '🇹🇷',
  Ukrainian: '🇺🇦',
  Vietnamese: '🇻🇳',
  Algerian: '🇩🇿',
  Argentinian: '🇦🇷',
  'New Zealander': '🇳🇿',
  Unknown: '❓'
};

/**
 * Retourne le drapeau correspondant à la cuisine ou un fallback.
 */
export const getCuisineEmoji = (cuisineName) => {
  return CUISINE_FLAGS[cuisineName] || '🌍';
};
