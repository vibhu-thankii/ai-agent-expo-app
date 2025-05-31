// File: client/App.js

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AgentSelectionScreen from './screens/AgentSelectionScreen';
import ConversationScreen from './screens/ConversationScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="AgentSelection">
        <Stack.Screen name="AgentSelection" component={AgentSelectionScreen} options={{ title: 'Select Your Agent' }} />
        <Stack.Screen name="Conversation" component={ConversationScreen} options={({ route }) => ({ title: route.params.agent.name })} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}