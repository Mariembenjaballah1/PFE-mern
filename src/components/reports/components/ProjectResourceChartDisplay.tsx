
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ResourceType, formatYAxis, getResourceTitle, getBarName, getTooltipUnit } from '../utils/resourceChartUtils';

interface ProjectResourceChartDisplayProps {
  data: any[];
  activeTab: ResourceType;
}

const ProjectResourceChartDisplay: React.FC<ProjectResourceChartDisplayProps> = ({ data, activeTab }) => {
  // Always call hooks at the top level - no conditional hook usage
  const chartData = React.useMemo(() => {
    if (!data || !Array.isArray(data)) {
      console.log('Invalid data provided to chart:', data);
      return [];
    }

    return data.map(project => {
      // Ensure we have valid project data
      if (!project || typeof project !== 'object') {
        console.warn('Invalid project data:', project);
        return null;
      }

      const quota = project.quotas?.[activeTab] || 0;
      const used = project[activeTab] || 0;
      const usagePercentage = quota > 0 ? Math.round((used / quota) * 100) : 0;
      
      return {
        ...project,
        // Ensure name is a string, not an object
        name: typeof project.name === 'string' ? project.name : String(project.name || 'Unknown'),
        fullName: typeof project.fullName === 'string' ? project.fullName : String(project.fullName || project.name || 'Unknown'),
        usagePercentage,
        displayValue: usagePercentage
      };
    }).filter(Boolean); // Remove any null entries
  }, [data, activeTab]);

  if (!chartData.length) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <p className="text-muted-foreground">No project resource data available</p>
      </div>
    );
  }

  return (
    <>
      <div className="text-sm font-medium text-center mb-4">
        {getResourceTitle(activeTab)} - Usage Percentage
      </div>
      
      <div className="h-[300px]" id="dynamic-project-resources-chart">
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
            <YAxis 
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip 
              formatter={(value, name) => {
                const item = chartData.find(d => d.displayValue === value);
                if (item) {
                  const used = item[activeTab] || 0;
                  const quota = item.quotas?.[activeTab] || 0;
                  return [
                    `${value}% (${used}/${quota} ${getTooltipUnit(activeTab)})`,
                    `${activeTab.toUpperCase()} Usage`
                  ];
                }
                return [`${value}%`, `${activeTab.toUpperCase()} Usage`];
              }}
              labelFormatter={(label) => {
                const item = chartData.find(d => d.name === label);
                return item?.fullName || label;
              }}
            />
            <Legend />
            <Bar 
              dataKey="displayValue" 
              fill="#3b82f6" 
              name={`${getBarName(activeTab)} Usage %`}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 text-xs text-muted-foreground text-center">
        Showing real-time resource usage from database across {chartData.length} projects
      </div>
    </>
  );
};

export default ProjectResourceChartDisplay;
