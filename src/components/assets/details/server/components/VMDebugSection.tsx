
import React from 'react';

interface VMDebugSectionProps {
  allAvailableFields: string[];
  vmInfo: Record<string, any>;
  specs: Record<string, any>;
  additionalData: Record<string, any>;
}

const VMDebugSection: React.FC<VMDebugSectionProps> = ({
  allAvailableFields,
  vmInfo,
  specs,
  additionalData
}) => {
  return (
    <>
      {/* Debug section - show what data is available */}
      {allAvailableFields.length === 0 && (
        <div className="bg-red-50 border border-red-200 p-3 rounded text-sm">
          <div className="font-semibold text-red-800 mb-1">No CSV Data Found</div>
          <div className="text-red-700">
            This asset appears to be missing CSV import data. The asset was likely created before the CSV import fixes were implemented.
            <br />
            <strong>Solution:</strong> Delete this asset and re-upload your CSV file to get all the detailed VM information.
          </div>
        </div>
      )}
      
      <div className="bg-gray-50 p-3 rounded text-xs">
        <div className="font-mono mb-2">DEBUG INFO:</div>
        <div>Available fields: {allAvailableFields.length > 0 ? allAvailableFields.join(', ') : 'NONE - Asset needs to be re-uploaded from CSV'}</div>
        <div className="mt-1">VMInfo keys: {Object.keys(vmInfo).length > 0 ? Object.keys(vmInfo).join(', ') : 'EMPTY'}</div>
        <div className="mt-1">Specs keys: {Object.keys(specs).length > 0 ? Object.keys(specs).join(', ') : 'EMPTY'}</div>
        <div className="mt-1">AdditionalData keys: {Object.keys(additionalData).length > 0 ? Object.keys(additionalData).join(', ') : 'EMPTY'}</div>
      </div>
    </>
  );
};

export default VMDebugSection;
