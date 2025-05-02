-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Anyone can read arc_flash_data_duplicate" ON arc_flash_data_duplicate;

-- Ensure RLS is enabled
ALTER TABLE arc_flash_data_duplicate ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Anyone can read arc_flash_data_duplicate"
  ON arc_flash_data_duplicate
  FOR SELECT
  TO public
  USING (true);

-- Grant necessary permissions
GRANT SELECT ON arc_flash_data_duplicate TO anon;
GRANT SELECT ON arc_flash_data_duplicate TO authenticated; 