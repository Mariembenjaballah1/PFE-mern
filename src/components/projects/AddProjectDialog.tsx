import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createProject } from '@/services/projectApi';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { motion } from "framer-motion";

interface AddProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const projectFormSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
  status: z.enum(['active', 'on-hold', 'completed', 'cancelled']).default('active'),
  startDate: z.string().refine(
    (date) => !isNaN(Date.parse(date)),
    { message: 'Please enter a valid date' }
  ),
  endDate: z.string().optional(),
  manager: z.string().min(1, 'Manager name is required'),
  department: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).default('medium')
});

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } }
};

const slideUp = {
  hidden: { y: 20, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      ease: "easeOut"
    }
  })
};

export const AddProjectDialog: React.FC<AddProjectDialogProps> = ({
  open,
  onOpenChange,
  onSuccess
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const form = useForm<z.infer<typeof projectFormSchema>>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: '',
      description: '',
      status: 'active',
      startDate: format(new Date(), 'yyyy-MM-dd'),
      manager: '',
      department: '',
      priority: 'medium'
    }
  });
  
  const onSubmit = async (data: z.infer<typeof projectFormSchema>) => {
    setIsSubmitting(true);
    try {
      console.log('Submitting project data:', data);
      
      // Ensure all required fields are defined with non-optional values
      const projectData = {
        name: data.name,
        description: data.description || '',
        status: data.status,
        startDate: data.startDate,
        endDate: data.endDate || undefined,
        manager: data.manager,
        department: data.department || '',
        priority: data.priority
      };
      
      const result = await createProject(projectData);
      console.log('Project created successfully:', result);
      
      toast({
        title: 'Success',
        description: `Project "${data.name}" has been created successfully.`
      });
      
      form.reset({
        name: '',
        description: '',
        status: 'active',
        startDate: format(new Date(), 'yyyy-MM-dd'),
        manager: '',
        department: '',
        priority: 'medium'
      }); // Reset the form with default values
      onSuccess(); // Refetch the projects list
      onOpenChange(false); // Close the dialog
    } catch (error: any) {
      console.error('Failed to create project:', error);
      let errorMessage = 'Failed to create project. Please try again.';
      
      // Handle specific error cases
      if (error.response?.status === 400) {
        errorMessage = 'Invalid project data. Please check all fields.';
      } else if (error.response?.status === 409) {
        errorMessage = 'A project with this name already exists.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg overflow-hidden bg-white dark:bg-gray-800/95 backdrop-blur-sm border border-green-100 dark:border-green-900/50 shadow-xl dark:shadow-green-900/20">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.3 } } }}
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
              Add New Project
            </DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400">
              Enter project details to create a new project.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Project Name*</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter project name" 
                          {...field} 
                          className="transition-all duration-300 focus:ring-2 focus:ring-green-500/40"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Status</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="transition-all duration-300">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="on-hold">On Hold</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Priority</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="transition-all duration-300">
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="manager"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Manager*</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Project manager name" 
                          {...field} 
                          className="transition-all duration-300 focus:ring-2 focus:ring-green-500/40"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Department</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Department" 
                          {...field} 
                          className="transition-all duration-300 focus:ring-2 focus:ring-green-500/40"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Start Date*</FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
                          {...field} 
                          className="transition-all duration-300 focus:ring-2 focus:ring-green-500/40"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">End Date (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
                          {...field} 
                          value={field.value || ''} 
                          className="transition-all duration-300 focus:ring-2 focus:ring-green-500/40"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Provide a brief description" 
                        className="resize-none transition-all duration-300 focus:ring-2 focus:ring-green-500/40"
                        {...field} 
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Create Project'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};
