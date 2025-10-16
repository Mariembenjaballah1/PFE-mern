
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

// Enhanced toast provider that combines both toast systems
export const EnhancedToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      {children}
      {/* Shadcn toast system for complex toasts with actions */}
      <Toaster />
      {/* Sonner for simple, elegant notifications */}
      <Sonner 
        position="bottom-right"
        expand={true}
        richColors={true}
        closeButton={true}
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--background)',
            border: '1px solid var(--border)',
            color: 'var(--foreground)',
          },
          className: 'group',
          descriptionClassName: 'group-[.toast]:text-muted-foreground',
          cancelButtonStyle: {
            backgroundColor: 'var(--muted)',
            color: 'var(--muted-foreground)'
          }
        }}
      />
    </>
  );
};
