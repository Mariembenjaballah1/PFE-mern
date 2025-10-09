
import React from 'react';
import { CheckCircle, Cpu, MemoryStick, HardDrive } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Asset } from '@/types/asset';

interface ProjectResourcesCardProps {
  asset: Asset;
}

const ProjectResourcesCard: React.FC<ProjectResourcesCardProps> = ({ asset }) => {
  const specs = asset.specs || {};
  const additionalData = asset.additionalData || {};
  
  // Helper function to get project name - fixed to handle string vs object properly
  const getProjectName = () => {
    if (!asset.project) {
      return asset.projectName || 'No Project';
    }
    
    if (typeof asset.project === 'object' && asset.project !== null) {
      return asset.project.name;
    }
    
    if (typeof asset.project === 'string') {
      return asset.project;
    }
    
    return asset.projectName || 'No Project';
  };
  
  // Helper function to safely render project in JSX
  const renderProjectName = () => {
    const projectName = getProjectName();
    return <div className="text-sm">{projectName}</div>;
  };
  
  // Helper function to get value with fallbacks
  const getValue = (primary: any, fallback1: any, fallback2: any, defaultValue: string = 'N/A') => {
    if (primary && String(primary).trim() !== '') return String(primary);
    if (fallback1 && String(fallback1).trim() !== '') return String(fallback1);
    if (fallback2 && String(fallback2).trim() !== '') return String(fallback2);
    return defaultValue;
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <h3 className="text-lg font-medium flex items-center">
          <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
          Project and Resources
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex justify-between items-center">
            <div className="font-medium">Project</div>
            {renderProjectName()}
          </div>
          
          <div className="flex justify-between items-center">
            <div className="font-medium flex items-center">
              <Cpu className="h-4 w-4 mr-2 text-blue-500" />
              CPUs
            </div>
            <div className="text-sm font-mono">
              {getValue(specs.cpu_cores, additionalData.cpus, asset.resources?.cpu, '0')}
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="font-medium flex items-center">
              <MemoryStick className="h-4 w-4 mr-2 text-green-500" />
              Memory Size
            </div>
            <div className="text-sm font-mono">
              {getValue(specs.ram_total, additionalData.memory_size, asset.resources?.ram ? `${asset.resources.ram} MB` : null)}
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="font-medium flex items-center">
              <HardDrive className="h-4 w-4 mr-2 text-purple-500" />
              Provisioned Storage
            </div>
            <div className="text-sm font-mono">
              {getValue(
                specs.disk_total, 
                additionalData.provisioned_mb ? `${Math.round(additionalData.provisioned_mb / 1024)}GB` : null,
                asset.resources?.disk ? `${asset.resources.disk} MB` : null
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectResourcesCard;
