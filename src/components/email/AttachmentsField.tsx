
import React from 'react';
import { FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Paperclip } from 'lucide-react';

interface AttachmentsFieldProps {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

const AttachmentsField: React.FC<AttachmentsFieldProps> = ({ files, setFiles }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeAttachment = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <FormLabel>Attachments</FormLabel>
      <div className="flex items-center gap-2">
        <Input
          type="file"
          id="attachments"
          onChange={handleFileChange}
          className="hidden"
          multiple
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => document.getElementById('attachments')?.click()}
        >
          <Paperclip className="mr-2 h-4 w-4" />
          Attach Files
        </Button>
      </div>

      {files.length > 0 && (
        <div className="mt-2 space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-md border p-2 text-sm"
            >
              <span className="truncate">{file.name}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeAttachment(index)}
              >
                ×
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AttachmentsField;
