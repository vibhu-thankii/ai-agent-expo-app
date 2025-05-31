// client/screens/ConversationScreen.js
import React, { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, StatusBar, 
  TouchableOpacity, Animated, Image, Dimensions 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import ConvAI from '../components/ConvAI';

const { width, height } = Dimensions.get('window');

export default function ConversationScreen({ route, navigation }) {
  const { agent } = route.params;
  const [pulseAnim] = useState(new Animated.Value(1));
  
  // Log agent info for debugging
  useEffect(() => {
    console.log('[ConversationScreen] Agent:', agent);
    console.log('[ConversationScreen] Agent ID:', agent.id);
  }, [agent]);
  
  // Set status bar style based on theme
  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    // Start pulse animation for the orb
    startPulseAnimation();
    
    return () => {
      StatusBar.setBarStyle('dark-content');
    };
  }, []);
  
  // Pulse animation for the orb
  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: true
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true
        })
      ])
    ).start();
  };

  // Get theme-specific styles
  const getThemeStyles = () => {
    const themes = {
      'Support Agent': {
        gradientColors: ['rgba(66, 133, 244, 0.7)', 'rgba(15, 157, 88, 0.7)'],
        backgroundGif: require('../assets/backgrounds/support-bg.gif'),
        orbGradient: ['#64B5F6', '#2196F3', '#1976D2'],
        subtitleText: 'Technical support at your service'
      },
      'Mindfulness Coach': {
        gradientColors: ['rgba(52, 168, 83, 0.7)', 'rgba(30, 94, 32, 0.7)'],
        backgroundGif: require('../assets/backgrounds/mindfulness-bg.gif'),
        orbGradient: ['#81C784', '#4CAF50', '#388E3C'],
        subtitleText: 'Find your inner peace'
      },
      'Game Master': {
        gradientColors: ['rgba(79, 45, 127, 0.7)', 'rgba(45, 10, 79, 0.7)'],
        backgroundGif: require('../assets/backgrounds/gaming-bg.gif'),
        orbGradient: ['#7E57C2', '#673AB7', '#512DA8'],
        subtitleText: 'Your adventure awaits'
      },
      'Travel Guide': {
        gradientColors: ['rgba(234, 67, 53, 0.7)', 'rgba(183, 28, 28, 0.7)'],
        backgroundGif: require('../assets/backgrounds/travel-bg.gif'),
        orbGradient: ['#FF8A65', '#FF5722', '#E64A19'],
        subtitleText: 'Discover the world with me'
      }
    };

    return themes[agent.name] || themes['Support Agent'];
  };

  const theme = getThemeStyles();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* Background GIF */}
      <Image 
        source={theme.backgroundGif}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      
      {/* Gradient overlay */}
      <LinearGradient
        colors={theme.gradientColors}
        style={styles.gradientOverlay}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      <SafeAreaView style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <BlurView intensity={30} tint="dark" style={styles.blurContainer}>
              <Text style={styles.backButtonText}>←</Text>
            </BlurView>
          </TouchableOpacity>
          
          <BlurView intensity={30} tint="dark" style={styles.titleContainer}>
            <Text style={styles.headerText}>
              {agent.name}
            </Text>
          </BlurView>
        </View>
        
        {/* Subtitle / Instructions */}
        <View style={styles.instructionContainer}>
          <BlurView intensity={25} tint="dark" style={styles.blurInstructionContainer}>
            <Text style={styles.instructionText}>
              {theme.subtitleText}
            </Text>
          </BlurView>
        </View>
        
        {/* Orb / ConvAI Container */}
        <View style={styles.orbContainer}>
          <Animated.View
            style={[
              styles.pulseContainer,
              { transform: [{ scale: pulseAnim }] }
            ]}
          >
            <LinearGradient
              colors={theme.orbGradient}
              style={styles.outerOrb}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <ConvAI agentId={agent.id} theme={theme} />
            </LinearGradient>
          </Animated.View>
        </View>
        
        {/* Instructions */}
        <View style={styles.bottomInstructionContainer}>
          <BlurView intensity={40} tint="dark" style={styles.bottomBlurContainer}>
            <Text style={styles.bottomInstructionText}>
              Tap the orb to start talking
            </Text>
          </BlurView>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    paddingTop: StatusBar.currentHeight || 44,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    zIndex: 10,
  },
  blurContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  titleContainer: {
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
    overflow: 'hidden',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  instructionContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  blurInstructionContainer: {
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 8,
    overflow: 'hidden',
  },
  instructionText: {
    fontSize: 16,
    textAlign: 'center',
    color: 'white',
    opacity: 0.9,
  },
  orbContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulseContainer: {
    width: 220,
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  outerOrb: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  bottomInstructionContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  bottomBlurContainer: {
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 8,
    overflow: 'hidden',
  },
  bottomInstructionText: {
    fontSize: 14,
    textAlign: 'center',
    color: 'white',
    opacity: 0.9,
  }
});