
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { createAsset, CreateAssetData } from '@/services/assets/assetBasicOperations';
import { fetchProjects } from '@/services/projectApi';
import { serverFormSchema, ServerFormValues } from './ServerFormSchema';

interface UseServerFormProps {
  onSuccess?: () => void;
}

// Helper function to extract numeric value from text
const extractNumericValue = (value: string): number => {
  if (!value) return 0;
  const numericMatch = value.match(/\d+/);
  return numericMatch ? parseInt(numericMatch[0]) : 0;
};

// Helper function to convert RAM to MB
const convertRamToMB = (ramValue: string): number => {
  if (!ramValue) return 0;
  const numericValue = extractNumericValue(ramValue);
  const lowerValue = ramValue.toLowerCase();
  
  if (lowerValue.includes('gb')) {
    return numericValue * 1024; // Convert GB to MB
  }
  return numericValue; // Assume MB if no unit specified
};

// Helper function to convert disk to MB
const convertDiskToMB = (diskValue: string): number => {
  if (!diskValue) return 0;
  const numericValue = extractNumericValue(diskValue);
  const lowerValue = diskValue.toLowerCase();
  
  if (lowerValue.includes('gb')) {
    return numericValue * 1024; // Convert GB to MB
  } else if (lowerValue.includes('tb')) {
    return numericValue * 1024 * 1024; // Convert TB to MB
  }
  return numericValue; // Assume MB if no unit specified
};

export const useServerForm = ({ onSuccess }: UseServerFormProps) => {
  const { toast } = useToast();

  // Fetch projects
  const { data: projects = [], isLoading: isLoadingProjects } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    staleTime: 60000, // 1 minute
  });

  const form = useForm<ServerFormValues>({
    resolver: zodResolver(serverFormSchema),
    defaultValues: {
      name: '',
      category: 'Servers',
      status: 'operational',
      appId: '',
      dbId: '',
      adminId: '',
      ipAddress: '',
      macAddress: '',
      hostname: '',
      domain: '',
      physicalOrVm: 'Physical',
      dns: '',
      cpu: '',
      ram: '',
      storage: '',
      disk: '',
      networkCard: '',
      os: '',
      osVersion: '',
      version: '',
      location: '',
      assignedTo: '',
      project: 'none',
      environment: 'production',
      services: '',
      ports: '',
      incomingUrl: '',
      outgoingUrl: '',
      accessUrl: '',
      notes: '',
      purchaseDate: new Date().toISOString().split('T')[0],
      serialNumber: '',
      manufacturer: '',
      model: '',
      powerstate: '',
      datacenter: '',
      host: '',
      migre: '',
      cpus: '',
      memorySize: '',
      provisionedMB: '',
    },
  });

  const onSubmit = async (data: ServerFormValues) => {
    try {
      console.log('Server form submission data:', data);
      
      // Calculate resources from hardware specs
      const cpuCores = extractNumericValue(data.cpus || data.cpu);
      const ramMB = convertRamToMB(data.memorySize || data.ram);
      const diskMB = convertDiskToMB(data.provisionedMB || data.disk || data.storage);
      
      console.log('Calculated resources:', { cpuCores, ramMB, diskMB });
      
      const createData: CreateAssetData = {
        name: data.name,
        category: data.category,
        status: data.status,
        location: data.location,
        purchaseDate: data.purchaseDate,
        assignedTo: data.assignedTo || 'Unassigned',
        project: data.project === 'none' ? null : data.project,
        // Add calculated resources
        resources: {
          cpu: cpuCores,
          ram: ramMB,
          disk: diskMB
        },
        additionalData: {
          environment: data.environment || 'production',
          appId: data.appId,
          dbId: data.dbId,
          adminId: data.adminId,
          ipAddress: data.ipAddress,
          macAddress: data.macAddress,
          hostname: data.hostname,
          domain: data.domain,
          physicalOrVm: data.physicalOrVm,
          dns: data.dns,
          cpu: data.cpu,
          ram: data.ram,
          storage: data.storage,
          disk: data.disk,
          networkCard: data.networkCard,
          os: data.os,
          osVersion: data.osVersion,
          version: data.version,
          services: data.services,
          ports: data.ports,
          incomingUrl: data.incomingUrl,
          outgoingUrl: data.outgoingUrl,
          accessUrl: data.accessUrl,
          notes: data.notes,
          serialNumber: data.serialNumber,
          manufacturer: data.manufacturer,
          model: data.model,
        },
        vmInfo: {
          vm: data.name,
          dnsName: data.dns,
          powerstate: data.powerstate || 'poweredOn',
          datacenter: data.datacenter || data.location,
          host: data.host,
          os: data.os,
          ipAddress: data.ipAddress,
          migre: data.migre,
          cpus: data.cpus,
          memorySize: data.memorySize || data.ram,
          provisionedMB: data.provisionedMB || data.disk,
        }
      };
      
      console.log('Creating server asset data with resources:', createData);
      
      const createdAsset = await createAsset(createData);
      console.log('Server asset created successfully:', createdAsset);
      
      toast({
        title: 'Success',
        description: `Server "${data.name}" has been created successfully with calculated resources (CPU: ${cpuCores}, RAM: ${ramMB}MB, Disk: ${diskMB}MB)`,
        variant: 'default'
      });
      
      form.reset();
      
      if (onSuccess) {
        console.log('Calling onSuccess callback');
        onSuccess();
      }
    } catch (error: any) {
      console.error('Server submission error:', error);
      console.error('Error details:', error.response?.data);
      
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          error.message || 
                          'Failed to create server';
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  return {
    form,
    projects,
    isLoadingProjects,
    onSubmit
  };
};
