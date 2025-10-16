
// Field mapping and normalization utilities for CSV data processing

export const normalizeFieldName = (fieldName: string): string => {
  return fieldName.trim().toLowerCase().replace(/\s+/g, '_');
};

export const normalizeDataFields = (data: any): any => {
  const normalizedData: any = {};
  Object.keys(data).forEach(key => {
    const normalizedKey = normalizeFieldName(key);
    normalizedData[normalizedKey] = data[key];
  });
  return normalizedData;
};

export const extractServerName = (normalizedData: any): string => {
  return normalizedData.vm || 
         normalizedData.name || 
         normalizedData.server_name || 
         normalizedData.asset_name || 
         normalizedData.hostname ||
         normalizedData.dns_name ||
         `Server-${Date.now()}`;
};

export const extractLocation = (normalizedData: any): string => {
  return normalizedData.datacenter || 
         normalizedData.location || 
         normalizedData.site || 
         normalizedData.data_center ||
         normalizedData.host ||
         'Unknown Location';
};

export const extractPurchaseDate = (normalizedData: any): string => {
  return normalizedData.purchase_date || 
         normalizedData.purchasedate || 
         normalizedData.date_purchased ||
         normalizedData.acquired_date ||
         new Date().toISOString().split('T')[0];
};

export const extractProjectName = (normalizedData: any): string | null => {
  return normalizedData.projet || 
         normalizedData.project || 
         normalizedData.project_name ||
         normalizedData.environment ||
         normalizedData.env ||
         normalizedData.classification ||
         normalizedData.type ||
         // Check for environment indicators
         (normalizedData.prod && normalizedData.prod.toLowerCase() === 'true' ? 'Production' : null) ||
         (normalizedData.pca && normalizedData.pca.toLowerCase() === 'true' ? 'PCA' : null) ||
         (normalizedData.infra && normalizedData.infra.toLowerCase() === 'true' ? 'Infrastructure' : null) ||
         (normalizedData.integration && normalizedData.integration.toLowerCase() === 'true' ? 'Integration' : null) ||
         (normalizedData.app && normalizedData.app.toLowerCase() === 'true' ? 'Application' : null) ||
         (normalizedData.db && normalizedData.db.toLowerCase() === 'true' ? 'Database' : null) ||
         null;
};

export const extractServerSpecs = (normalizedData: any): any => {
  const specs: any = {};
  
  // CPU information
  if (normalizedData.cpus) specs.cpu_cores = parseInt(normalizedData.cpus) || 0;
  if (normalizedData.cpu_cores) specs.cpu_cores = parseInt(normalizedData.cpu_cores) || 0;
  if (normalizedData.cpu_model) specs.cpu_model = normalizedData.cpu_model;
  
  // Memory information
  if (normalizedData.memory_size) specs.ram_total = normalizedData.memory_size;
  if (normalizedData.ram_total || normalizedData.memory) specs.ram_total = normalizedData.ram_total || normalizedData.memory;
  if (normalizedData.ram_type || normalizedData.memory_type) specs.ram_type = normalizedData.ram_type || normalizedData.memory_type;
  
  // Disk information
  if (normalizedData.provisioned_mb) specs.disk_total = normalizedData.provisioned_mb + ' MB';
  if (normalizedData.disk_total || normalizedData.storage) specs.disk_total = normalizedData.disk_total || normalizedData.storage;
  if (normalizedData.disk_type || normalizedData.storage_type) specs.disk_type = normalizedData.disk_type || normalizedData.storage_type;
  
  // Network information
  if (normalizedData.ip_address) specs.ip_address = normalizedData.ip_address;
  if (normalizedData.dns_name) specs.dns_name = normalizedData.dns_name;
  if (normalizedData.network_throughput) specs.network_throughput = normalizedData.network_throughput;
  
  // VM-specific information
  if (normalizedData.powerstate || normalizedData.power_state) specs.power_state = normalizedData.powerstate || normalizedData.power_state;
  if (normalizedData.host || normalizedData.vm_host) specs.vm_host = normalizedData.host || normalizedData.vm_host;
  if (normalizedData.os || normalizedData.operating_system) specs.operating_system = normalizedData.os || normalizedData.operating_system;
  
  console.log('Extracted specs from normalized data:', specs);
  return specs;
};

export const extractResourceAllocation = (normalizedData: any) => {
  const resources = {
    cpu: parseInt(normalizedData.cpus) || parseInt(normalizedData.cpu_cores) || 0,
    ram: parseFloat((normalizedData.memory_size || normalizedData.ram_total || normalizedData.memory || '0').toString().replace(/[^\d.]/g, '')) || 0,
    disk: parseFloat((normalizedData.provisioned_mb || normalizedData.disk_total || normalizedData.storage || '0').toString().replace(/[^\d.]/g, '')) || 0
  };
  
  console.log('Extracted resources from normalized data:', resources);
  return resources;
};

export const extractAdditionalData = (normalizedData: any): any => {
  const additionalData: any = {};
  
  // VM-specific fields
  if (normalizedData.vm) additionalData.vm_name = normalizedData.vm;
  if (normalizedData.dns_name) additionalData.dns_name = normalizedData.dns_name;
  if (normalizedData.powerstate || normalizedData.power_state) additionalData.power_state = normalizedData.powerstate || normalizedData.power_state;
  if (normalizedData.datacenter) additionalData.datacenter = normalizedData.datacenter;
  if (normalizedData.host || normalizedData.vm_host) additionalData.vm_host = normalizedData.host || normalizedData.vm_host;
  if (normalizedData.os || normalizedData.operating_system) additionalData.operating_system = normalizedData.os || normalizedData.operating_system;
  if (normalizedData.ip_address) additionalData.ip_address = normalizedData.ip_address;
  if (normalizedData.migré || normalizedData.migrated) additionalData.migrated = normalizedData.migré || normalizedData.migrated;
  
  // Resource information (also store in additional data for display)
  if (normalizedData.cpus || normalizedData.cpu_cores) additionalData.cpus = normalizedData.cpus || normalizedData.cpu_cores;
  if (normalizedData.memory_size) additionalData.memory_size = normalizedData.memory_size;
  if (normalizedData.provisioned_mb) additionalData.provisioned_mb = normalizedData.provisioned_mb;
  
  // Environment flags
  if (normalizedData.prod || normalizedData.production) additionalData.production = normalizedData.prod || normalizedData.production;
  if (normalizedData.pca) additionalData.pca = normalizedData.pca;
  if (normalizedData.infra || normalizedData.infrastructure) additionalData.infrastructure = normalizedData.infra || normalizedData.infrastructure;
  if (normalizedData.integration) additionalData.integration = normalizedData.integration;
  if (normalizedData.app || normalizedData.application) additionalData.application = normalizedData.app || normalizedData.application;
  if (normalizedData.db || normalizedData.database) additionalData.database = normalizedData.db || normalizedData.database;
  if (normalizedData.antivirus) additionalData.antivirus = normalizedData.antivirus;
  
  // Store any other fields not explicitly handled above
  const processedFields = [
    'vm', 'name', 'server_name', 'asset_name', 'hostname', 'dns_name',
    'datacenter', 'location', 'site', 'data_center', 'host', 'vm_host',
    'purchase_date', 'purchasedate', 'date_purchased', 'acquired_date',
    'projet', 'project', 'project_name', 'environment', 'env', 'classification', 'type',
    'assigned_to', 'assignedto',
    'cpus', 'cpu_cores', 'cpu_model', 'memory_size', 'ram_total', 'memory', 'ram_type', 'memory_type',
    'provisioned_mb', 'disk_total', 'storage', 'disk_type', 'storage_type',
    'powerstate', 'power_state', 'os', 'operating_system', 'ip_address', 'network_throughput',
    'migré', 'migrated',
    'prod', 'production', 'pca', 'infra', 'infrastructure', 'integration', 'app', 'application', 'db', 'database', 'antivirus'
  ];
  
  Object.keys(normalizedData).forEach(key => {
    if (!processedFields.includes(key) && normalizedData[key] && normalizedData[key] !== '') {
      additionalData[key] = normalizedData[key];
    }
  });
  
  console.log('Extracted additional data from normalized data:', additionalData);
  return additionalData;
};
