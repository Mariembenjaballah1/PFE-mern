
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useTheme } from 'next-themes';
import { Asset } from '@/types/asset';

interface StatusPieChartProps {
  assets?: Asset[];
}

const StatusPieChart: React.FC<StatusPieChartProps> = ({ assets = [] }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Calculate real status distribution from assets
  const calculateStatusData = () => {
    const statusColors = {
      operational: '#10b981',
      maintenance: '#3b82f6',
      repair: '#f97316',
      retired: '#6b7280',
      inactive: '#ef4444'
    };

    const statusCounts = assets.reduce((acc, asset) => {
      const status = asset.status || 'inactive';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count,
      color: statusColors[status as keyof typeof statusColors] || '#6b7280'
    }));
  };

  const data = calculateStatusData();

  // If no real data, show a message
  if (assets.length === 0) {
    return (
      <Card className="card-gradient animate-scale-in">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Asset Status Overview</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <div className="text-center text-muted-foreground">
            <p className="text-lg mb-2">No asset data available</p>
            <p className="text-sm">Add assets to see status distribution</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-gradient animate-scale-in">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">
          Asset Status Overview ({assets.length} Total)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? "#1f2937" : "#fff",
                  borderColor: isDark ? "#374151" : "#e5e7eb",
                  color: isDark ? "#fff" : "#000"
                }}
                formatter={(value) => [`${value} assets`, ""]}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusPieChart;
