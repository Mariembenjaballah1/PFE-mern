
import { WebSocketService } from '@/services/websocketService';

declare global {
  interface Window {
    websocketService?: WebSocketService;
  }
}

export {};
