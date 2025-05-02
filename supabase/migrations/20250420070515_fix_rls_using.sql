-- Drop existing policy if it exists
DROP POLICY IF EXISTS "policy_name" ON arc_flash_data_duplicate;

-- Create the new policy with the USING clause
CREATE POLICY "Enable read access for all users"
  ON arc_flash_data_duplicate
  FOR SELECT
  TO public
  USING (true);

-- Double check RLS is enabled
ALTER TABLE arc_flash_data_duplicate ENABLE ROW LEVEL SECURITY; 