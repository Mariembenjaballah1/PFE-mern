
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const FileFormatHelp: React.FC = () => {
  return (
    <Card>
      <CardContent className="pt-4">
        <h4 className="font-medium mb-2">File Format Information:</h4>
        <div className="text-sm text-muted-foreground space-y-1">
          <p><strong>Accepted formats:</strong> CSV (.csv), Excel (.xlsx, .xls)</p>
          <p><strong>Project classification:</strong> Use fields like "project", "projet", "environment", "env", "classification"</p>
          <p><strong>Auto project creation:</strong> New projects will be created automatically for unrecognized project names</p>
          <p><strong>Automatic detection:</strong> Common columns like name, location, specs will be automatically recognized</p>
          <p><strong>Flexible naming:</strong> Column names like "Server Name", "server_name", "Name" will all work</p>
          <p><strong>Example columns:</strong> name, location, project, cpu_cores, ram_total, disk_total, assigned_to, etc.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileFormatHelp;
