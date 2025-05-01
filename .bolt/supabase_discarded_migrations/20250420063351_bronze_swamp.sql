-- Drop existing table and policies
DROP TABLE IF EXISTS arc_flash_data CASCADE;

-- Create the arc_flash_data table with proper constraints
CREATE TABLE arc_flash_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  voltage_range text NOT NULL CHECK (voltage_range <> ''),
  cleaned_equipment text NOT NULL CHECK (cleaned_equipment <> ''),
  general_task_category text NOT NULL CHECK (general_task_category <> ''),
  specific_task text NOT NULL CHECK (specific_task <> ''),
  parameters text NOT NULL CHECK (parameters <> ''),
  arc_flash_ppe_category text NOT NULL CHECK (arc_flash_ppe_category <> ''),
  arc_flash_boundary text NOT NULL CHECK (arc_flash_boundary <> ''),
  likelihood_of_occurrence text NOT NULL CHECK (likelihood_of_occurrence <> ''),
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE arc_flash_data ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Anyone can read arc_flash_data"
  ON arc_flash_data
  FOR SELECT
  TO public
  USING (true);

-- Create indexes for frequently queried columns
CREATE INDEX idx_arc_flash_voltage_range ON arc_flash_data(voltage_range);
CREATE INDEX idx_arc_flash_equipment ON arc_flash_data(cleaned_equipment);
CREATE INDEX idx_arc_flash_task_category ON arc_flash_data(general_task_category);