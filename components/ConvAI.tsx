import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, Pressable, StyleSheet, Text, Animated, 
  ActivityIndicator, Platform, LogBox, Alert, Easing,
  useWindowDimensions, Dimensions
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Audio } from 'expo-av';
import { useConversation } from '@11labs/react';

// Suppress any remaining errors
LogBox.ignoreLogs([
  'Cannot create URL for blob',
  'URL.createObjectURL is not supported'
]);

interface ConvAIProps {
  agentId: string;
  theme?: any;
}

export default function ConvAI({ agentId, theme }: ConvAIProps) {
  // Get screen dimensions for responsiveness
  const { width, height } = useWindowDimensions();
  
  const [useWebView, setUseWebView] = useState(false);
  const [hasAttemptedNative, setHasAttemptedNative] = useState(false);
  const [rippleAnim] = useState(new Animated.Value(0));
  const [animationRef, setAnimationRef] = useState<Animated.CompositeAnimation | null>(null);
  const [statusText, setStatusText] = useState('Tap to talk');
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Calculate responsive sizes based on screen dimensions
  const getResponsiveSizes = () => {
    const smallerDimension = Math.min(width, height);
    
    // Button size: 25% of smaller dimension, clamped between 80-120px
    const buttonSize = Math.max(80, Math.min(smallerDimension * 0.25, 120));
    
    // Text sizes scale with screen size
    const iconSize = buttonSize * 0.36;
    const statusTextSize = Math.max(14, Math.min(16, width * 0.04));
    
    return { buttonSize, iconSize, statusTextSize };
  };
  
  const { buttonSize, iconSize, statusTextSize } = getResponsiveSizes();
  
  // Listen for dimension changes (orientation changes)
  useEffect(() => {
    const dimensionsChangeHandler = Dimensions.addEventListener('change', () => {
      // The useWindowDimensions hook will update automatically
      // This forces a re-render to recalculate sizes
    });
    
    return () => {
      dimensionsChangeHandler.remove();
    };
  }, []);
  
  // Initialize conversation 
  const conversation = useConversation({
    webSocketOnly: true,
    onConnect: () => {
      setStatusText('Listening...');
      setIsActive(true);
      setIsLoading(false);
      startRippleAnimation();
    },
    onDisconnect: () => {
      setStatusText('Tap to talk');
      setIsActive(false);
      setIsLoading(false);
      stopRippleAnimation();
    },
    onError: (error) => {
      console.error('Error in native implementation:', error);
      
      // If this is our first attempt, switch to WebView
      if (!hasAttemptedNative && !useWebView) {
        setHasAttemptedNative(true);
        setUseWebView(true);
        setIsLoading(false);
        setStatusText('Tap to talk');
        Alert.alert(
          "Switching to Web Mode",
          "We'll use a more compatible mode for your device."
        );
      } else {
        setStatusText('Error - tap to retry');
        setIsActive(false);
        setIsLoading(false);
      }
    }
  });
  
  // Request microphone permissions on component mount
  useEffect(() => {
    if (Platform.OS !== 'web') {
      (async () => {
        try {
          await Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            playsInSilentModeIOS: true,
            staysActiveInBackground: false,
            shouldDuckAndroid: true,
            playThroughEarpieceAndroid: false,
            interruptionModeIOS: 1,
            interruptionModeAndroid: 2,
          });
          
          const { status } = await Audio.requestPermissionsAsync();
          if (status !== 'granted') {
            console.warn('Microphone permission not granted');
          }
        } catch (error) {
          console.error('Error requesting microphone permission:', error);
        }
      })();
    }
    
    // Clean up on unmount
    return () => {
      if (animationRef) {
        animationRef.stop();
      }
    };
  }, []);

  // Animation functions
  const startRippleAnimation = () => {
    rippleAnim.setValue(0);
    const animation = Animated.loop(
      Animated.timing(rippleAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true
      })
    );
    setAnimationRef(animation);
    animation.start();
  };

  const stopRippleAnimation = () => {
    if (animationRef) {
      animationRef.stop();
    }
  };

  // Toggle conversation
  const toggleConversation = useCallback(async () => {
    if (isLoading) return;
    
    try {
      if (conversation.status === 'disconnected') {
        setIsLoading(true);
        setStatusText('Connecting...');
        
        await conversation.startSession({
          agentId: agentId,
          overrides: {
            tts: {
              // Only voiceId is allowed according to type definition
              // audioOutputFormat: 'mp3'
            }
          }
        });
      } else {
        setStatusText('Ending...');
        await conversation.endSession();
      }
    } catch (error) {
      console.error('Connection error:', error);
      setStatusText('Error - tap to retry');
      setIsLoading(false);
      
      // If this is our first attempt, switch to WebView
      if (!hasAttemptedNative && !useWebView) {
        setHasAttemptedNative(true);
        setUseWebView(true);
      }
    }
  }, [conversation, agentId, isLoading, hasAttemptedNative, useWebView]);

  // Animation configuration
  const rippleScale = rippleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.8]
  });

  const rippleOpacity = rippleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 0]
  });

  // Native implementation
  return (
    <View style={styles.container}>
      {isActive && (
        <Animated.View
          style={[
            styles.ripple,
            {
              width: buttonSize,
              height: buttonSize,
              borderRadius: buttonSize / 2,
              transform: [{ scale: rippleScale }],
              opacity: rippleOpacity
            }
          ]}
        />
      )}
      
      <Pressable
        style={[
          styles.button,
          {
            width: buttonSize,
            height: buttonSize,
            borderRadius: buttonSize / 2,
          },
          isActive ? styles.activeButton : styles.inactiveButton,
          isLoading ? styles.loadingButton : null
        ]}
        onPress={toggleConversation}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" size="large" />
        ) : (
          <Text style={[styles.buttonIcon, { fontSize: iconSize }]}>
            {isActive ? '⏹' : '🎙️'}
          </Text>
        )}
      </Pressable>
      
      <Text style={[styles.statusText, { fontSize: statusTextSize }]}>
        {statusText}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    flex: 1,
    paddingHorizontal: 16,
  },
  webview: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  ripple: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  activeButton: {
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
  },
  inactiveButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  loadingButton: {
    backgroundColor: 'rgba(100, 100, 100, 0.5)',
  },
  buttonIcon: {
    color: 'white',
  },
  statusText: {
    marginTop: 16,
    color: 'white',
    fontWeight: '500',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  }
});