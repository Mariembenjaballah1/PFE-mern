
import { Asset } from '@/types/asset';

export const useVMData = (asset: Asset) => {
  const vmInfo = asset.vmInfo || {};
  const specs = asset.specs || {};
  const additionalData = asset.additionalData || {};
  
  console.log('=== VM INFORMATION CARD DEBUG ===');
  console.log('Asset ID:', asset.id || asset._id);
  console.log('Asset name:', asset.name);
  console.log('Asset created:', asset.createdAt);
  console.log('VMInfo keys:', Object.keys(vmInfo));
  console.log('Specs keys:', Object.keys(specs));
  console.log('AdditionalData keys:', Object.keys(additionalData));
  console.log('Asset has vmInfo field:', 'vmInfo' in asset);
  console.log('Asset has specs field:', 'specs' in asset);
  console.log('Asset has additionalData field:', 'additionalData' in asset);
  
  // Show available fields for debugging
  const allAvailableFields = [...Object.keys(vmInfo), ...Object.keys(specs), ...Object.keys(additionalData)];
  console.log('ALL AVAILABLE FIELDS:', allAvailableFields);
  
  // Enhanced helper function to get value with comprehensive search
  const getFieldValue = (primaryFields: string[], fallbacks: string[] = [], defaultValue: string = 'N/A') => {
    console.log(`\n--- Searching for fields: [${primaryFields.join(', ')}] with fallbacks: [${fallbacks.join(', ')}] ---`);
    
    // Search in vmInfo first (structured fields)
    for (const field of primaryFields) {
      if (vmInfo[field] !== undefined && vmInfo[field] !== null && String(vmInfo[field]).trim() !== '') {
        console.log(`✓ Found field "${field}" in vmInfo: "${vmInfo[field]}"`);
        return String(vmInfo[field]).trim();
      }
    }
    
    // Search in additionalData (exact match)
    for (const field of primaryFields) {
      if (additionalData[field] !== undefined && additionalData[field] !== null && String(additionalData[field]).trim() !== '') {
        console.log(`✓ Found EXACT field "${field}" in additionalData: "${additionalData[field]}"`);
        return String(additionalData[field]).trim();
      }
    }
    
    // Search in specs (exact match)
    for (const field of primaryFields) {
      if (specs[field] !== undefined && specs[field] !== null && String(specs[field]).trim() !== '') {
        console.log(`✓ Found field "${field}" in specs: "${specs[field]}"`);
        return String(specs[field]).trim();
      }
    }
    
    // Case-insensitive search in additionalData
    const additionalDataKeys = Object.keys(additionalData);
    for (const field of primaryFields) {
      for (const key of additionalDataKeys) {
        if (key.toLowerCase() === field.toLowerCase() && additionalData[key] !== undefined && additionalData[key] !== null && String(additionalData[key]).trim() !== '') {
          console.log(`✓ Found case-insensitive field "${key}" (looking for "${field}") in additionalData: "${additionalData[key]}"`);
          return String(additionalData[key]).trim();
        }
      }
    }
    
    // Case-insensitive search in specs
    const specsKeys = Object.keys(specs);
    for (const field of primaryFields) {
      for (const key of specsKeys) {
        if (key.toLowerCase() === field.toLowerCase() && specs[key] !== undefined && specs[key] !== null && String(specs[key]).trim() !== '') {
          console.log(`✓ Found case-insensitive field "${key}" (looking for "${field}") in specs: "${specs[key]}"`);
          return String(specs[key]).trim();
        }
      }
    }
    
    // Search fallback fields
    for (const fallback of fallbacks) {
      if (vmInfo[fallback] !== undefined && vmInfo[fallback] !== null && String(vmInfo[fallback]).trim() !== '') {
        console.log(`✓ Found fallback field "${fallback}" in vmInfo: "${vmInfo[fallback]}"`);
        return String(vmInfo[fallback]).trim();
      }
      if (additionalData[fallback] !== undefined && additionalData[fallback] !== null && String(additionalData[fallback]).trim() !== '') {
        console.log(`✓ Found fallback field "${fallback}" in additionalData: "${additionalData[fallback]}"`);
        return String(additionalData[fallback]).trim();
      }
      if (specs[fallback] !== undefined && specs[fallback] !== null && String(specs[fallback]).trim() !== '') {
        console.log(`✓ Found fallback field "${fallback}" in specs: "${specs[fallback]}"`);
        return String(specs[fallback]).trim();
      }
    }
    
    // Final fallback - check asset direct properties
    for (const field of primaryFields.concat(fallbacks)) {
      const lowerField = field.toLowerCase();
      if (lowerField === 'vm' || lowerField === 'name') {
        if (asset.name && asset.name.trim() !== '') {
          console.log(`✓ Using asset.name as fallback: "${asset.name}"`);
          return asset.name.trim();
        }
      }
      if (lowerField === 'datacenter' || lowerField === 'location') {
        if (asset.location && asset.location.trim() !== '') {
          console.log(`✓ Using asset.location as fallback: "${asset.location}"`);
          return asset.location.trim();
        }
      }
    }
    
    console.log(`✗ No value found for any field, using default: "${defaultValue}"`);
    return defaultValue;
  };

  return {
    vmInfo,
    specs,
    additionalData,
    allAvailableFields,
    getFieldValue,
    asset
  };
};
