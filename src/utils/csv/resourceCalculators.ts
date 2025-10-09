
import { findFieldValue } from './fieldMappings';

// Extract and calculate CPU cores
export const calculateCpuCores = (rawData: any): number => {
  const cpuValue = findFieldValue(rawData, ['CPUs', 'cpus', 'CPU', 'cpu', 'Cores', 'cores']);
  const parsed = parseInt(cpuValue);
  return !isNaN(parsed) ? parsed : 4;
};

// Extract and calculate RAM in MB
export const calculateRamMB = (rawData: any): number => {
  const memValue = findFieldValue(rawData, ['Memory Size', 'memory_size', 'Memory', 'memory', 'RAM', 'ram']);
  if (memValue) {
    const memoryStr = memValue.toLowerCase();
    if (memoryStr.includes('gb')) {
      const gbValue = parseFloat(memoryStr.replace(/[^\d.]/g, ''));
      if (!isNaN(gbValue)) return gbValue * 1024;
    } else {
      const mbValue = parseInt(memValue.replace(/[^\d]/g, ''));
      if (!isNaN(mbValue)) return mbValue;
    }
  }
  return 8192;
};

// Extract and calculate disk size in MB
export const calculateDiskMB = (rawData: any): number => {
  const diskValue = findFieldValue(rawData, ['Provisioned MB', 'provisioned_mb', 'Disk', 'disk', 'Storage', 'storage']);
  const parsed = parseInt(diskValue);
  return !isNaN(parsed) ? parsed : 102400;
};
