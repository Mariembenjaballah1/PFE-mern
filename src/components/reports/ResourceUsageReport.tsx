
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, Cpu, Server, HardDrive } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { exportToCSV } from '@/services/reportsService';

interface ResourceData {
  name: string;
  cpu: number;
  memory: number;
  disk: number;
}

const ResourceUsageReport: React.FC = () => {
  const [timeRange, setTimeRange] = useState('week');

  // Mock data - in a real app, this would come from an API
  const resourceData: { [key: string]: ResourceData[] } = {
    day: [
      { name: '12AM', cpu: 14, memory: 22, disk: 55 },
      { name: '4AM', cpu: 8, memory: 15, disk: 30 },
      { name: '8AM', cpu: 35, memory: 45, disk: 42 },
      { name: '12PM', cpu: 78, memory: 65, disk: 58 },
      { name: '4PM', cpu: 92, memory: 75, disk: 62 },
      { name: '8PM', cpu: 48, memory: 52, disk: 68 },
    ],
    week: [
      { name: 'Mon', cpu: 45, memory: 52, disk: 38 },
      { name: 'Tue', cpu: 58, memory: 63, disk: 45 },
      { name: 'Wed', cpu: 72, memory: 54, disk: 51 },
      { name: 'Thu', cpu: 35, memory: 47, disk: 42 },
      { name: 'Fri', cpu: 68, memory: 58, disk: 47 },
      { name: 'Sat', cpu: 25, memory: 38, disk: 35 },
      { name: 'Sun', cpu: 15, memory: 32, disk: 30 },
    ],
    month: [
      { name: 'Week 1', cpu: 42, memory: 51, disk: 45 },
      { name: 'Week 2', cpu: 58, memory: 62, disk: 48 },
      { name: 'Week 3', cpu: 64, memory: 58, disk: 55 },
      { name: 'Week 4', cpu: 55, memory: 65, disk: 50 },
    ],
  };

  const exportReport = async () => {
    const data = resourceData[timeRange].map(item => ({
      period: item.name,
      'CPU Usage (%)': item.cpu,
      'Memory Usage (%)': item.memory,
      'Disk Usage (%)': item.disk
    }));

    // Ensure chart is visible before export
    const chartElement = document.getElementById('resource-usage-chart');
    if (chartElement) {
      const htmlElement = chartElement as HTMLElement;
      htmlElement.style.display = 'block';
      htmlElement.style.visibility = 'visible';
      
      // Wait for chart to be fully rendered
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    await exportToCSV(data, `resource_usage_report_${timeRange}`, 'pdf', 'resource-usage-chart');
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Resource Usage Report</CardTitle>
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Daily</SelectItem>
              <SelectItem value="week">Weekly</SelectItem>
              <SelectItem value="month">Monthly</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={exportReport}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div 
          className="h-96 bg-white" 
          id="resource-usage-chart"
          style={{ 
            display: 'block', 
            visibility: 'visible',
            position: 'relative',
            backgroundColor: '#ffffff'
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={resourceData[timeRange]}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `${value}%`} />
              <Tooltip
                formatter={(value) => [`${value}%`, '']}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                }}
              />
              <Legend 
                formatter={(value) => {
                  return (
                    <span className="flex items-center gap-1 text-xs font-medium">
                      {value === 'cpu' && <Cpu size={12} />}
                      {value === 'memory' && <Server size={12} />}
                      {value === 'disk' && <HardDrive size={12} />}
                      {value === 'cpu' ? 'CPU' : value === 'memory' ? 'Memory' : 'Disk'}
                    </span>
                  );
                }}
              />
              <Bar
                dataKey="cpu"
                name="cpu"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
              />
              <Bar
                dataKey="memory"
                name="memory"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
              />
              <Bar
                dataKey="disk"
                name="disk"
                fill="#8b5cf6"
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResourceUsageReport;
