import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

console.log('Initializing Supabase client with:', {
  url: supabaseUrl ? 'URL present' : 'URL missing',
  key: supabaseAnonKey ? 'Key present' : 'Key missing'
});

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export interface ArcFlashData {
  id: string;
  voltage_range: string;
  cleaned_equipment: string;
  general_task_category: string;
  specific_task: string;
  parameters: string;
  arc_flash_ppe_category: string;
  arc_flash_boundary: string;
  likelihood_of_occurrence: string;
}

export async function getPublicImageUrl(bucket: string, path: string): Promise<string> {
  const { data } = await supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export async function getVoltageRanges(): Promise<string[]> {
  console.log('Fetching voltage ranges...');
  
  const { data, error } = await supabase
    .from('arc_flash_data_duplicate')
    .select('voltage_range');
  
  if (error) {
    console.error('Error fetching voltage ranges:', error);
    throw new Error(`Failed to fetch voltage ranges: ${error.message}`);
  }
  
  if (!data?.length) {
    console.error('No voltage ranges found in database');
    throw new Error('No data found in the database. Please verify the data import.');
  }
  
  const uniqueVoltages = [...new Set(data.map(item => item.voltage_range))];
  
  // Define the exact order we want
  const voltageOrder: Record<string, number> = {
    '1.1kV – 15kV': 3,
    '241V – 600V': 2,
    '50V – 240V': 1
  };
  
  // Sort based on the predefined order
  const sortedVoltages = uniqueVoltages.sort((a, b) => 
    (voltageOrder[b as keyof typeof voltageOrder] || 0) - (voltageOrder[a as keyof typeof voltageOrder] || 0)
  );
  
  console.log('Found voltage ranges:', sortedVoltages);
  return sortedVoltages;
}

export async function getEquipmentByVoltage(voltageRange: string): Promise<string[]> {
  console.log('Fetching equipment for voltage range:', voltageRange);
  
  const { data, error } = await supabase
    .from('arc_flash_data_duplicate')
    .select('cleaned_equipment, general_task_category')
    .eq('voltage_range', voltageRange);
  
  if (error) {
    console.error('Error fetching equipment:', error);
    throw new Error(`Failed to fetch equipment: ${error.message}`);
  }
  
  const equipmentWithTasks = data.filter(item => item.general_task_category);
  
  if (!equipmentWithTasks.length) {
    console.error('No valid equipment found for voltage range:', voltageRange);
    throw new Error(`No equipment found for voltage range: ${voltageRange}`);
  }
  
  const uniqueEquipment = [...new Set(equipmentWithTasks.map(item => item.cleaned_equipment))];
  
  const validEquipment = uniqueEquipment.filter(equipment => {
    if (equipment.includes('≤240V')) {
      return voltageRange === '50V – 240V';
    }
    if (equipment.includes('>240V')) {
      return voltageRange !== '50V – 240V';
    }
    return true;
  });

  if (!validEquipment.length) {
    throw new Error(`No valid equipment found for voltage range: ${voltageRange}`);
  }
  
  console.log('Found valid equipment:', validEquipment);
  return validEquipment;
}

export async function getTaskCategoriesByEquipment(
  voltageRange: string,
  equipment: string
): Promise<string[]> {
  console.log('Fetching task categories for:', { voltageRange, equipment });
  
  const { data, error } = await supabase
    .from('arc_flash_data_duplicate')
    .select('general_task_category')
    .eq('voltage_range', voltageRange)
    .eq('cleaned_equipment', equipment);
  
  if (error) {
    console.error('Error fetching task categories:', error);
    throw new Error(`Failed to fetch task categories: ${error.message}`);
  }
  
  if (!data?.length) {
    console.error('No task categories found for:', { voltageRange, equipment });
    throw new Error('No task categories found for the selected equipment');
  }
  
  const uniqueCategories = [...new Set(data.map(item => item.general_task_category))];
  console.log('Found task categories:', uniqueCategories);
  return uniqueCategories;
}

export async function getSpecificTasksByTaskCategory(
  voltageRange: string,
  equipment: string,
  taskCategory: string
): Promise<string[]> {
  console.log('Fetching specific tasks for:', { voltageRange, equipment, taskCategory });
  
  const { data, error } = await supabase
    .from('arc_flash_data_duplicate')
    .select('specific_task')
    .eq('voltage_range', voltageRange)
    .eq('cleaned_equipment', equipment)
    .eq('general_task_category', taskCategory);
  
  if (error) {
    console.error('Error fetching specific tasks:', error);
    throw new Error(`Failed to fetch specific tasks: ${error.message}`);
  }
  
  if (!data?.length) {
    console.error('No specific tasks found for:', { voltageRange, equipment, taskCategory });
    throw new Error('No specific tasks found for the selected category');
  }
  
  const uniqueTasks = [...new Set(data.map(item => item.specific_task))];
  console.log('Found specific tasks:', uniqueTasks);
  return uniqueTasks;
}

export async function getPPERequirements(
  voltageRange: string,
  equipment: string,
  taskCategory: string,
  specificTask: string,
  useAlternateParams = false
): Promise<ArcFlashData | null> {
  console.log('Fetching PPE requirements for:', {
    voltageRange,
    equipment,
    taskCategory,
    specificTask,
    useAlternateParams
  });

  const isMCC = equipment.toLowerCase().includes('mcc');
  let query = supabase
    .from('arc_flash_data_duplicate')
    .select('*')
    .eq('voltage_range', voltageRange)
    .eq('cleaned_equipment', equipment)
    .eq('general_task_category', taskCategory)
    .eq('specific_task', specificTask);

  if (isMCC) {
    if (useAlternateParams) {
      query = query.ilike('parameters', '%65 kA%0.03 sec%');
    } else {
      query = query.ilike('parameters', '%42 kA%0.33 sec%');
    }
  }

  const { data, error } = await query.limit(1);

  if (error) {
    console.error('Error fetching PPE requirements:', error);
    throw new Error(`Failed to fetch PPE requirements: ${error.message}`);
  }

  if (!data || data.length === 0) {
    console.log('No PPE requirements found');
    return null;
  }

  console.log('Found PPE requirements:', data[0]);
  return data[0];
}