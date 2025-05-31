// File: client/services/sessionService.js
import { API_URL } from '../config';

class SessionService {
  async startSession(agentId) {
    try {
      const response = await fetch(`${API_URL}/api/session/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId })
      });
      if (!response.ok) throw new Error('Failed to start session');
      const data = await response.json();
      return data.sessionId;
    } catch (error) {
      console.error('Error starting session:', error);
      throw error;
    }
  }
  
  async endSession(sessionId) {
    try {
      const response = await fetch(`${API_URL}/api/session/${sessionId}/end`, { method: 'PUT' });
      if (!response.ok) throw new Error('Failed to end session');
      return true;
    } catch (error) {
      console.error('Error ending session:', error);
      return false;
    }
  }
  
  async uploadTranscription(sessionId, audioUri, speaker = 'user') {
    try {
      const formData = new FormData();
      formData.append('audio', { uri: audioUri, name: 'recording.m4a', type: 'audio/m4a' });
      formData.append('speaker', speaker);
      const response = await fetch(`${API_URL}/api/transcribe/${sessionId}`, { method: 'POST', body: formData });
      if (!response.ok) throw new Error('Failed to upload audio');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error uploading transcription:', error);
      throw error;
    }
  }
  
  async getPendingActions(sessionId) {
    try {
      const response = await fetch(`${API_URL}/api/action/${sessionId}/pending`);
      if (!response.ok) throw new Error('Failed to get pending actions');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting pending actions:', error);
      return [];
    }
  }
  
  async performAction(sessionId, actionId) {
    try {
      const response = await fetch(`${API_URL}/api/action/${sessionId}/perform`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actionId })
      });
      if (!response.ok) throw new Error('Failed to perform action');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error performing action:', error);
      throw error;
    }
  }
}

export default new SessionService();