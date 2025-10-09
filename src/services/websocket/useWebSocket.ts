
import { websocketService } from './index';

export const useWebSocket = () => {
  return {
    isConnected: websocketService.isConnected,
    on: websocketService.on.bind(websocketService),
    off: websocketService.off.bind(websocketService),
    send: websocketService.send.bind(websocketService),
    simulateRealtimeData: websocketService.simulateRealtimeData.bind(websocketService),
  };
};
