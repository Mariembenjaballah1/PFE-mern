
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useTheme } from 'next-themes';

interface UsageTrend {
  name: string;
  cpu: number;
  ram: number;
  disk: number;
}

interface UsageTrendsChartProps {
  data: UsageTrend[];
}

const UsageTrendsChart: React.FC<UsageTrendsChartProps> = ({ data }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#333" : "#eee"} />
        <XAxis dataKey="name" stroke={isDark ? "#888" : "#666"} />
        <YAxis stroke={isDark ? "#888" : "#666"} />
        <Tooltip
          contentStyle={{
            backgroundColor: isDark ? "#1f2937" : "#fff",
            borderColor: isDark ? "#374151" : "#e5e7eb",
            color: isDark ? "#fff" : "#000"
          }}
          formatter={(value) => [`${value}%`, ""]}
        />
        <Legend />
        <Area
          type="monotone"
          dataKey="cpu"
          stackId="1"
          stroke="#3b82f6"
          fill="#3b82f6"
          fillOpacity={0.6}
          name="CPU Usage %"
        />
        <Area
          type="monotone"
          dataKey="ram"
          stackId="1"
          stroke="#10b981"
          fill="#10b981"
          fillOpacity={0.6}
          name="RAM Usage %"
        />
        <Area
          type="monotone"
          dataKey="disk"
          stackId="1"
          stroke="#f97316"
          fill="#f97316"
          fillOpacity={0.6}
          name="Disk Usage %"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default UsageTrendsChart;
