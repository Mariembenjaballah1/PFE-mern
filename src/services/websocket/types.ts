
export type WebSocketEventHandler = (data: any) => void;

export interface WebSocketEvents {
  'asset-updated': WebSocketEventHandler;
  'asset-created': WebSocketEventHandler;
  'asset-deleted': WebSocketEventHandler;
  'maintenance-scheduled': WebSocketEventHandler;
  'maintenance-completed': WebSocketEventHandler;
  'user-notification': WebSocketEventHandler;
  'resource-alert': WebSocketEventHandler;
  'stats-updated': WebSocketEventHandler;
  'project-updated': WebSocketEventHandler;
  'activity-added': WebSocketEventHandler;
  'system-health': WebSocketEventHandler;
}

export interface WebSocketMessage {
  type: string;
  data: any;
}

export interface WebSocketConfig {
  url: string;
  maxReconnectAttempts?: number;
  reconnectDelay?: number;
  heartbeatInterval?: number;
}
