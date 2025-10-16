
import { WebSocketService } from './WebSocketService';

// Create a singleton instance
const wsUrl = process.env.NODE_ENV === 'development' 
  ? 'ws://localhost:5000/ws' 
  : `wss://${window.location.host}/ws`;

export const websocketService = new WebSocketService({
  url: wsUrl,
  maxReconnectAttempts: 5,
  reconnectDelay: 1000
});

export { useWebSocket } from './useWebSocket';
export * from './types';
export default websocketService;
