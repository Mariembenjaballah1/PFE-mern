import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { updateAsset, UpdateAssetData } from '@/services/assets/assetBasicOperations';
import { fetchProjects } from '@/services/projectApi';
import { serverFormSchema, ServerFormValues } from './ServerFormSchema';
import { Asset } from '@/types/asset';
import { useEffect } from 'react';

interface UseServerEditFormProps {
  onSuccess?: () => void;
  initialData?: Asset;
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

// Helper function to get project ID as string
const getProjectId = (project: string | { _id: string; name: string } | { id: string; name: string } | null): string => {
  if (!project) return 'none';
  if (typeof project === 'string') return project;
  if ('_id' in project) return project._id;
  if ('id' in project) return project.id;
  return 'none';
};

export const useServerEditForm = ({ onSuccess, initialData }: UseServerEditFormProps) => {
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
      environment: '',
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

  // Populate form with initial data
  useEffect(() => {
    if (initialData) {
      console.log('Populating server edit form with data:', initialData);
      
      const vmInfo = initialData.vmInfo || {};
      const additionalData = initialData.additionalData || {};
      const specs = initialData.specs || {};
      
      const formData: ServerFormValues = {
        name: initialData.name,
        category: initialData.category,
        status: initialData.status,
        location: initialData.location,
        purchaseDate: new Date(initialData.purchaseDate).toISOString().split('T')[0],
        assignedTo: initialData.assignedTo || 'Unassigned',
        project: getProjectId(initialData.project),
        
        // Server IDs
        appId: additionalData.appId || '',
        dbId: additionalData.dbId || '',
        adminId: additionalData.adminId || '',
        
        // Network Information
        ipAddress: vmInfo.ipAddress || additionalData['IP Address'] || additionalData.ipAddress || '',
        macAddress: additionalData.macAddress || '',
        hostname: additionalData.hostname || '',
        domain: additionalData.domain || '',
        physicalOrVm: additionalData.physicalOrVm || 'VM',
        dns: vmInfo.dnsName || additionalData['DNS Name'] || additionalData.dns || '',
        
        // Hardware Specifications
        cpu: specs.cpu_model || additionalData.cpu || '',
        ram: specs.ram_total || additionalData.ram || '',
        storage: specs.disk_total || additionalData.storage || '',
        disk: additionalData.disk || '',
        networkCard: additionalData.networkCard || '',
        os: vmInfo.os || additionalData['OS'] || additionalData.os || '',
        osVersion: additionalData.osVersion || '',
        version: additionalData.version || '',
        
        // Environment
        environment: additionalData.environment || '',
        
        // Service Information
        services: additionalData.services || '',
        ports: additionalData.ports || '',
        incomingUrl: additionalData.incomingUrl || '',
        outgoingUrl: additionalData.outgoingUrl || '',
        accessUrl: additionalData.accessUrl || '',
        notes: additionalData.notes || '',
        
        // Additional fields
        serialNumber: additionalData.serialNumber || '',
        manufacturer: additionalData.manufacturer || '',
        model: additionalData.model || '',
        
        // VM-specific fields
        powerstate: vmInfo.powerstate || additionalData['Powerstate'] || '',
        datacenter: vmInfo.datacenter || additionalData['Datacenter'] || '',
        host: vmInfo.host || additionalData['Host'] || '',
        migre: vmInfo.migre || additionalData['Migré'] || '',
        cpus: vmInfo.cpus || additionalData['CPUs'] || '',
        memorySize: vmInfo.memorySize || additionalData['Memory Size'] || '',
        provisionedMB: vmInfo.provisionedMB || additionalData['Provisioned MB'] || '',
      };
      
      console.log('Setting form data:', formData);
      form.reset(formData);
    }
  }, [form, initialData]);

  const onSubmit = async (data: ServerFormValues) => {
    if (!initialData) return;
    
    try {
      console.log('Server edit form submission data:', data);
      
      // Calculate resources from hardware specs
      const cpuCores = extractNumericValue(data.cpus || data.cpu);
      const ramMB = convertRamToMB(data.memorySize || data.ram);
      const diskMB = convertDiskToMB(data.provisionedMB || data.disk || data.storage);
      
      console.log('Calculated resources:', { cpuCores, ramMB, diskMB });
      
      const updateData: UpdateAssetData = {
        id: initialData.id || initialData._id || '',
        name: data.name,
        category: data.category,
        status: data.status,
        location: data.location,
        purchaseDate: data.purchaseDate,
        assignedTo: data.assignedTo || 'Unassigned',
        project: data.project === 'none' ? null : data.project,
        // Update calculated resources
        resources: {
          cpu: cpuCores,
          ram: ramMB,
          disk: diskMB
        },
        additionalData: {
          environment: data.environment,
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
          // Keep existing data and add new/updated fields
          ...initialData.additionalData,
          // VM field mappings for consistency
          'IP Address': data.ipAddress,
          'DNS Name': data.dns,
          'OS': data.os,
          'Powerstate': data.powerstate,
          'Datacenter': data.datacenter,
          'Host': data.host,
          'Migré': data.migre,
          'CPUs': data.cpus,
          'Memory Size': data.memorySize,
          'Provisioned MB': data.provisionedMB,
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
          // Keep existing vmInfo data
          ...initialData.vmInfo,
        },
        specs: {
          cpu_model: data.cpu,
          cpu_cores: cpuCores,
          ram_total: data.ram,
          disk_total: data.storage,
          ip_address: data.ipAddress,
          dns_name: data.dns,
          power_state: data.powerstate,
          vm_host: data.host,
          operating_system: data.os,
          // Keep existing specs data
          ...initialData.specs,
          // Update with new values
          VM: data.name,
          'DNS Name': data.dns,
          'Powerstate': data.powerstate,
          'Datacenter': data.datacenter,
          'Host': data.host,
          'OS': data.os,
          'IP Address': data.ipAddress,
          'Migré': data.migre,
          'CPUs': data.cpus,
          'Memory Size': data.memorySize,
          'Provisioned MB': data.provisionedMB,
        }
      };
      
      console.log('Updating server asset with data:', updateData);
      
      const updatedAsset = await updateAsset(updateData);
      console.log('Server asset updated successfully:', updatedAsset);
      
      toast({
        title: 'Success',
        description: `Server "${data.name}" has been updated successfully`,
        variant: 'default'
      });
      
      if (onSuccess) {
        console.log('Calling onSuccess callback');
        onSuccess();
      }
    } catch (error: any) {
      console.error('Server update error:', error);
      console.error('Error details:', error.response?.data);
      
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          error.message || 
                          'Failed to update server';
      
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
