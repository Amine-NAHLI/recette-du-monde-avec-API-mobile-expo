import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import HeroSection from './home/HeroSection';
import PrestigeRegions from './home/PrestigeRegions';
import StatsSection from './home/StatsSection';
import { styles } from './home/styles';

const HomeView = ({ isMobile, setPage, areasCount, recipesCount }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleImage = useRef(new Animated.Value(1.1)).current;

  /**
   * [SECTION: CYCLE DE VIE (useEffect)]
   * Déclenchement des animations dès que le composant est monté.
   */
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: false,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        useNativeDriver: false,
      }),
      Animated.timing(scaleImage, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: false,
      })
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <HeroSection scaleImage={scaleImage} setPage={setPage} />
      <PrestigeRegions setPage={setPage} />
      <StatsSection areasCount={areasCount} recipesCount={recipesCount} />
    </Animated.View>
  );
};

export default HomeView;

