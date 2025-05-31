// client/screens/AgentSelectionScreen.js
import React, { useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Image,
  Animated, Dimensions, StatusBar, SafeAreaView, Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Can be used for background or vibrant accents
import { BlurView } from 'expo-blur'; // Key for glassmorphism

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.8;
const CARD_HEIGHT = height * 0.65; // Make cards taller
const SPACING = width * 0.05;

// Vibrant Glassmorphism Theme
const themeColors = {
  pageBackgroundStart: '#0D101F', // Dark space blue
  pageBackgroundEnd: '#171A31',   // Slightly lighter dark blue
  cardTint: 'dark', // 'light', 'dark', or 'default' for BlurView
  cardIntensity: 80, // Blur intensity (0-100)
  cardBorderColorBase: 'rgba(255, 255, 255, 0.1)', // Subtle white border for glass edge
  textPrimary: '#FFFFFF',
  textSecondary: '#AEB9D6', // Light, slightly desaturated blue-gray
  dotActive: '#FFFFFF',
  dotInactive: 'rgba(255, 255, 255, 0.3)',
};

export default function AgentSelectionScreen({ navigation }) {
  const scrollX = useRef(new Animated.Value(0)).current;

  const agents = [
    {
      id: 'TkvOiYUSHLZyVnFgBnJr',
      name: 'Support Agent',
      tagline: 'Technical solutions, simplified.',
      description: 'Expert technical support and customer assistance.',
      accentColor: '#00CFE8', // Electric Cyan
      image: require('../assets/agents/support-agent.png'),
      icon: '💻'
    },
    {
      id: 'oYxMlLkXbNtZDS3zCikc',
      name: 'Mindfulness Coach',
      tagline: 'Find peace within yourself.',
      description: 'Guided meditation and stress reduction techniques.',
      accentColor: '#28A745', // Vibrant Green
      image: require('../assets/agents/mindfulness-coach.png'),
      icon: '🧘‍♀️'
    },
    {
      id: 'obmk35jYzsvmFDtgiIfk',
      name: 'Game Master',
      tagline: 'Embark on an epic adventure.',
      description: 'Your companion through digital realms and quests.',
      accentColor: '#FFD700', // Gold/Yellow
      image: require('../assets/agents/game-master.png'),
      icon: '🎮'
    },
    {
      id: 'USji2hEbVPYimRif3His',
      name: 'Travel Guide',
      tagline: 'Discover the world with me.',
      description: 'Explore destinations and create memorable journeys.',
      accentColor: '#FF6B6B', // Vibrant Coral
      image: require('../assets/agents/travel-guide.png'),
      icon: '✈️'
    }
  ];

  return (
    <LinearGradient
      colors={[themeColors.pageBackgroundStart, themeColors.pageBackgroundEnd]}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" />

        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Choose Your AI Assistant</Text>
          <Text style={styles.headerSubtitle}>Select a companion for your journey</Text>
        </View>

        <Animated.FlatList
          data={agents}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.flatListContent}
          snapToInterval={CARD_WIDTH + SPACING}
          decelerationRate="fast"
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: true }
          )}
          renderItem={({ item, index }) => {
            const cardAndSpacing = CARD_WIDTH + SPACING;
            const inputRange = [
              (index - 1) * cardAndSpacing,
              index * cardAndSpacing,
              (index + 1) * cardAndSpacing,
            ];

            const scale = scrollX.interpolate({
              inputRange,
              outputRange: [0.88, 1, 0.88],
              extrapolate: 'clamp',
            });
            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.5, 1, 0.5],
              extrapolate: 'clamp',
            });

            const agentAccent = item.accentColor || themeColors.accentPrimary;

            return (
              <Animated.View
                style={[styles.cardContainer, { transform: [{ scale }], opacity }]}
              >
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => navigation.navigate('Conversation', { agent: item })}
                  style={styles.cardTouchable}
                >
                  <BlurView
                    tint={themeColors.cardTint}
                    intensity={themeColors.cardIntensity}
                    style={[styles.cardBlurView, {borderColor: agentAccent}]}
                  >
                    <View style={styles.cardContent}>
                       <View style={[styles.iconContainer, {backgroundColor: `${agentAccent}33` /* Accent with low opacity */}]}>
                         <Text style={[styles.agentIcon, {color: agentAccent}]}>{item.icon}</Text>
                       </View>

                      <Image
                        source={item.image}
                        style={styles.agentImage}
                        resizeMode="contain"
                      />
                      <View style={styles.textContainer}>
                        <Text style={styles.agentName}>{item.name}</Text>
                        <Text style={styles.agentTagline}>{item.tagline}</Text>
                      </View>
                      <View style={styles.buttonOuterContainer}>
                        <LinearGradient
                            colors={[`${agentAccent}B3`, `${agentAccent}E6`]} // Gradient for button based on agent accent
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.selectButtonGradient}
                        >
                            <View style={styles.selectButton}>
                                <Text style={styles.selectButtonText}>Select Agent</Text>
                            </View>
                        </LinearGradient>
                      </View>
                    </View>
                  </BlurView>
                </TouchableOpacity>
              </Animated.View>
            );
          }}
        />

        <View style={styles.paginationContainer}>
          {agents.map((item, index) => { // Use item to get accent color
            const cardAndSpacing = CARD_WIDTH + SPACING;
            const inputRange = [
              (index - 1) * cardAndSpacing,
              index * cardAndSpacing,
              (index + 1) * cardAndSpacing,
            ];
            const dotScale = scrollX.interpolate({
              inputRange,
              outputRange: [0.8, 1.2, 0.8],
              extrapolate: 'clamp',
            });
            const dotOpacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.5, 1, 0.5],
              extrapolate: 'clamp',
            });

            return (
              <Animated.View
                key={index.toString()}
                style={[
                  styles.dot,
                  {
                    transform: [{ scale: dotScale }],
                    opacity: dotOpacity,
                    backgroundColor: item.accentColor || themeColors.dotActive, // Use agent accent for active dot
                  },
                ]}
              />
            );
          })}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 20 : 50,
    paddingBottom: 30,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: themeColors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: themeColors.textSecondary,
    textAlign: 'center',
    fontWeight: '300',
  },
  flatListContent: {
    paddingVertical: 20,
    alignItems: 'center', // Important for centering the FlatList items if content width < FlatList width
    paddingHorizontal: (Dimensions.get('window').width - CARD_WIDTH) / 2,
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginHorizontal: SPACING / 2,
    // Shadow for depth, will be on the BlurView itself if possible or this container
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    // Elevation for Android is tricky with BlurView, border might be better
  },
  cardTouchable: {
    flex: 1,
    borderRadius: 24, // Rounded corners for the glass card
    overflow: 'hidden', // Crucial for BlurView and border radius
  },
  cardBlurView: {
    flex: 1,
    borderRadius: 24, // Match touchable
    borderWidth: 1.5, // Border for the glass edge effect
    // borderColor is set dynamically in renderItem
    // backgroundColor: 'rgba(255, 255, 255, 0.15)', // Fallback if blur is not enough, or part of the glass effect
  },
  cardContent: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-between', // Distribute content nicely
  },
  iconContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    // backgroundColor and color set dynamically
  },
  agentIcon: {
    fontSize: 22,
  },
  agentImage: {
    width: CARD_WIDTH * 0.6,
    height: CARD_WIDTH * 0.6,
    maxHeight: 200,
    marginTop: 30, // Give space from top/icon
    marginBottom: 20,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  agentName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: themeColors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  agentTagline: {
    fontSize: 15,
    fontWeight: '400',
    color: themeColors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonOuterContainer: { // Container for gradient button
    width: '90%',
    marginTop: 'auto',
    paddingTop: 10,
  },
  selectButtonGradient: {
    borderRadius: 12, // Match button's border radius
    shadowColor: '#000', // Shadow for the button itself
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  selectButton: { // This View is inside the gradient
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent', // Gradient handles the color
  },
  selectButtonText: {
    color: themeColors.textPrimary, // White text on vibrant button
    fontWeight: '600',
    fontSize: 16,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 30 : 40, // More padding at the bottom
    paddingTop: 10,
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    marginHorizontal: 6,
    // backgroundColor set dynamically
  },
});