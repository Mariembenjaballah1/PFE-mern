
import React, { useRef } from 'react';
import { Asset } from '@/types/asset';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';

interface ProjectAssetsChartProps {
  assets: Asset[];
  projectId: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const ProjectAssetsChart: React.FC<ProjectAssetsChartProps> = ({
  assets,
  projectId
}) => {
  const chartRef = useRef<HTMLDivElement>(null);

  const getChartData = () => {
    const statusCount = assets.reduce((acc, asset) => {
      if (!acc[asset.status]) acc[asset.status] = 0;
      acc[asset.status]++;
      return acc;
    }, {});
    
    return Object.entries(statusCount).map(([name, value]) => ({
      name,
      value
    }));
  };

  if (assets.length === 0) return null;

  return (
    <div 
      className="mb-4 h-[200px]" 
      id={`project-assets-chart-${projectId}`} 
      ref={chartRef}
      style={{ 
        display: 'block', 
        visibility: 'visible',
        position: 'relative',
        backgroundColor: '#ffffff',
        border: '1px solid transparent',
        padding: '10px'
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={getChartData()}
            cx="50%"
            cy="50%"
            outerRadius={60}
            fill="#8884d8"
            dataKey="value"
            label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {getChartData().map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
          <Legend 
            wrapperStyle={{
              paddingTop: '10px',
              fontSize: '12px'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
