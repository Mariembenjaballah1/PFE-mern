
import { z } from 'zod';

export const assetFormSchema = z.object({
  name: z.string().min(2, { message: 'Asset name must be at least 2 characters' }),
  category: z.string().min(2, { message: 'Category is required' }),
  status: z.enum(['operational', 'maintenance', 'repair', 'retired']),
  location: z.string().min(2, { message: 'Location is required' }),
  purchaseDate: z.string().min(1, { message: 'Purchase date is required' }),
  assignedTo: z.string().optional(),
  project: z.string().optional(),
});

export type AssetFormValues = z.infer<typeof assetFormSchema>;
