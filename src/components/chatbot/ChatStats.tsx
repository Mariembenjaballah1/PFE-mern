
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle, Clock, CheckCircle } from 'lucide-react';

interface ChatStatsProps {
  totalMessages: number;
  avgResponseTime: string;
  helpfulResponses: number;
}

export const ChatStats: React.FC<ChatStatsProps> = ({
  totalMessages,
  avgResponseTime,
  helpfulResponses
}) => {
  return (
    <Card className="mt-2">
      <CardContent className="p-3">
        <h4 className="text-sm font-medium mb-2">Chat Statistics</h4>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center">
            <MessageCircle className="h-4 w-4 mx-auto mb-1 text-blue-500" />
            <p className="font-medium">{totalMessages}</p>
            <p className="text-muted-foreground">Messages</p>
          </div>
          <div className="text-center">
            <Clock className="h-4 w-4 mx-auto mb-1 text-green-500" />
            <p className="font-medium">{avgResponseTime}</p>
            <p className="text-muted-foreground">Avg Response</p>
          </div>
          <div className="text-center">
            <CheckCircle className="h-4 w-4 mx-auto mb-1 text-purple-500" />
            <p className="font-medium">{helpfulResponses}</p>
            <p className="text-muted-foreground">Helpful</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
