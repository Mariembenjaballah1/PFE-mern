
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useTheme } from 'next-themes';
import { Cpu } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

interface CPUChartData {
  name: string;
  fullName: string;
  cpu: number;
}

interface AssetsByProjectCPUChartProps {
  chartData: CPUChartData[];
  totalCPU: number;
}

const AssetsByProjectCPUChart: React.FC<AssetsByProjectCPUChartProps> = ({ 
  chartData, 
  totalCPU 
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Cpu className="h-5 w-5 text-blue-600" />
          <p className="text-2xl font-bold text-primary">{totalCPU}</p>
        </div>
        <p className="text-sm text-muted-foreground">Total CPU Cores Allocated</p>
      </div>
      <div 
        className="w-full h-[300px]" 
        id="assets-by-project-cpu-chart"
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
                `${value} cores`, 
                props.payload.fullName
              ]}
              labelFormatter={() => ''}
            />
            <Bar dataKey="cpu" name="CPU Cores">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AssetsByProjectCPUChart;
