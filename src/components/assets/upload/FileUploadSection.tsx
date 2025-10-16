
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText } from 'lucide-react';

interface FileUploadSectionProps {
  file: File | null;
  isUploading: boolean;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  file,
  isUploading,
  onFileChange,
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="csv-file">Select File (CSV or Excel)</Label>
      <div className="flex items-center gap-4">
        <Input
          id="csv-file"
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={onFileChange}
          disabled={isUploading}
        />
        {file && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <FileText className="h-4 w-4" />
            {file.name}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploadSection;
