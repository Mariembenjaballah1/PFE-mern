
import React, { useState } from 'react';
import { useFileHandling } from './fileHandling';
import { useCSVProcessing } from './csvProcessing';
import { useServerUpload } from './serverUpload';
import { UseUploadServersCSVReturn } from './types';

export const useUploadServersCSV = (dialogOpen: boolean): UseUploadServersCSVReturn => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [parsedServers, setParsedServers] = useState<any[]>([]);
  const [newProjects, setNewProjects] = useState<string[]>([]);

  const { processCSVFile } = useCSVProcessing();
  const { uploadServers } = useServerUpload();

  // Computed properties
  const parsedData = parsedServers;
  const showPreview = parsedServers.length > 0;
  const groupedServers = parsedServers.reduce((acc, server) => {
    const projectName = server.projectName || 'Unassigned';
    if (!acc[projectName]) {
      acc[projectName] = [];
    }
    acc[projectName].push(server);
    return acc;
  }, {} as Record<string, any[]>);

  const handleFileSelect = async (file: File) => {
    try {
      setIsUploading(true);
      const { validatedServers, newProjects: projectsToCreate } = await processCSVFile(file);
      setParsedServers(validatedServers);
      setNewProjects(projectsToCreate);
      setIsUploading(false);
    } catch (error) {
      setIsUploading(false);
    }
  };

  const { handleFileChange } = useFileHandling(setFile, handleFileSelect);

  const handleUpload = async (onSuccess?: () => void, onClose?: () => void) => {
    try {
      setIsUploading(true);
      const { successCount } = await uploadServers(parsedServers);
      
      if (successCount > 0) {
        // Clear the parsed data
        resetDialog();
        if (onSuccess) onSuccess();
      }
      
      setIsUploading(false);
    } catch (error) {
      setIsUploading(false);
    }
  };

  const resetDialog = () => {
    setFile(null);
    setParsedServers([]);
    setNewProjects([]);
  };

  // Reset when dialog closes
  React.useEffect(() => {
    if (!dialogOpen) {
      resetDialog();
    }
  }, [dialogOpen]);

  return {
    file,
    isUploading,
    parsedServers,
    parsedData,
    showPreview,
    groupedServers,
    newProjects,
    handleFileChange,
    handleFileSelect,
    handleUpload,
    resetDialog
  };
};
