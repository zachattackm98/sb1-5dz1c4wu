/*
  # Create Arc Flash Data Duplicate Table

  1. Changes
    - Create arc_flash_data_duplicate table
    - Copy all data from arc_flash_data
    - Enable RLS and create policies
*/

-- Create the arc_flash_data_duplicate table
CREATE TABLE arc_flash_data_duplicate (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  voltage_range text NOT NULL,
  cleaned_equipment text NOT NULL,
  general_task_category text NOT NULL,
  specific_task text NOT NULL,
  parameters text NOT NULL,
  arc_flash_ppe_category text NOT NULL,
  arc_flash_boundary text NOT NULL,
  likelihood_of_occurrence text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Copy all data from arc_flash_data
INSERT INTO arc_flash_data_duplicate (
  voltage_range,
  cleaned_equipment,
  general_task_category,
  specific_task,
  parameters,
  arc_flash_ppe_category,
  arc_flash_boundary,
  likelihood_of_occurrence,
  created_at
)
SELECT 
  voltage_range,
  cleaned_equipment,
  general_task_category,
  specific_task,
  parameters,
  arc_flash_ppe_category,
  arc_flash_boundary,
  likelihood_of_occurrence,
  created_at
FROM arc_flash_data;

-- Enable RLS
ALTER TABLE arc_flash_data_duplicate ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Anyone can read arc_flash_data_duplicate"
  ON arc_flash_data_duplicate
  FOR SELECT
  TO public
  USING (true);

-- Create indexes for frequently queried columns
CREATE INDEX idx_arc_flash_duplicate_voltage_range ON arc_flash_data_duplicate(voltage_range);
CREATE INDEX idx_arc_flash_duplicate_equipment ON arc_flash_data_duplicate(cleaned_equipment);
CREATE INDEX idx_arc_flash_duplicate_task_category ON arc_flash_data_duplicate(general_task_category); 