import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import { parse } from 'csv-parse/sync';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing environment variables:');
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? '✓' : '✗');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false
  }
});

async function importData() {
  try {
    // 1. Read and parse CSV synchronously
    const csvPath = path.join(__dirname, 'BoltReady_ArcFlashLogic.csv');
    console.log('Reading CSV from:', csvPath);
    
    const fileContent = fs.readFileSync(csvPath, 'utf-8');
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    console.log(`Parsed ${records.length} records from CSV`);

    // 2. Map CSV data to database schema
    const data = records.map(record => ({
      voltage_range: record['Voltage Range'],
      cleaned_equipment: record['Cleaned Equipment'],
      general_task_category: record['General Task Category'],
      specific_task: record['Specific Task'],
      parameters: record['Parameters'],
      arc_flash_ppe_category: record['Arc Flash PPE Category'],
      arc_flash_boundary: record['Arc Flash Boundary'],
      likelihood_of_occurrence: record['Likelihood of Occurrence']
    }));

    // 3. Insert all data in one transaction
    console.log('Inserting data into Supabase...');
    const { error } = await supabase
      .from('arc_flash_data_duplicate')
      .insert(data);

    if (error) {
      throw error;
    }

    // 4. Verify the insert
    const { count, error: countError } = await supabase
      .from('arc_flash_data_duplicate')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      throw countError;
    }

    console.log(`Success! ${count} records imported.`);
    process.exit(0);

  } catch (error) {
    console.error('Import failed:', error.message);
    if (error.details) console.error('Details:', error.details);
    if (error.hint) console.error('Hint:', error.hint);
    process.exit(1);
  }
}

console.log('Starting import...');
importData();