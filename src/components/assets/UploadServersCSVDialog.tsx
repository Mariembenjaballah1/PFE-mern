
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Upload } from 'lucide-react';
import { useUploadServersCSV } from './upload/useUploadServersCSV';
import FileUploadSection from './upload/FileUploadSection';
import FileFormatHelp from './upload/FileFormatHelp';
import NewProjectsAlert from './upload/NewProjectsAlert';
import ServersPreview from './upload/ServersPreview';
import DialogActions from './upload/DialogActions';

interface UploadServersCSVDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const UploadServersCSVDialog: React.FC<UploadServersCSVDialogProps> = ({
  open,
  onOpenChange,
  onSuccess,
}) => {
  const {
    file,
    isUploading,
    parsedData,
    showPreview,
    groupedServers,
    newProjects,
    handleFileChange,
    handleUpload,
    resetDialog
  } = useUploadServersCSV(open);

  const handleClose = () => {
    onOpenChange(false);
    resetDialog();
  };

  const handleUploadClick = () => {
    handleUpload(onSuccess, handleClose);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Servers File
          </DialogTitle>
          <DialogDescription>
            Upload a CSV or Excel file containing server information. The system will automatically detect project assignments and create new projects if needed.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <FileUploadSection
            file={file}
            isUploading={isUploading}
            onFileChange={handleFileChange}
          />

          <FileFormatHelp />

          <NewProjectsAlert newProjects={newProjects} />

          {showPreview && parsedData.length > 0 && (
            <ServersPreview
              parsedDataLength={parsedData.length}
              groupedServers={groupedServers}
              newProjects={newProjects}
            />
          )}

          <DialogActions
            showPreview={showPreview}
            parsedDataLength={parsedData.length}
            isUploading={isUploading}
            onCancel={handleClose}
            onUpload={handleUploadClick}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UploadServersCSVDialog;
