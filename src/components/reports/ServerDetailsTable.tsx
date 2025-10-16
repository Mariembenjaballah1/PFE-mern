
import React from 'react';

interface ServerDetailsTableProps {
  serverAssets: any[];
}

const ServerDetailsTable: React.FC<ServerDetailsTableProps> = ({ serverAssets }) => {
  return (
    <div className="mt-10">
      <h3 className="text-lg font-medium mb-3">Server Details</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted">
              <th className="p-2 text-left">Server Name</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Location</th>
              <th className="p-2 text-left">Project</th>
              <th className="p-2 text-right">CPU (cores)</th>
              <th className="p-2 text-right">RAM (GB)</th>
              <th className="p-2 text-right">Disk (GB)</th>
            </tr>
          </thead>
          <tbody>
            {serverAssets.map((server) => (
              <tr key={server.id} className="border-b">
                <td className="p-2">{server.name || 'Unknown'}</td>
                <td className="p-2">
                  <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold
                    ${server.status === 'operational' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                      server.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                    {server.status || 'Unknown'}
                  </div>
                </td>
                <td className="p-2">{server.location || 'Unknown'}</td>
                <td className="p-2">
                  {server.projectName || 
                   (server.project && typeof server.project === 'object' ? server.project.name : 
                   (typeof server.project === 'string' ? server.project : 'Unassigned'))}
                </td>
                <td className="p-2 text-right">{server.resources?.cpu || 0}</td>
                <td className="p-2 text-right">{server.resources?.ram || 0}</td>
                <td className="p-2 text-right">{server.resources?.disk || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ServerDetailsTable;
