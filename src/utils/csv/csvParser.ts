import * as XLSX from 'xlsx';

export const parseCSVServers = async (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const fileExtension = file.name.toLowerCase().split('.').pop();
    console.log('=== PARSING CSV FILE ===');
    console.log('File name:', file.name);
    console.log('File extension:', fileExtension);
    
    if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      parseExcelFile(file, resolve, reject);
    } else {
      parseCSVFile(file, resolve, reject);
    }
  });
};

const parseExcelFile = (
  file: File, 
  resolve: (value: any[]) => void, 
  reject: (reason?: any) => void
) => {
  const reader = new FileReader();
  
  reader.onload = (event) => {
    try {
      const data = new Uint8Array(event.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      
      // Get the first worksheet
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Convert to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
      
      if (jsonData.length < 2) {
        throw new Error('Excel file must contain at least a header row and one data row');
      }
      
      const servers = parseSpreadsheetData(jsonData);
      console.log('=== EXCEL PARSING COMPLETE ===');
      console.log('Parsed servers count:', servers.length);
      console.log('First server sample:', servers[0]);
      resolve(servers);
    } catch (error) {
      console.error('Excel parsing error:', error);
      reject(error);
    }
  };
  
  reader.onerror = () => reject(new Error('Failed to read Excel file'));
  reader.readAsArrayBuffer(file);
};

const parseCSVFile = (
  file: File, 
  resolve: (value: any[]) => void, 
  reject: (reason?: any) => void
) => {
  const reader = new FileReader();
  
  reader.onload = (event) => {
    try {
      const csvText = event.target?.result as string;
      const lines = csvText.split('\n').filter(line => line.trim() !== '');
      
      if (lines.length < 2) {
        throw new Error('CSV file must contain at least a header row and one data row');
      }
      
      const servers = parseCSVData(lines);
      console.log('=== CSV PARSING COMPLETE ===');
      console.log('Parsed servers count:', servers.length);
      console.log('First server sample:', servers[0]);
      resolve(servers);
    } catch (error) {
      console.error('CSV parsing error:', error);
      reject(error);
    }
  };
  
  reader.onerror = () => reject(new Error('Failed to read file'));
  reader.readAsText(file);
};

const parseSpreadsheetData = (jsonData: any[][]): any[] => {
  // Keep ORIGINAL headers exactly as they appear in the CSV/Excel
  const originalHeaders = jsonData[0];
  
  console.log('=== SPREADSHEET HEADERS ===');
  console.log('Original headers (PRESERVED EXACTLY):', originalHeaders);
  
  // Parse data rows using EXACT original field names
  const servers = [];
  for (let i = 1; i < jsonData.length; i++) {
    const values = jsonData[i];
    
    // Skip empty rows
    if (!values || values.every(val => !val)) continue;
    
    const server: any = {};
    originalHeaders.forEach((header, index) => {
      const value = values[index];
      // Use EXACT original header name as the key
      server[String(header)] = value ? String(value).trim() : '';
    });
    
    console.log(`=== SERVER ROW ${i} ===`);
    console.log('Raw values:', values);
    console.log('Parsed server object with EXACT field names:', server);
    console.log('Server object keys:', Object.keys(server));
    
    servers.push(server);
  }
  
  return servers;
};

const parseCSVData = (lines: string[]): any[] => {
  // Keep ORIGINAL headers exactly as they appear in the CSV
  const originalHeader = lines[0];
  const originalHeaders = originalHeader.split(',').map(header => header.trim());
  
  console.log('=== CSV HEADERS ===');
  console.log('Original header line:', originalHeader);
  console.log('Original headers (PRESERVED EXACTLY):', originalHeaders);
  
  // Parse data rows using EXACT original field names
  const servers = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(value => value.trim());
    
    if (values.length !== originalHeaders.length) {
      console.warn(`Row ${i + 1} has ${values.length} columns, expected ${originalHeaders.length}`);
      continue;
    }
    
    const server: any = {};
    originalHeaders.forEach((header, index) => {
      // Use EXACT original header name as the key
      server[header] = values[index];
    });
    
    console.log(`=== SERVER ROW ${i} ===`);
    console.log('Raw values:', values);
    console.log('Parsed server object with EXACT field names:', server);
    console.log('Server object keys:', Object.keys(server));
    
    servers.push(server);
  }
  
  return servers;
};
