
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { useMutation } from '@tanstack/react-query';
import { sendEmail } from '@/services/emailApi';
import RecipientField from './RecipientField';
import SubjectField from './SubjectField';
import MessageField from './MessageField';
import AttachmentsField from './AttachmentsField';
import SubmitButton from './SubmitButton';
import TemplateSelector from './TemplateSelector';

export interface EmailFormValues {
  to: string;
  subject: string;
  message: string;
  attachments?: File[];
}

// Schema for form validation
const formSchema = z.object({
  to: z.string().email('Invalid email address'),
  subject: z.string().min(2, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  attachments: z.array(z.instanceof(File)).optional()
});

interface EmailFormProps {
  onEmailSent?: () => void;
}

const EmailForm: React.FC<EmailFormProps> = ({ onEmailSent }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  
  const form = useForm<EmailFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      to: '',
      subject: '',
      message: '',
      attachments: []
    }
  });
  
  const sendEmailMutation = useMutation({
    mutationFn: sendEmail,
    onSuccess: (data) => {
      if (data.success) {
        form.reset();
        setFiles([]);
        setSelectedTemplate(null);
        
        // Call the onEmailSent callback if provided
        if (onEmailSent) {
          onEmailSent();
        }
      }
    }
  });
  
  const onSubmit = (data: EmailFormValues) => {
    // Include files in the submission
    const emailData = {
      ...data,
      attachments: files.length > 0 ? files : undefined
    };
    
    // Send the email
    sendEmailMutation.mutate(emailData);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <TemplateSelector 
          form={form} 
          selectedTemplate={selectedTemplate} 
          setSelectedTemplate={setSelectedTemplate} 
        />
        
        <RecipientField form={form} />
        
        <SubjectField form={form} />
        
        <MessageField form={form} />
        
        <AttachmentsField files={files} setFiles={setFiles} />
        
        <SubmitButton isSubmitting={sendEmailMutation.isPending} />
      </form>
    </Form>
  );
};

export default EmailForm;
