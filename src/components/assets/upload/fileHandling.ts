
import React from 'react';

export const useFileHandling = (
  setFile: React.Dispatch<React.SetStateAction<File | null>>,
  onFileSelect: (file: File) => Promise<void>
) => {
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      await onFileSelect(selectedFile);
    }
  };

  return { handleFileChange };
};
