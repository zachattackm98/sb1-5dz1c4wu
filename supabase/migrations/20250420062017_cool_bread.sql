/*
  # Create Arc Flash Data Table

  1. New Tables
    - `arc_flash_data`
      - `id` (uuid, primary key)
      - `voltage_range` (text, not null)
      - `cleaned_equipment` (text, not null)
      - `general_task_category` (text, not null)
      - `specific_task` (text, not null)
      - `parameters` (text, not null)
      - `arc_flash_ppe_category` (text, not null)
      - `arc_flash_boundary` (text, not null)
      - `likelihood_of_occurrence` (text, not null)
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `arc_flash_data` table
    - Add policy for public read access
*/

-- Create the arc_flash_data table
CREATE TABLE IF NOT EXISTS arc_flash_data (
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

-- Drop existing policy if it exists
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Anyone can read arc_flash_data" ON arc_flash_data;
EXCEPTION
  WHEN undefined_object THEN
    NULL;
END $$;

-- Create policy for public read access
CREATE POLICY "Anyone can read arc_flash_data"
  ON arc_flash_data
  FOR SELECT
  TO public
  USING (true);

-- Create indexes for frequently queried columns
CREATE INDEX IF NOT EXISTS idx_arc_flash_voltage_range ON arc_flash_data(voltage_range);
CREATE INDEX IF NOT EXISTS idx_arc_flash_equipment ON arc_flash_data(cleaned_equipment);
CREATE INDEX IF NOT EXISTS idx_arc_flash_task_category ON arc_flash_data(general_task_category);