
import { WebSocketMessage, WebSocketEventHandler } from './types';
import { showRealtimeNotification } from './notifications';

export class MessageHandler {
  private listeners: Map<string, Set<WebSocketEventHandler>> = new Map();

  handleMessage(message: WebSocketMessage) {
    const { type, data } = message;
    
    // Handle system messages
    if (type === 'pong') {
      return; // Heartbeat response
    }
    
    // Trigger event handlers
    const eventListeners = this.listeners.get(type);
    if (eventListeners) {
      eventListeners.forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error(`Error in WebSocket event handler for ${type}:`, error);
        }
      });
    }

    // Show real-time notifications for certain events
    showRealtimeNotification(type, data);
  }

  addListener<T extends string>(event: T, handler: WebSocketEventHandler) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(handler);
  }

  removeListener<T extends string>(event: T, handler: WebSocketEventHandler) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.delete(handler);
    }
  }

  simulateRealtimeData() {
    const events = [
      { type: 'asset-updated', data: { id: 'test', name: 'Test Asset' } },
      { type: 'stats-updated', data: { assets: Math.floor(Math.random() * 100) } },
      { type: 'activity-added', data: { user: 'System', action: 'Auto-generated activity' } }
    ];
    
    setInterval(() => {
      const randomEvent = events[Math.floor(Math.random() * events.length)];
      this.handleMessage(randomEvent);
    }, 10000); // Simulate events every 10 seconds
  }
}
