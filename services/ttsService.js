// File: client/services/ttsService.js
import * as Speech from 'expo-speech';

class TTSService {
  async speak(text, voice = 'en-US') {
    try {
      await Speech.speak(text, { language: voice, pitch: 1.0, rate: 0.9 });
      return true;
    } catch (error) {
      console.error('Error speaking text:', error);
      return false;
    }
  }
  
  stop() {
    try {
      Speech.stop();
      return true;
    } catch (error) {
      console.error('Error stopping speech:', error);
      return false;
    }
  }
}

export default new TTSService();