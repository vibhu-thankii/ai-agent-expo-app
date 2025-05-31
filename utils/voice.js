// client/utils/voice.js
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';

/**
 * speakText uses Expo's Speech API to speak out the provided text.
 * @param {string} text - The text to speak.
 */
export async function speakText(text) {
  try {
    Speech.speak(text, { language: 'en-US' });
  } catch (error) {
    console.error('Error in speakText:', error);
  }
}

/**
 * recordAudioAsync records audio using Expo's Audio API.
 * For demonstration purposes, it records for 3 seconds and returns a dummy transcription.
 * In production, you might send the recorded audio to an STT service.
 * @returns {Promise<string>} - The transcribed text.
 */
export async function recordAudioAsync() {
  try {
    // Request permission to record audio
    const { status } = await Audio.requestPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Permission to access microphone was denied');
    }

    // Set up the audio recording mode
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    const recording = new Audio.Recording();
    await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
    await recording.startAsync();

    console.log('Recording started... Recording for 3 seconds.');
    // Record for 3 seconds (simulate user speaking)
    await new Promise(resolve => setTimeout(resolve, 3000));

    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    console.log('Recording stopped. File saved at:', uri);

    // In a real implementation, send 'uri' to a speech-to-text service and return the transcription.
    // For now, return a dummy transcription.
    return 'This is a simulated transcription.';
  } catch (error) {
    console.error('Error in recordAudioAsync:', error);
    return 'Error recording audio.';
  }
}
