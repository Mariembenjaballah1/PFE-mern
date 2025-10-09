
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Asset } from '@/types/asset';
import { updateAsset, UpdateAssetData } from '@/services/assets/assetBasicOperations';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { fetchUsers } from '@/services/api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const formSchema = z.object({
  assignedTo: z.string().min(1, 'Assigned user is required'),
});

interface AssignAssetFormProps {
  asset: Asset;
  onCancel: () => void;
  onSuccess: () => void;
}

const AssignAssetForm: React.FC<AssignAssetFormProps> = ({ asset, onCancel, onSuccess }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      assignedTo: asset.assignedTo || '',
    },
  });

  // Fetch users for dropdown
  const { data: users = [], isLoading: isLoadingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    staleTime: 60000, // 1 minute
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const assetId = asset.id || asset._id;
      if (!assetId) {
        throw new Error('Asset ID not found');
      }
      
      const updateData: UpdateAssetData = { 
        id: assetId as string,
        assignedTo: data.assignedTo 
      };
      
      await updateAsset(updateData);
      toast({
        title: 'Success',
        description: `Asset assigned successfully`,
      });
      onSuccess();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to assign asset',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Assign Asset</h3>
          <p className="text-sm text-muted-foreground">
            Select a user to assign this asset to
          </p>
          
          <FormField
            control={form.control}
            name="assignedTo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assigned To</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value || "unassigned"}
                  disabled={isSubmitting || isLoadingUsers}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a user" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {isLoadingUsers ? (
                      <SelectItem value="loading-users">Loading users...</SelectItem>
                    ) : (
                      users.map((user: any) => (
                        <SelectItem key={user._id} value={user.name || user._id}>
                          {user.name} - {user.department}
                        </SelectItem>
                      ))
                    )}
                    {!isLoadingUsers && users.length === 0 && (
                      <SelectItem value="no-users-found">No users found</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Assigning...' : 'Assign Asset'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AssignAssetForm;
