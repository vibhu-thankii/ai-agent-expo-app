// client/components/HomeScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import * as Speech from 'expo-speech';

export default function HomeScreen() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');

  // Dummy function to simulate voice recognition and processing
  const handleVoiceCommand = async () => {
    setIsProcessing(true);
    setTimeout(() => {
      const dummyCommand = "What's the weather today?";
      setRecognizedText(dummyCommand);
      sendCommandToBackend(dummyCommand);
    }, 1500);
  };

  const sendCommandToBackend = async (command) => {
    try {
      const response = await fetch('http://localhost:3000/process-command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command }),
      });
      const data = await response.json();
      Speech.speak(data.response, { language: 'en-US' });
      setIsProcessing(false);
    } catch (error) {
      setIsProcessing(false);
      Alert.alert("Error", "Could not process the command.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Jarvis AI Assistant</Text>
      {recognizedText ? <Text style={styles.commandText}>You said: {recognizedText}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleVoiceCommand} disabled={isProcessing}>
        {isProcessing ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Activate Voice Command</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2', alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 30, color: '#6200ee' },
  commandText: { fontSize: 18, marginVertical: 20, textAlign: 'center' },
  button: { backgroundColor: '#6200ee', paddingVertical: 15, paddingHorizontal: 25, borderRadius: 8 },
  buttonText: { color: '#fff', fontSize: 18 },
});
