import { PixelRatio } from 'react-native';

export const getFlagUrl = (countryName, cuisineData) => {
  const found = cuisineData.find(c => c.name === countryName);
  return found?.flag || null;
};

export const getFontSize = (size, windowWidth, isMobile, isTablet, isDesktop) => {
  const scale = windowWidth / 375;
  const newSize = size * scale;
  if (isDesktop) return size * 1.4;
  if (isTablet) return size * 1.2;
  return Math.min(size, Math.round(PixelRatio.roundToNearestPixel(newSize)));
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
