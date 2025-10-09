
import { useState } from 'react';

export const useExpandedEnvironments = () => {
  const [expandedEnvironments, setExpandedEnvironments] = useState<string[]>([]);

  const toggleEnvironment = (environment: string) => {
    if (expandedEnvironments.includes(environment)) {
      setExpandedEnvironments(expandedEnvironments.filter(env => env !== environment));
    } else {
      setExpandedEnvironments([...expandedEnvironments, environment]);
    }
  };

  return {
    expandedEnvironments,
    toggleEnvironment
  };
};
