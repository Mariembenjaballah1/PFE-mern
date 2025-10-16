
import React from 'react';
import { HardDrive, Server, Cpu, Database as DatabaseIcon } from 'lucide-react';

export const getEnvironmentIcon = (env: string) => {
  switch (env.toLowerCase()) {
    case 'production':
    case 'prod':
      return <HardDrive className="h-4 w-4 text-red-600" />;
    case 'pca':
      return <Server className="h-4 w-4 text-blue-600" />;
    case 'integration':
      return <DatabaseIcon className="h-4 w-4 text-purple-600" />;
    case 'infra':
      return <Server className="h-4 w-4 text-orange-600" />;
    case 'app':
      return <Cpu className="h-4 w-4 text-green-600" />;
    case 'db':
      return <DatabaseIcon className="h-4 w-4 text-indigo-600" />;
    default:
      return <Server className="h-4 w-4 text-gray-600" />;
  }
};
