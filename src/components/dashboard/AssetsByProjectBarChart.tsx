
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useTheme } from 'next-themes';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

interface ChartData {
  name: string;
  fullName: string;
  value: number;
}

interface AssetsByProjectBarChartProps {
  chartData: ChartData[];
  totalAssets: number;
}

const AssetsByProjectBarChart: React.FC<AssetsByProjectBarChartProps> = ({ 
  chartData, 
  totalAssets 
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#333" : "#eee"} />
        <XAxis 
          dataKey="name" 
          stroke={isDark ? "#888" : "#666"}
          angle={-45}
          textAnchor="end"
          height={80}
          interval={0}
        />
        <YAxis stroke={isDark ? "#888" : "#666"} />
        <Tooltip
          contentStyle={{
            backgroundColor: isDark ? "#1f2937" : "#fff",
            borderColor: isDark ? "#374151" : "#e5e7eb",
            color: isDark ? "#fff" : "#000"
          }}
          formatter={(value, name, props) => [
            `${value} assets`, 
            props.payload.fullName
          ]}
          labelFormatter={() => ''}
        />
        <Bar dataKey="value" name="Assets">
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default AssetsByProjectBarChart;
