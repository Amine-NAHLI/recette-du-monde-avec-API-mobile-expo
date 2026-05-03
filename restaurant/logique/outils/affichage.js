/**
 * Utilitaires responsive et affichage : drapeaux, grille, espacements latéraux.
 */
export const getFlagUrl = (countryName, cuisineData) => {
  const found = cuisineData.find(c => c.name === countryName);
  return found?.flag || null;
};

export const getCols = (isMobile, isTablet) => (isMobile ? 1 : isTablet ? 2 : 3);
export const getPadding = (isMobile) => (isMobile ? 24 : 40);

export const getCardWidth = (windowWidth, isMobile, isTablet) => {
  const pad = getPadding(isMobile);
  const cols = getCols(isMobile, isTablet);
  const gap = 24;
  const contentWidth = Math.min(windowWidth, 1200);
  return (contentWidth - pad * 2 - (cols - 1) * gap) / cols;
};
