import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { AssignProjectFormValues } from './assignProjectTypes';

interface ResourceAllocationFieldsProps {
  form: UseFormReturn<AssignProjectFormValues>;
}

// This component is no longer needed since quotas have been removed
// Keeping as empty component to prevent breaking changes
const ResourceAllocationFields: React.FC<ResourceAllocationFieldsProps> = () => {
  return null;
};

export default ResourceAllocationFields;
