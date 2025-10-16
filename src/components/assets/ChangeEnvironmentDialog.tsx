
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Asset } from '@/types/asset';
import { updateAsset } from '@/services/assets/assetBasicOperations';
import { useToast } from '@/hooks/use-toast';

const environmentSchema = z.object({
  environment: z.string().min(1, { message: 'Environment is required' }),
});

type EnvironmentFormValues = z.infer<typeof environmentSchema>;

interface ChangeEnvironmentDialogProps {
  asset: Asset | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const ChangeEnvironmentDialog: React.FC<ChangeEnvironmentDialogProps> = ({
  asset,
  open,
  onOpenChange,
  onSuccess
}) => {
  const { toast } = useToast();

  const form = useForm<EnvironmentFormValues>({
    resolver: zodResolver(environmentSchema),
    defaultValues: {
      environment: asset?.additionalData?.environment || 'production',
    },
  });

  React.useEffect(() => {
    if (asset) {
      form.reset({
        environment: asset.additionalData?.environment || 'production',
      });
    }
  }, [asset, form]);

  const onSubmit = async (data: EnvironmentFormValues) => {
    if (!asset) return;

    try {
      console.log('Changing environment for asset:', asset.id, 'to:', data.environment);
      
      const assetId = asset.id || asset._id;
      if (!assetId) {
        throw new Error('Asset ID not found');
      }
      
      const updateData = {
        id: assetId as string,
        additionalData: {
          ...asset.additionalData,
          environment: data.environment
        }
      };

      await updateAsset(updateData);
      
      toast({
        title: 'Success',
        description: `Environment changed to ${data.environment}`,
        variant: 'default'
      });
      
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Environment change error:', error);
      
      toast({
        title: 'Error',
        description: error.message || 'Failed to change environment',
        variant: 'destructive',
      });
    }
  };

  if (!asset) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change Environment</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="environment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Environment</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select environment" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="production">Production</SelectItem>
                      <SelectItem value="development">Development</SelectItem>
                      <SelectItem value="testing">Testing</SelectItem>
                      <SelectItem value="staging">Staging</SelectItem>
                      <SelectItem value="integration">Integration</SelectItem>
                      <SelectItem value="preproduction">Pre-production</SelectItem>
                      <SelectItem value="qualification">Qualification</SelectItem>
                      <SelectItem value="recette">Recette</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeEnvironmentDialog;
