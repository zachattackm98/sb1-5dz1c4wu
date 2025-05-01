/*
  # Create arc_flash_data table

  1. New Tables
    - `arc_flash_data`
      - `id` (int, primary key)
      - `voltage_range` (text)
      - `cleaned_equipment` (text)
      - `general_task_category` (text)
      - `specific_task` (text)
      - `parameters` (text)
      - `arc_flash_ppe_category` (text)
      - `arc_flash_boundary` (text)
      - `likelihood_of_occurrence` (text)
      - `created_at` (timestamptz)
  2. Security
    - Enable RLS on `arc_flash_data` table
    - Add policy for authenticated and anonymous users to read data
*/

CREATE TABLE IF NOT EXISTS arc_flash_data (
  id SERIAL PRIMARY KEY,
  voltage_range TEXT NOT NULL,
  cleaned_equipment TEXT NOT NULL,
  general_task_category TEXT NOT NULL,
  specific_task TEXT NOT NULL,
  parameters TEXT NOT NULL,
  arc_flash_ppe_category TEXT NOT NULL,
  arc_flash_boundary TEXT NOT NULL,
  likelihood_of_occurrence TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE arc_flash_data ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read the data (no auth required)
CREATE POLICY "Anyone can read arc_flash_data"
  ON arc_flash_data
  FOR SELECT
  TO public
  USING (true);