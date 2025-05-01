/*
  # Reset and create arc_flash_data table

  1. Changes
    - Drop existing table and policies
    - Create table with proper constraints
    - Enable RLS with public read access
    - Create necessary indexes
*/

-- Drop existing policies and table
DROP POLICY IF EXISTS "Anyone can read arc_flash_data" ON arc_flash_data;
DROP TABLE IF EXISTS arc_flash_data;

-- Create the arc_flash_data table
CREATE TABLE arc_flash_data (
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

-- Enable RLS
ALTER TABLE arc_flash_data ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Anyone can read arc_flash_data"
  ON arc_flash_data
  FOR SELECT
  TO public
  USING (true);

-- Create policy for service role to manage data
CREATE POLICY "Service role can manage arc_flash_data"
  ON arc_flash_data
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create indexes for frequently queried columns
CREATE INDEX idx_arc_flash_voltage_range ON arc_flash_data(voltage_range);
CREATE INDEX idx_arc_flash_equipment ON arc_flash_data(cleaned_equipment);
CREATE INDEX idx_arc_flash_task_category ON arc_flash_data(general_task_category);