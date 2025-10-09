
export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'suggestion' | 'error' | 'processing' | 'action';
  read?: boolean;
  context?: {
    assetId?: string;
    maintenanceId?: string;
    reportId?: string;
    projectId?: string;
    action?: 'view' | 'edit' | 'create' | 'delete' | 'navigate';
    suggestions?: string[];
    actions?: string[];
  };
}

export interface ChatSession {
  id: string;
  messages: Message[];
  createdAt: Date;
  lastActiveAt: Date;
  topic?: string;
  context?: {
    currentPage?: string;
    userRole?: string;
    recentActions?: string[];
  };
}

export interface ChatbotConfig {
  enableQuickActions: boolean;
  enableSuggestions: boolean;
  enableStats: boolean;
  maxSuggestions: number;
  responseDelay: number;
}
