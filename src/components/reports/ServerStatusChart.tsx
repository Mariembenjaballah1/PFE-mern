
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface ServerStatusChartProps {
  serverAssets: any[];
}

const ServerStatusChart: React.FC<ServerStatusChartProps> = ({ serverAssets }) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];
  
  const formatChartData = () => {
    const serversByStatus: Record<string, number> = {};
    serverAssets.forEach(server => {
      if (serversByStatus[server.status]) {
        serversByStatus[server.status]++;
      } else {
        serversByStatus[server.status] = 1;
      }
    });
    
    return Object.entries(serversByStatus).map(([name, value]) => ({
      name,
      value
    }));
  };
  
  return (
    <div 
      className="h-[300px] mt-10" 
      id="server-usage-chart"
      style={{ 
        display: 'block', 
        visibility: 'visible',
        position: 'relative',
        backgroundColor: '#ffffff',
        border: '1px solid transparent',
        padding: '10px'
      }}
    >
      <h3 className="text-lg font-medium mb-3">Server Status Distribution</h3>
      <div style={{ height: 'calc(100% - 40px)' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={formatChartData()}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {formatChartData().map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [`${value} servers`, '']}
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

export default ServerStatusChart;
