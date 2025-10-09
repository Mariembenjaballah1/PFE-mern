
import React from 'react';
import { FormLabel } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { EmailFormValues } from './EmailForm';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from '@tanstack/react-query';
import { getEmailTemplates } from '@/services/emailApi';

interface TemplateSelectorProps {
  form: UseFormReturn<EmailFormValues>;
  selectedTemplate: string | null;
  setSelectedTemplate: (templateId: string) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ form, selectedTemplate, setSelectedTemplate }) => {
  const { data: templates = [] } = useQuery({
    queryKey: ['emailTemplates'],
    queryFn: getEmailTemplates
  });

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = templates.find((t: any) => t.id === templateId);
    if (template) {
      form.setValue('subject', template.subject);
      form.setValue('message', template.content || `This is a template message for ${template.name}. Please customize it.`);
    }
  };

  return (
    <div className="space-y-2">
      <FormLabel>Email Template</FormLabel>
      <Select 
        value={selectedTemplate || "none"} 
        onValueChange={handleTemplateChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a template (optional)" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">No Template</SelectItem>
          {templates.map((template: any) => (
            <SelectItem key={template.id} value={template.id || "template-id-fallback"}>
              {template.name || "Unnamed Template"}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TemplateSelector;
