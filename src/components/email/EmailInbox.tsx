
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Loader2, Mail, MailOpen, Paperclip, RefreshCw, X } from 'lucide-react';
import { toast } from "@/components/ui/sonner";
import { getReceivedEmails, markEmailAsRead, ReceivedEmail } from '@/services/emailApi';

const EmailInbox: React.FC = () => {
  const [selectedEmail, setSelectedEmail] = useState<ReceivedEmail | null>(null);
  const queryClient = useQueryClient();
  
  const { data: emails, isLoading, error, refetch } = useQuery({
    queryKey: ['receivedEmails'],
    queryFn: getReceivedEmails
  });
  
  const markAsReadMutation = useMutation({
    mutationFn: markEmailAsRead,
    onSuccess: () => {
      // Update the cache to mark the email as read
      queryClient.setQueryData(['receivedEmails'], (oldData: any) => {
        return oldData.map((email: ReceivedEmail) => 
          email.id === selectedEmail?.id ? { ...email, read: true } : email
        );
      });
    }
  });
  
  const handleOpenEmail = (email: ReceivedEmail) => {
    setSelectedEmail(email);
    if (!email.read) {
      markAsReadMutation.mutate(email.id);
    }
  };
  
  const handleRefresh = () => {
    refetch();
    toast.success("Inbox refreshed");
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffDays > 0) {
      return `${diffDays}d ago`;
    } else if (diffHours > 0) {
      return `${diffHours}h ago`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes}m ago`;
    } else {
      return 'Just now';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2">Loading inbox...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-6 text-red-500">
        Failed to load emails. Please try again later.
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Inbox</h2>
          {emails?.filter((email: ReceivedEmail) => !email.read).length > 0 && (
            <Badge variant="default" className="ml-2">
              {emails.filter((email: ReceivedEmail) => !email.read).length} new
            </Badge>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
      
      {emails?.length === 0 ? (
        <Card className="border border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Mail className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">Your inbox is empty</p>
          </CardContent>
        </Card>
      ) : (
        <ScrollArea className="h-[350px]">
          <div className="space-y-2">
            {emails?.map((email: ReceivedEmail) => (
              <div 
                key={email.id}
                className={`p-3 border rounded-lg flex items-center justify-between cursor-pointer hover:bg-accent/50 ${!email.read ? 'bg-primary/5 border-primary/20' : 'bg-card'}`}
                onClick={() => handleOpenEmail(email)}
              >
                <div className="flex items-center gap-3">
                  {email.read ? (
                    <MailOpen className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  ) : (
                    <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-medium truncate ${!email.read ? 'text-primary' : ''}`}>
                        {email.from}
                      </p>
                      {email.attachments && email.attachments.length > 0 && (
                        <Paperclip className="h-3 w-3 text-muted-foreground" />
                      )}
                    </div>
                    <p className="text-sm truncate">{email.subject}</p>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                  {formatDate(email.date)}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
      
      {/* Email Detail Dialog */}
      <Dialog open={!!selectedEmail} onOpenChange={(open) => !open && setSelectedEmail(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>{selectedEmail?.subject}</DialogTitle>
              <Button variant="ghost" size="icon" onClick={() => setSelectedEmail(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <DialogDescription className="flex justify-between items-center">
              <span>From: {selectedEmail?.from}</span>
              <span className="text-muted-foreground text-xs">
                {selectedEmail?.date && new Date(selectedEmail.date).toLocaleString()}
              </span>
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-2 border-t pt-4">
            <div className="whitespace-pre-line">{selectedEmail?.message}</div>
            
            {selectedEmail?.attachments && selectedEmail.attachments.length > 0 && (
              <div className="mt-6 border-t pt-4">
                <h4 className="text-sm font-medium mb-2">Attachments</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedEmail.attachments.map((attachment, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center gap-2 border rounded-md px-3 py-2 bg-accent/30"
                    >
                      <Paperclip className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{attachment.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmailInbox;
