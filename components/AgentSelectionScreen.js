// client/screens/AgentSelectionScreen.js
import React, { useRef } from 'react';
import { 
  View, Text, TouchableOpacity, StyleSheet, Image, 
  ScrollView, Animated, Dimensions, StatusBar, SafeAreaView 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.8;
const SPACING = 15;

export default function AgentSelectionScreen({ navigation }) {
  const scrollX = useRef(new Animated.Value(0)).current;
  
  const agents = [
    { 
      id: 'TkvOiYUSHLZyVnFgBnJr',
      name: 'Support Agent',
      tagline: 'Technical solutions, simplified.',
      description: 'Expert technical support and customer assistance',
      colors: ['#4285F4', '#0F9D58'],
      image: require('../assets/agents/support-agent.png'),
      icon: '💻'
    },
    { 
      id: 'oYxMlLkXbNtZDS3zCikc',
      name: 'Mindfulness Coach',
      tagline: 'Find peace within yourself',
      description: 'Guided meditation and stress reduction techniques',
      colors: ['#34A853', '#2E7D32'],
      image: require('../assets/agents/mindfulness-coach.png'),
      icon: '🧘‍♀️'
    },
    { 
      id: 'obmk35jYzsvmFDtgiIfk',
      name: 'Game Master',
      tagline: 'Embark on an epic adventure',
      description: 'Your companion through digital realms and quests',
      colors: ['#FBBC05', '#F57C00'],
      image: require('../assets/agents/game-master.png'),
      icon: '🎮'
    },
    { 
      id: 'USji2hEbVPYimRif3His',
      name: 'Travel Guide',
      tagline: 'Discover the world with me',
      description: 'Explore destinations and create memorable journeys',
      colors: ['#EA4335', '#C62828'],
      image: require('../assets/agents/travel-guide.png'),
      icon: '✈️'
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Choose Your AI Assistant</Text>
        <Text style={styles.headerSubtitle}>Select a companion for your journey</Text>
      </View>
      
      <Animated.FlatList
        data={agents}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
        snapToInterval={CARD_WIDTH + SPACING * 2}
        decelerationRate="fast"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        renderItem={({ item, index }) => {
          const inputRange = [
            (index - 1) * (CARD_WIDTH + SPACING * 2),
            index * (CARD_WIDTH + SPACING * 2),
            (index + 1) * (CARD_WIDTH + SPACING * 2),
          ];
          
          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.9, 1, 0.9],
            extrapolate: 'clamp',
          });
          
          return (
            <Animated.View
              style={[styles.cardContainer, { transform: [{ scale }] }]}
            >
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.navigate('Conversation', { agent: item })}
              >
                <LinearGradient
                  colors={item.colors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.card}
                >
                  <View style={styles.cardContent}>
                    <View style={styles.iconContainer}>
                      <Text style={styles.agentIcon}>{item.icon}</Text>
                    </View>
                    
                    <Image 
                      source={item.image} 
                      style={styles.agentImage}
                      resizeMode="contain"
                    />
                    
                    <View style={styles.textContainer}>
                      <Text style={styles.agentName}>{item.name}</Text>
                      <Text style={styles.agentTagline}>{item.tagline}</Text>
                      <Text style={styles.agentDescription}>{item.description}</Text>
                    </View>
                    
                    <View style={styles.buttonContainer}>
                      <TouchableOpacity 
                        style={styles.selectButton}
                        onPress={() => navigation.navigate('Conversation', { agent: item })}
                      >
                        <Text style={styles.selectButtonText}>Select Agent</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          );
        }}
      />
      
      {/* Dots indicator */}
      <View style={styles.paginationContainer}>
        {agents.map((_, index) => {
          const inputRange = [
            (index - 1) * (CARD_WIDTH + SPACING * 2),
            index * (CARD_WIDTH + SPACING * 2),
            (index + 1) * (CARD_WIDTH + SPACING * 2),
          ];
          
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.4, 1, 0.4],
            extrapolate: 'clamp',
          });
          
          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.8, 1.2, 0.8],
            extrapolate: 'clamp',
          });
          
          return (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                {
                  opacity,
                  transform: [{ scale }],
                  backgroundColor: agents[index].colors[0],
                },
              ]}
            />
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#212121',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    marginTop: 8,
  },
  flatListContent: {
    paddingVertical: 24,
    paddingHorizontal: width * 0.1,
  },
  cardContainer: {
    width: CARD_WIDTH,
    marginHorizontal: SPACING,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
  },
  card: {
    height: 480,
    borderRadius: 24,
    overflow: 'hidden',
  },
  cardContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  iconContainer: {
    alignItems: 'flex-end',
  },
  agentIcon: {
    fontSize: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    width: 60,
    height: 60,
    textAlign: 'center',
    lineHeight: 60,
    borderRadius: 30,
    overflow: 'hidden',
  },
  agentImage: {
    width: '100%',
    height: 200,
    alignSelf: 'center',
  },
  textContainer: {
    marginTop: 16,
  },
  agentName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 6,
  },
  agentTagline: {
    fontSize: 18,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 12,
  },
  agentDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  buttonContainer: {
    marginTop: 24,
  },
  selectButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  selectButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 6,
  },
});
