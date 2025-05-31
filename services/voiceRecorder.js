
// File: client/services/voiceRecorder.js
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

class VoiceRecorder {
  constructor() {
    this.recording = null;
    this.isRecording = false;
  }
  
  async setupRecording() {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') throw new Error('Permission to access microphone was denied');
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false
      });
    } catch (error) {
      console.error('Error setting up recording:', error);
      throw error;
    }
  }
  
  async startRecording() {
    try {
      if (this.isRecording) return;
      await this.setupRecording();
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await recording.startAsync();
      this.recording = recording;
      this.isRecording = true;
      return true;
    } catch (error) {
      console.error('Error starting recording:', error);
      return false;
    }
  }
  
  async stopRecording() {
    try {
      if (!this.isRecording) return null;
      await this.recording.stopAndUnloadAsync();
      const uri = this.recording.getURI();
      this.isRecording = false;
      this.recording = null;
      return uri;
    } catch (error) {
      console.error('Error stopping recording:', error);
      return null;
    }
  }
}

export default new VoiceRecorder();