
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

interface ChartData {
  name: string;
  fullName: string;
  value: number;
}

interface AssetsByProjectChartProps {
  chartData: ChartData[];
  totalAssets: number;
}

const AssetsByProjectChart: React.FC<AssetsByProjectChartProps> = ({ 
  chartData, 
  totalAssets 
}) => {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-2xl font-bold text-primary">{totalAssets}</p>
        <p className="text-sm text-muted-foreground">Total Assets Assigned</p>
      </div>
      <div 
        className="w-full h-[300px]" 
        id="assets-by-project-chart"
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
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value, name, props) => [
                `${value} assets`, 
                props.payload.fullName
              ]} 
              labelFormatter={() => ''}
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
            <Legend 
              wrapperStyle={{
                paddingTop: '10px'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AssetsByProjectChart;
