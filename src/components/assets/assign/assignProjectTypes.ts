
import { z } from 'zod';
import { Asset } from '@/types/asset';

export const assignProjectFormSchema = z.object({
  project: z.string().min(1, 'Project selection is required')
});

export type AssignProjectFormValues = z.infer<typeof assignProjectFormSchema>;

export interface AssignProjectFormProps {
  asset: Asset;
  onCancel: () => void;
  onSuccess: () => void;
}
