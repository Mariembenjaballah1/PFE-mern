
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Asset } from '@/types/asset';

interface AssetUsageChartProps {
  assets: Asset[];
}

const AssetUsageChart: React.FC<AssetUsageChartProps> = ({ assets }) => {
  // Process the assets data to create chart data
  const categoryData = assets.reduce((acc, asset) => {
    const category = asset.category || 'Unknown';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(categoryData).map(([category, count]) => ({
    name: category,
    count,
    usage: Math.floor(Math.random() * 80) + 20 // Mock usage percentage
  }));

  if (!chartData || chartData.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <p className="text-muted-foreground">No usage data available</p>
      </div>
    );
  }

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12 }}
            interval={0}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis />
          <Tooltip 
            formatter={(value, name) => {
              if (name === 'usage') return [`${value}%`, 'CPU Usage'];
              return [value, 'Count'];
            }}
          />
          <Legend />
          <Bar dataKey="count" fill="#3b82f6" name="Asset Count" />
          <Bar dataKey="usage" fill="#10b981" name="Usage %" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AssetUsageChart;
