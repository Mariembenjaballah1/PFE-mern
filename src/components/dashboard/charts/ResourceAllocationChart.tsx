
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useTheme } from 'next-themes';

interface ResourceData {
  name: string;
  fullName: string;
  cpuAllocated: number;
  cpuUsed: number;
  cpuPercentage: number;
  ramAllocated: number;
  ramUsed: number;
  ramPercentage: number;
  diskAllocated: number;
  diskUsed: number;
  diskPercentage: number;
  assetCount: number;
}

interface ResourceAllocationChartProps {
  data: ResourceData[];
}

const ResourceAllocationChart: React.FC<ResourceAllocationChartProps> = ({ data }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#333" : "#eee"} />
        <XAxis dataKey="name" stroke={isDark ? "#888" : "#666"} />
        <YAxis stroke={isDark ? "#888" : "#666"} />
        <Tooltip
          contentStyle={{
            backgroundColor: isDark ? "#1f2937" : "#fff",
            borderColor: isDark ? "#374151" : "#e5e7eb",
            color: isDark ? "#fff" : "#000"
          }}
          formatter={(value, name, props) => {
            const project = props.payload;
            if (name === 'cpuPercentage') return [`${value}% (${project.cpuUsed}/${project.cpuAllocated} cores)`, 'CPU Usage'];
            if (name === 'ramPercentage') return [`${value}% (${project.ramUsed}/${project.ramAllocated} GB)`, 'RAM Usage'];
            if (name === 'diskPercentage') return [`${value}% (${project.diskUsed}/${project.diskAllocated} GB)`, 'Disk Usage'];
            return [value, name];
          }}
          labelFormatter={(label) => {
            const project = data.find(p => p.name === label);
            return `${project?.fullName || label} (${project?.assetCount || 0} assets)`;
          }}
        />
        <Legend />
        <Bar dataKey="cpuPercentage" fill="#3b82f6" name="CPU Usage %" />
        <Bar dataKey="ramPercentage" fill="#10b981" name="RAM Usage %" />
        <Bar dataKey="diskPercentage" fill="#f97316" name="Disk Usage %" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ResourceAllocationChart;
