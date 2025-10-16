
import React from 'react';
import { Control, useWatch } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ServerFormValues } from './ServerFormSchema';
import { Badge } from '@/components/ui/badge';

interface ServerHardwareFieldsProps {
  control: Control<ServerFormValues>;
}

// Helper functions for resource calculation preview
const extractNumericValue = (value: string): number => {
  if (!value) return 0;
  const numericMatch = value.match(/\d+/);
  return numericMatch ? parseInt(numericMatch[0]) : 0;
};

const convertRamToMB = (ramValue: string): number => {
  if (!ramValue) return 0;
  const numericValue = extractNumericValue(ramValue);
  const lowerValue = ramValue.toLowerCase();
  
  if (lowerValue.includes('gb')) {
    return numericValue * 1024;
  }
  return numericValue;
};

const convertDiskToMB = (diskValue: string): number => {
  if (!diskValue) return 0;
  const numericValue = extractNumericValue(diskValue);
  const lowerValue = diskValue.toLowerCase();
  
  if (lowerValue.includes('gb')) {
    return numericValue * 1024;
  } else if (lowerValue.includes('tb')) {
    return numericValue * 1024 * 1024;
  }
  return numericValue;
};

const ServerHardwareFields: React.FC<ServerHardwareFieldsProps> = ({ control }) => {
  // Watch form values for resource calculation preview
  const watchedValues = useWatch({
    control,
    name: ['cpus', 'cpu', 'memorySize', 'ram', 'provisionedMB', 'disk', 'storage']
  });

  const [cpus, cpu, memorySize, ram, provisionedMB, disk, storage] = watchedValues;

  // Calculate preview resources
  const previewCpu = extractNumericValue(cpus || cpu || '');
  const previewRam = convertRamToMB(memorySize || ram || '');
  const previewDisk = convertDiskToMB(provisionedMB || disk || storage || '');

  return (
    <div className="space-y-4">
      <div className="text-lg font-semibold border-b pb-2 pt-4">Hardware & System Details</div>
      
      {/* Resource Preview */}
      {(previewCpu > 0 || previewRam > 0 || previewDisk > 0) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-800 mb-2">Calculated Resources Preview:</h4>
          <div className="flex gap-2 flex-wrap">
            {previewCpu > 0 && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                CPU: {previewCpu} cores
              </Badge>
            )}
            {previewRam > 0 && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                RAM: {previewRam} MB
              </Badge>
            )}
            {previewDisk > 0 && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Disk: {previewDisk} MB
              </Badge>
            )}
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={control}
          name="cpu"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CPU</FormLabel>
              <FormControl>
                <Input placeholder="Intel i7" {...field} />
              </FormControl>
              <FormDescription className="text-xs">
                CPU model/type
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="cpus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CPU Cores *</FormLabel>
              <FormControl>
                <Input placeholder="4" {...field} />
              </FormControl>
              <FormDescription className="text-xs">
                Number of CPU cores (for resource calculation)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="ram"
          render={({ field }) => (
            <FormItem>
              <FormLabel>RAM *</FormLabel>
              <FormControl>
                <Input placeholder="16GB or 16384MB" {...field} />
              </FormControl>
              <FormDescription className="text-xs">
                RAM amount (GB/MB for resource calculation)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={control}
          name="memorySize"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Memory Size (MB)</FormLabel>
              <FormControl>
                <Input placeholder="16384" {...field} />
              </FormControl>
              <FormDescription className="text-xs">
                Alternative RAM field (takes priority over RAM)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="disk"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Disk *</FormLabel>
              <FormControl>
                <Input placeholder="500GB or 512000MB" {...field} />
              </FormControl>
              <FormDescription className="text-xs">
                Disk size (GB/TB/MB for resource calculation)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="provisionedMB"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Provisioned Storage (MB)</FormLabel>
              <FormControl>
                <Input placeholder="512000" {...field} />
              </FormControl>
              <FormDescription className="text-xs">
                Alternative disk field (takes priority over Disk)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="networkCard"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Network Card</FormLabel>
              <FormControl>
                <Input placeholder="RSX" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="os"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Operating System</FormLabel>
              <FormControl>
                <Input placeholder="Linux/Windows" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="powerstate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Power State</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select power state" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="poweredOn">Powered On</SelectItem>
                  <SelectItem value="poweredOff">Powered Off</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="host"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Host/Hypervisor</FormLabel>
              <FormControl>
                <Input placeholder="esx01.domain.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={control}
        name="version"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Version - Port - Path</FormLabel>
            <FormControl>
              <Input placeholder="v1.2.3 - 8080 - /api" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ServerHardwareFields;
