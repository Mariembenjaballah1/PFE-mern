
import { useState } from 'react';

export const useAssetsHeaderState = () => {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [formType, setFormType] = useState<'general' | 'server'>('general');

  const handleOpenDialog = (type: 'general' | 'server') => {
    setFormType(type);
    setAddDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setAddDialogOpen(false);
  };

  return {
    addDialogOpen,
    setAddDialogOpen,
    formType,
    handleOpenDialog,
    handleCloseDialog
  };
};
