
import { csvFieldMappings, findFieldValue } from './fieldMappings';

// Build vmInfo object with EXACT CSV field mappings
export const buildVmInfo = (rawData: any): Record<string, any> => {
  const vmInfo: Record<string, any> = {};
  
  // Map each field to vmInfo
  Object.entries(csvFieldMappings).forEach(([vmInfoKey, possibleFields]) => {
    const value = findFieldValue(rawData, possibleFields);
    if (value) {
      vmInfo[vmInfoKey] = value;
      console.log(`Mapped ${vmInfoKey} = "${value}"`);
    }
  });
  
  return vmInfo;
};

// Build specs object with computed values and original CSV data
export const buildSpecs = (rawData: any, name: string, cpuCores: number, ramMB: number, diskMB: number): Record<string, any> => {
  const specs: Record<string, any> = {
    cpu_model: findFieldValue(rawData, ['CPU Model', 'cpu_model', 'Processor', 'processor'], 'Intel Xeon E5-2690 v4'),
    cpu_cores: cpuCores,
    ram_total: `${Math.round(ramMB / 1024)}GB DDR4`,
    ram_type: 'DDR4',
    disk_total: `${Math.round(diskMB / 1024)}GB SSD`,
    disk_type: 'SSD',
    network_throughput: '1Gbps',
    ip_address: findFieldValue(rawData, ['IP Address', 'ip_address', 'IP', 'ip'], `192.168.1.${Math.floor(Math.random() * 254 + 1)}`),
    dns_name: findFieldValue(rawData, ['DNS Name', 'dns_name', 'DNS', 'dns', 'FQDN', 'fqdn'], `${name.toLowerCase().replace(/\s+/g, '-')}.example.com`),
    power_state: findFieldValue(rawData, ['Powerstate', 'powerstate', 'Power State', 'power_state', 'Status', 'status'], 'poweredOn'),
    vm_host: findFieldValue(rawData, ['Host', 'host', 'VM Host', 'vm_host', 'ESX Host', 'esx_host'], 'esxi-host-01.example.com'),
    operating_system: findFieldValue(rawData, ['OS', 'os', 'Operating System', 'operating_system', 'Guest OS', 'guest_os'], 'Ubuntu Server 22.04 LTS')
  };
  
  // Store original CSV field values in specs as well for backward compatibility
  Object.keys(rawData).forEach(exactFieldName => {
    const value = rawData[exactFieldName];
    if (value !== null && value !== undefined && String(value).trim() !== '') {
      specs[exactFieldName] = String(value).trim();
      console.log(`Added original CSV field to specs: "${exactFieldName}" = "${specs[exactFieldName]}"`);
    }
  });
  
  return specs;
};

// Store ALL original CSV data with EXACT field names in additionalData
export const buildAdditionalData = (rawData: any): Record<string, any> => {
  const additionalData: Record<string, any> = {};
  console.log('=== STORING ORIGINAL CSV DATA WITH EXACT FIELD NAMES ===');
  
  Object.keys(rawData).forEach(exactFieldName => {
    const value = rawData[exactFieldName];
    if (value !== null && value !== undefined && String(value).trim() !== '') {
      additionalData[exactFieldName] = String(value).trim();
      console.log(`Stored EXACT field in additionalData: "${exactFieldName}" = "${additionalData[exactFieldName]}"`);
    }
  });
  
  return additionalData;
};
