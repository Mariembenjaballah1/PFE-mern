
import React from 'react';
import { Zap, Network, Server, HardDrive, Cpu, Database, Globe, Shield, Settings } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Asset } from '@/types/asset';
import VMFieldRow from './VMFieldRow';

interface VMDataFieldsProps {
  getFieldValue: (primaryFields: string[], fallbacks?: string[], defaultValue?: string) => string;
  asset: Asset;
}

const VMDataFields: React.FC<VMDataFieldsProps> = ({ getFieldValue, asset }) => {
  const renderPowerStateBadge = (powerState: string) => {
    const isOn = powerState.toLowerCase().includes('poweredon') || powerState.toLowerCase().includes('on');
    return (
      <Badge 
        variant={isOn ? 'outline' : 'secondary'}
        className={`${isOn 
          ? 'border-green-500 text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-400' 
          : 'border-gray-400 text-gray-600 bg-gray-50 dark:bg-gray-800 dark:text-gray-400'
        } font-medium px-3 py-1 shadow-sm`}
      >
        <div className={`w-2 h-2 rounded-full mr-2 ${isOn ? 'bg-green-500' : 'bg-gray-400'}`} />
        {powerState}
      </Badge>
    );
  };

  const renderProductionBadge = (prodValue: string) => {
    const isProd = prodValue.toLowerCase() === 'yes' || prodValue.toLowerCase() === 'true';
    return (
      <Badge 
        variant={isProd ? 'outline' : 'secondary'}
        className={`${isProd 
          ? 'border-red-500 text-red-700 bg-red-50 dark:bg-red-900/20 dark:text-red-400' 
          : 'border-blue-400 text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400'
        } font-medium px-3 py-1 shadow-sm`}
      >
        {isProd ? '🔴 Production' : '🔵 Non-Production'}
      </Badge>
    );
  };

  const renderEnvironmentBadge = (value: string) => (
    <Badge 
      variant="outline" 
      className="border-purple-400 text-purple-700 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400 font-medium px-3 py-1 shadow-sm"
    >
      {value}
    </Badge>
  );

  return (
    <div className="space-y-8">
      {/* System Information Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
          <Server className="h-5 w-5 text-blue-600" />
          <h4 className="font-semibold text-gray-900 dark:text-gray-100">System Information</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <VMFieldRow
            label="VM Name"
            value={getFieldValue(['vm'], ['VM', 'Name', 'name', 'hostname'], asset.name)}
            icon={<Server className="h-4 w-4 mr-2 text-blue-500" />}
            isMono
          />
          
          <VMFieldRow
            label="DNS Name"
            value={getFieldValue(['dnsName'], ['DNS Name', 'dns_name', 'DNS', 'FQDN', 'fqdn'])}
            icon={<Globe className="h-4 w-4 mr-2 text-green-500" />}
            isMono
          />
          
          <VMFieldRow
            label="Power State"
            value={getFieldValue(['powerstate'], ['Powerstate', 'Power State', 'power_state', 'Status', 'status'], 'Unknown')}
            icon={<Zap className="h-4 w-4 mr-2 text-yellow-500" />}
            renderBadge={renderPowerStateBadge}
          />
          
          <VMFieldRow
            label="Operating System"
            value={getFieldValue(['os'], ['OS', 'operating_system', 'Operating System', 'Guest OS', 'guest_os'])}
            icon={<Settings className="h-4 w-4 mr-2 text-gray-500" />}
          />
        </div>
      </div>

      {/* Location & Network Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
          <Network className="h-5 w-5 text-green-600" />
          <h4 className="font-semibold text-gray-900 dark:text-gray-100">Location & Network</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <VMFieldRow
            label="Datacenter"
            value={getFieldValue(['datacenter'], ['Datacenter', 'Location', 'location', 'Site', 'site'], asset.location)}
            icon={<HardDrive className="h-4 w-4 mr-2 text-orange-500" />}
          />
          
          <VMFieldRow
            label="Host"
            value={getFieldValue(['host'], ['Host', 'vm_host', 'ESX Host', 'esx_host', 'Hypervisor', 'hypervisor'])}
            icon={<Server className="h-4 w-4 mr-2 text-purple-500" />}
            isMono
          />
          
          <VMFieldRow
            label="IP Address"
            value={getFieldValue(['ipAddress'], ['IP Address', 'ip_address', 'IP', 'ip', 'Primary IP', 'primary_ip'])}
            icon={<Network className="h-4 w-4 mr-2 text-blue-500" />}
            isMono
          />
          
          <VMFieldRow
            label="Migration Status"
            value={getFieldValue(['migre'], ['Migré', 'migré', 'migrated', 'Migration', 'Migration Status', 'migration_status'])}
            icon={<Settings className="h-4 w-4 mr-2 text-indigo-500" />}
          />
        </div>
      </div>

      {/* Resource Allocation Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
          <Cpu className="h-5 w-5 text-purple-600" />
          <h4 className="font-semibold text-gray-900 dark:text-gray-100">Resource Allocation</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <VMFieldRow
            label="CPU Cores"
            value={getFieldValue(['cpus'], ['CPUs', 'CPU Count', 'cpu_count', 'Cores', 'cores'], asset.resources?.cpu?.toString() || '0')}
            icon={<Cpu className="h-4 w-4 mr-2 text-blue-500" />}
          />
          
          <VMFieldRow
            label="Memory Size"
            value={getFieldValue(['memorySize'], ['Memory Size', 'memory_size', 'RAM', 'ram', 'Memory', 'memory'], asset.resources?.ram ? `${Math.round(asset.resources.ram / 1024)}GB` : 'N/A')}
            icon={<HardDrive className="h-4 w-4 mr-2 text-green-500" />}
          />
          
          <VMFieldRow
            label="Storage"
            value={getFieldValue(['provisionedMB'], ['Provisioned MB', 'provisioned_mb', 'Storage', 'storage', 'Disk Size', 'disk_size'], asset.resources?.disk ? `${Math.round(asset.resources.disk / 1024)}GB` : '0')}
            icon={<Database className="h-4 w-4 mr-2 text-orange-500" />}
          />
        </div>
      </div>

      {/* Environment Configuration Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
          <Shield className="h-5 w-5 text-red-600" />
          <h4 className="font-semibold text-gray-900 dark:text-gray-100">Environment Configuration</h4>
        </div>
        
        {/* Main Environment Field */}
        <div className="mb-4">
          <VMFieldRow
            label="Environment"
            value={getFieldValue(['environment'], ['Environment', 'env', 'ENV'], 'Not specified')}
            icon={<Settings className="h-4 w-4 mr-2 text-purple-500" />}
            renderBadge={(value: string) => (
              <Badge 
                variant="outline" 
                className="border-purple-500 text-purple-700 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400 font-medium px-3 py-1 shadow-sm"
              >
                🌐 {value}
              </Badge>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <VMFieldRow
            label="Production Environment"
            value={getFieldValue(['prod'], ['Prod', 'production', 'Production'])}
            renderBadge={renderProductionBadge}
          />
          
          <VMFieldRow
            label="PCA Environment"
            value={getFieldValue(['pca'], ['Pca', 'PCA'])}
            renderBadge={renderEnvironmentBadge}
          />
          
          <VMFieldRow
            label="Integration Environment"
            value={getFieldValue(['integration'], ['Integration'])}
            renderBadge={renderEnvironmentBadge}
          />
          
          <VMFieldRow
            label="Infrastructure Role"
            value={getFieldValue(['infra'], ['Infra', 'infrastructure', 'Infrastructure'])}
            renderBadge={renderEnvironmentBadge}
          />
          
          <VMFieldRow
            label="Application Role"
            value={getFieldValue(['app'], ['App', 'application', 'Application'])}
            renderBadge={renderEnvironmentBadge}
          />
          
          <VMFieldRow
            label="Database Role"
            value={getFieldValue(['db'], ['DB', 'database', 'Database'])}
            renderBadge={renderEnvironmentBadge}
          />
        </div>
        
        <div className="pt-2">
          <VMFieldRow
            label="Antivirus Protection"
            value={getFieldValue(['antivirus'], ['Antivirus'])}
            icon={<Shield className="h-4 w-4 mr-2 text-green-500" />}
            renderBadge={renderEnvironmentBadge}
          />
        </div>
      </div>
    </div>
  );
};

export default VMDataFields;
