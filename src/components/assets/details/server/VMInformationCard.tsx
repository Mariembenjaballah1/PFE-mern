
import React from 'react';
import { Server, Monitor, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Asset } from '@/types/asset';
import { useVMData } from './hooks/useVMData';
import VMDebugSection from './components/VMDebugSection';
import VMDataFields from './components/VMDataFields';

interface VMInformationCardProps {
  asset: Asset;
}

const VMInformationCard: React.FC<VMInformationCardProps> = ({ asset }) => {
  const { vmInfo, specs, additionalData, allAvailableFields, getFieldValue } = useVMData(asset);

  return (
    <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white pb-4">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 bg-white/20 rounded-lg">
            <Monitor className="h-6 w-6" />
          </div>
          Virtual Machine Information
          <div className="ml-auto flex items-center gap-2 text-blue-100">
            <Zap className="h-4 w-4" />
            <span className="text-sm font-medium">Live Data</span>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        <VMDebugSection
          allAvailableFields={allAvailableFields}
          vmInfo={vmInfo}
          specs={specs}
          additionalData={additionalData}
        />
        
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
          <VMDataFields getFieldValue={getFieldValue} asset={asset} />
        </div>
      </CardContent>
    </Card>
  );
};

export default VMInformationCard;
