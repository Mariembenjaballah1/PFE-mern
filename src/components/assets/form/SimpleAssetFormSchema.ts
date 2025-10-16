
import { z } from 'zod';

export const simpleAssetFormSchema = z.object({
  name: z.string().min(2, { message: 'Asset name must be at least 2 characters.' }),
  category: z.string().min(1, { message: 'Category is required' }),
  status: z.enum(['operational', 'maintenance', 'repair', 'retired']),
  location: z.string().min(1, { message: 'Location is required' }),
  purchaseDate: z.string().min(1, { message: 'Purchase date is required' }),
  assignedTo: z.string().optional(),
  project: z.string().optional(),
  environment: z.string().optional(),
});

export type SimpleAssetFormValues = z.infer<typeof simpleAssetFormSchema>;
