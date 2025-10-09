
export interface UseUploadServersCSVReturn {
  file: File | null;
  isUploading: boolean;
  parsedServers: any[];
  parsedData: any[];
  showPreview: boolean;
  groupedServers: Record<string, any[]>;
  newProjects: string[];
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleFileSelect: (file: File) => Promise<void>;
  handleUpload: (onSuccess?: () => void, onClose?: () => void) => Promise<void>;
  resetDialog: () => void;
}

export interface ServerUploadState {
  file: File | null;
  isUploading: boolean;
  parsedServers: any[];
  newProjects: string[];
}
