
// CSV field mappings and field name lookup utilities

export interface CSVFieldMappings {
  [key: string]: string[];
}

// Standard CSV field mappings for VM data
export const csvFieldMappings: CSVFieldMappings = {
  'vm': ['VM', 'vm'],
  'dnsName': ['DNS Name', 'dns_name'],
  'powerstate': ['Powerstate', 'powerstate'],
  'datacenter': ['Datacenter', 'datacenter'],
  'host': ['Host', 'host'],
  'os': ['OS', 'os'],
  'ipAddress': ['IP Address', 'ip_address'],
  'migre': ['Migré', 'migré'],
  'cpus': ['CPUs', 'cpus'],
  'memorySize': ['Memory Size', 'memory_size'],
  'provisionedMB': ['Provisioned MB', 'provisioned_mb'],
  'prod': ['Prod', 'prod'],
  'pca': ['Pca', 'pca'],
  'infra': ['Infra', 'infra'],
  'integration': ['Integration', 'integration'],
  'app': ['App', 'app'],
  'db': ['DB', 'db'],
  'antivirus': ['Antivirus', 'antivirus'],
  'folder': ['Folder', 'folder'],
  'projet': ['projet', 'Projet']
};

// Helper function to find value by checking multiple possible field names
export const findFieldValue = (rawData: any, possibleFields: string[], defaultValue: string = ''): string => {
  // First pass: exact case-sensitive match
  for (const field of possibleFields) {
    if (rawData[field] && String(rawData[field]).trim() !== '' && String(rawData[field]) !== 'undefined') {
      console.log(`Found EXACT match: "${field}" = "${rawData[field]}"`);
      return String(rawData[field]).trim();
    }
  }
  
  // Second pass: case-insensitive match
  const dataKeys = Object.keys(rawData);
  for (const field of possibleFields) {
    for (const key of dataKeys) {
      if (key.toLowerCase() === field.toLowerCase() && rawData[key] && String(rawData[key]).trim() !== '' && String(rawData[key]) !== 'undefined') {
        console.log(`Found case-insensitive match: "${key}" (looking for "${field}") = "${rawData[key]}"`);
        return String(rawData[key]).trim();
      }
    }
  }
  
  console.log(`No value found for any of [${possibleFields.join(', ')}], using default: "${defaultValue}"`);
  return defaultValue;
};
