
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '@/hooks/use-notifications';

const passwordResetSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type PasswordResetFormValues = z.infer<typeof passwordResetSchema>;

const PasswordResetForm: React.FC = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  
  const form = useForm<PasswordResetFormValues>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: PasswordResetFormValues) => {
    try {
      // In a real app, this would call an API to send password reset instructions
      console.log('Sending password reset email to:', data.email);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Password reset instructions sent to your email');
      
      // Send notification to admin
      addNotification({
        type: 'general',
        title: 'Password Reset Requested',
        message: `A password reset was requested for ${data.email}`,
      });
      
      // Redirect to login
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error('Failed to send password reset instructions. Please try again.');
    }
  };

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle>Reset Password</CardTitle>
        <CardDescription>
          Enter your email address and we'll send you instructions to reset your password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="your@email.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Sending...' : 'Send Reset Instructions'}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button variant="link" onClick={() => navigate('/login')}>
          Back to Login
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PasswordResetForm;
