
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

interface AssetDistributionChartsProps {
  assetsByCategory: Record<string, number>;
  assetsByStatus: Record<string, number>;
  assetsByProject: Record<string, number>;
  totalAssets: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658'];

const AssetDistributionCharts: React.FC<AssetDistributionChartsProps> = ({
  assetsByCategory,
  assetsByStatus,
  assetsByProject,
  totalAssets
}) => {
  // Prepare data for charts, filtering out empty or "Unknown" entries
  const categoryData = Object.entries(assetsByCategory)
    .filter(([key, value]) => key && key !== 'Unknown' && key !== '' && value > 0)
    .map(([name, value]) => ({ name, value, percentage: totalAssets > 0 ? Math.round((value / totalAssets) * 100) : 0 }));

  const statusData = Object.entries(assetsByStatus)
    .filter(([key, value]) => key && key !== 'Unknown' && key !== '' && value > 0)
    .map(([name, value]) => ({ name, value, percentage: totalAssets > 0 ? Math.round((value / totalAssets) * 100) : 0 }));

  const projectData = Object.entries(assetsByProject)
    .filter(([key, value]) => key && key !== 'Unknown' && key !== '' && value > 0)
    .map(([name, value]) => ({ name, value, percentage: totalAssets > 0 ? Math.round((value / totalAssets) * 100) : 0 }));

  return (
    <div className="space-y-8">
      {categoryData.length > 0 && (
        <div>
          <h4 className="font-medium mb-4 text-lg">Assets by Category</h4>
          <div id="assets-by-category-chart" className="w-full h-80 bg-white p-4 border rounded-lg" style={{ display: 'block', visibility: 'visible' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value: any) => {
                    const dataPoint = categoryData.find(d => d.value === value);
                    return [`${value} assets (${dataPoint?.percentage}%)`, 'Count'];
                  }}
                />
                <Bar dataKey="value" fill="#0088FE" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {statusData.length > 0 && (
        <div>
          <h4 className="font-medium mb-4 text-lg">Assets by Status</h4>
          <div id="assets-by-status-chart" className="w-full h-80 bg-white p-4 border rounded-lg" style={{ display: 'block', visibility: 'visible' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [`${value} assets`, 'Count']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {projectData.length > 0 && (
        <div>
          <h4 className="font-medium mb-4 text-lg">Assets by Project</h4>
          <div id="assets-by-project-chart" className="w-full h-80 bg-white p-4 border rounded-lg" style={{ display: 'block', visibility: 'visible' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value: any) => {
                    const dataPoint = projectData.find(d => d.value === value);
                    return [`${value} assets (${dataPoint?.percentage}%)`, 'Count'];
                  }}
                />
                <Bar dataKey="value" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {categoryData.length === 0 && statusData.length === 0 && projectData.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No chart data available. Assets may need proper categorization, status, or project assignment.</p>
        </div>
      )}
    </div>
  );
};

export default AssetDistributionCharts;
