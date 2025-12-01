
import React, { useEffect, useRef, useMemo, memo } from 'react';
import { View, Animated, StyleSheet, Dimensions, Platform } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

/**
 * GlowWrapper - Reusable animated glow effect component
 * 
 * Props:
 * - children: Component to wrap
 * - isDarkMode: boolean for theme
 * - borderRadius: number (default: 30)
 * - showStars: boolean (default: true)
 * - starCount: number (default: 12)
 * - showShinePatches: boolean (default: true)
 * - containerStyle: additional styles for container
 * - intensity: 'low' | 'medium' | 'high' (default: 'medium')
 * - disabled: boolean (default: false) - disable animations for performance
 * - glowColors: array of two colors (default: ['#21B7FF', '#0084F8'])
 */

const GlowWrapper = memo(({
  children,
  isDarkMode = false,
  borderRadius = 30,
  showStars = true,
  starCount = 100,
  showShinePatches = true,
  containerStyle = {},
  intensity = 'medium',
  disabled = false,
  glowColors = ['#21B7FF', '#0084F8'], // Default blue gradient
}) => {
  // Animation refs
  const glowAnim = useRef(new Animated.Value(0)).current;
  const shine1 = useRef(new Animated.Value(0)).current;
  const shine2 = useRef(new Animated.Value(0)).current;
  const shine3 = useRef(new Animated.Value(0)).current;
  const isMounted = useRef(true);
  const animationsRef = useRef([]);

  // Create star refs at the top level
  const starsRef = useRef(null);
  
  // Initialize stars only once
  if (!starsRef.current) {
    const validStarCount = Math.min(Math.max(1, starCount || 12), 20);
    starsRef.current = Array.from({ length: validStarCount }, () => ({
      x: new Animated.Value(Math.random() * (screenWidth * 0.3)),
      y: new Animated.Value(20 + Math.random() * 80),
      opacity: new Animated.Value(0),
      scale: new Animated.Value(0.5),
    }));
  }

  const stars = showStars && !disabled ? starsRef.current : [];

  // Convert hex to rgba
  const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  // Intensity configs
  const intensityConfig = useMemo(() => {
    const configs = {
      low: {
        glowDuration: 4000,
        shadowOpacity: [0.2, 0.4],
        starOpacity: 0.6,
        borderOpacity: [0.3, 1],
      },
      medium: {
        glowDuration: 3000,
        shadowOpacity: [0.3, 0.7],
        starOpacity: 0.8,
        borderOpacity: [0.4, 1],
      },
      high: {
        glowDuration: 2000,
        shadowOpacity: [0.4, 1],
        starOpacity: 1,
        borderOpacity: [0.5, 1],
      },
    };
    return configs[intensity] || configs.medium;
  }, [intensity]);

  // Generate star colors based on glowColors
  const starColors = useMemo(() => {
    const [color1, color2] = glowColors;
    // Create variations of the two main colors
    return [
      color1, color2, color1, color2,
      color1, color2, color1, color2,
      color1, color2, color1, color2
    ];
  }, [glowColors]);

  useEffect(() => {
    isMounted.current = true;
    animationsRef.current = [];
    
    if (disabled) return;

    try {
      // Border glow animation
      const glowAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: intensityConfig.glowDuration,
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: false,
          }),
        ])
      );
      animationsRef.current.push(glowAnimation);

      // Shine patches animations
      if (showShinePatches) {
        const shine1Animation = Animated.loop(
          Animated.sequence([
            Animated.timing(shine1, {
              toValue: 1,
              duration: 3000,
              useNativeDriver: true,
            }),
            Animated.timing(shine1, {
              toValue: 0,
              duration: 3000,
              useNativeDriver: true,
            }),
          ])
        );

        const shine2Animation = Animated.loop(
          Animated.sequence([
            Animated.delay(1000),
            Animated.timing(shine2, {
              toValue: 1,
              duration: 3500,
              useNativeDriver: true,
            }),
            Animated.timing(shine2, {
              toValue: 0,
              duration: 3500,
              useNativeDriver: true,
            }),
          ])
        );

        const shine3Animation = Animated.loop(
          Animated.sequence([
            Animated.delay(2000),
            Animated.timing(shine3, {
              toValue: 1,
              duration: 4000,
              useNativeDriver: true,
            }),
            Animated.timing(shine3, {
              toValue: 0,
              duration: 4000,
              useNativeDriver: true,
            }),
          ])
        );

        animationsRef.current.push(shine1Animation, shine2Animation, shine3Animation);
      }

      // Star animations
      if (showStars && Array.isArray(stars) && stars.length > 0) {
        stars.forEach((star, i) => {
          if (!star || !star.x || !star.y || !star.opacity || !star.scale) return;
          
          try {
            const delay = i * 800;
            const duration = 2000 + (i % 3) * 500;
            const moveDistance = 3 + (i % 5);
            const startX = star.x._value || 0;
            const startY = star.y._value || 0;

            const starAnimation = Animated.loop(
              Animated.sequence([
                Animated.delay(delay),
                Animated.parallel([
                  Animated.timing(star.x, {
                    toValue: startX + moveDistance,
                    duration: duration,
                    useNativeDriver: true,
                  }),
                  Animated.timing(star.y, {
                    toValue: startY - moveDistance,
                    duration: duration,
                    useNativeDriver: true,
                  }),
                  Animated.timing(star.opacity, {
                    toValue: intensityConfig.starOpacity,
                    duration: duration / 2,
                    useNativeDriver: true,
                  }),
                  Animated.sequence([
                    Animated.timing(star.scale, {
                      toValue: 1.5,
                      duration: duration / 3,
                      useNativeDriver: true,
                    }),
                    Animated.timing(star.scale, {
                      toValue: 1.2,
                      duration: duration / 4,
                      useNativeDriver: true,
                    }),
                    Animated.timing(star.scale, {
                      toValue: 1.4,
                      duration: duration / 3,
                      useNativeDriver: true,
                    }),
                  ]),
                ]),
                Animated.parallel([
                  Animated.timing(star.x, {
                    toValue: startX,
                    duration: duration,
                    useNativeDriver: true,
                  }),
                  Animated.timing(star.y, {
                    toValue: startY,
                    duration: duration,
                    useNativeDriver: true,
                  }),
                  Animated.timing(star.opacity, {
                    toValue: 0,
                    duration: duration / 2,
                    useNativeDriver: true,
                  }),
                  Animated.timing(star.scale, {
                    toValue: 0.5,
                    duration: duration / 2,
                    useNativeDriver: true,
                  }),
                ]),
              ])
            );

            animationsRef.current.push(starAnimation);
          } catch (error) {
            console.warn('GlowWrapper: Error creating star animation', error);
          }
        });
      }

      // Start all animations if component is still mounted
      if (isMounted.current && animationsRef.current.length > 0) {
        animationsRef.current.forEach(anim => {
          try {
            anim.start();
          } catch (error) {
            console.warn('GlowWrapper: Error starting animation', error);
          }
        });
      }
    } catch (error) {
      console.warn('GlowWrapper: Animation setup error:', error);
    }

    // Cleanup function
    return () => {
      isMounted.current = false;
      if (animationsRef.current && animationsRef.current.length > 0) {
        animationsRef.current.forEach(anim => {
          try {
            if (anim && typeof anim.stop === 'function') {
              anim.stop();
            }
          } catch (error) {
            // Silently handle cleanup errors
          }
        });
      }
      animationsRef.current = [];
    };
  }, [showStars, showShinePatches, disabled, intensityConfig.glowDuration, intensityConfig.starOpacity]);

  // Interpolations with custom colors
  const borderColor = useMemo(() => {
    const [color1, color2] = glowColors;
    
    if (disabled) {
      return hexToRgba(color1, isDarkMode ? 0.4 : 0.3);
    }
    
    try {
      return glowAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [
          hexToRgba(color1, isDarkMode ? intensityConfig.borderOpacity[0] : intensityConfig.borderOpacity[0] * 0.7),
          hexToRgba(color2, isDarkMode ? intensityConfig.borderOpacity[1] : intensityConfig.borderOpacity[1] * 0.8),
          hexToRgba(color1, isDarkMode ? intensityConfig.borderOpacity[0] : intensityConfig.borderOpacity[0] * 0.7),
        ],
      });
    } catch (error) {
      return hexToRgba(color1, isDarkMode ? 0.4 : 0.3);
    }
  }, [disabled, isDarkMode, glowAnim, intensityConfig.borderOpacity, glowColors]);

  const shadowOpacity = useMemo(() => {
    if (disabled) return 0.3;
    
    try {
      return glowAnim.interpolate({
        inputRange: [0, 1],
        outputRange: intensityConfig.shadowOpacity,
      });
    } catch (error) {
      return 0.3;
    }
  }, [disabled, glowAnim, intensityConfig.shadowOpacity]);

  const shadowColor = glowColors[0]; // Use first color for shadow

  const starSizes = useMemo(() => [5, 4, 6, 4, 5, 6, 5, 6, 5, 4, 6, 5], []);

  return (
    <Animated.View
      style={[
        {
          borderRadius: borderRadius,
          borderWidth: 3,
          borderColor: borderColor,
          shadowColor: shadowColor,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: shadowOpacity,
          shadowRadius: 15,
        //   elevation: Platform.OS === 'android' ? 5 : 0,
          backgroundColor: hexToRgba(glowColors[0], isDarkMode ? 0.05 : 0.03),
        },
        containerStyle,
      ]}
      removeClippedSubviews={true}
    >
      {/* Glass reflection overlay - Top gradient */}
      <View
        style={[
          styles.glassOverlay,
          {
            height: '40%',
            borderTopLeftRadius: Math.max(0, borderRadius - 2),
            borderTopRightRadius: Math.max(0, borderRadius - 2),
            backgroundColor: isDarkMode
              ? 'rgba(255, 255, 255, 0.08)'
              : 'rgba(255, 255, 255, 0.25)',
          }
        ]}
        pointerEvents="none"
      />
      
      {/* Glass border overlay */}
      <View
        style={[
          styles.glassBorder,
          {
            borderRadius: Math.max(0, borderRadius - 2),
            borderColor: isDarkMode
              ? 'rgba(255, 255, 255, 0.1)'
              : 'rgba(255, 255, 255, 0.3)',
          }
        ]}
        pointerEvents="none"
      />

      {/* Shine Patches with custom colors */}
      {showShinePatches && !disabled && (
        <>
          <Animated.View
            style={[
              styles.shinePatch,
              {
                top: 30,
                left: 20,
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: hexToRgba(glowColors[0], isDarkMode ? 0.15 : 0.1),
                opacity: shine1,
              }
            ]}
            pointerEvents="none"
          />
          <Animated.View
            style={[
              styles.shinePatch,
              {
                top: 80,
                right: 15,
                width: 70,
                height: 70,
                borderRadius: 35,
                backgroundColor: hexToRgba(glowColors[1], isDarkMode ? 0.12 : 0.08),
                opacity: shine2,
              }
            ]}
            pointerEvents="none"
          />
          <Animated.View
            style={[
              styles.shinePatch,
              {
                bottom: 40,
                left: '30%',
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: hexToRgba(glowColors[0], isDarkMode ? 0.1 : 0.06),
                opacity: shine3,
              }
            ]}
            pointerEvents="none"
          />
        </>
      )}

      {/* Animated Stars with custom colors */}
      {showStars && !disabled && Array.isArray(stars) && stars.length > 0 && stars.map((star, i) => {
        if (!star || !star.opacity || !star.x || !star.y || !star.scale) return null;
        
        return (
          <Animated.View
            key={`star-${i}`}
            style={[
              styles.star,
              {
                opacity: star.opacity,
                transform: [
                  { translateX: star.x },
                  { translateY: star.y },
                  { scale: star.scale },
                ],
              }
            ]}
            pointerEvents="none"
          >
            <Animated.Text 
              style={{ 
                fontSize: starSizes[i % starSizes.length], 
                color: starColors[i % starColors.length],
                textShadowColor: hexToRgba(glowColors[0], 0.5),
                textShadowOffset: { width: 0, height: 0 },
                textShadowRadius: 4,
              }}
            >
              ✦
            </Animated.Text>
          </Animated.View>
        );
      })}

      {/* Content */}
      <View style={styles.content}>
        {children}
      </View>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  glassOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 0,
  },
  glassBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 1,
    zIndex: 0,
  },
  shinePatch: {
    position: 'absolute',
    zIndex: 1,
  },
  star: {
    position: 'absolute',
    zIndex: 15,
  },
  content: {
    zIndex: 10,
  },
});

GlowWrapper.displayName = 'GlowWrapper';

// export default ;
export default React.memo(GlowWrapper);


