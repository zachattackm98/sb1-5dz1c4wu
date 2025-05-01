/*
  # Add MCC configurations with different parameters

  1. Changes
    - Add two MCC configurations for the same task:
      a. Higher-risk (Category 4): 42 kA, 0.33 sec clearing time
      b. Lower-risk (Category 2): 65 kA, 0.03 sec clearing time

  2. Security
    - Maintains existing RLS policies
*/

-- First, remove any existing MCC entries to avoid duplicates
DELETE FROM arc_flash_data 
WHERE cleaned_equipment ILIKE '%mcc%';

-- Insert MCC configurations with different parameters
INSERT INTO arc_flash_data 
(voltage_range, cleaned_equipment, general_task_category, specific_task, parameters, arc_flash_ppe_category, arc_flash_boundary, likelihood_of_occurrence)
VALUES
-- Higher-risk configuration (Category 4)
('241V – 600V', 'MCCs (600V class)', 'Testing and Troubleshooting', 
'For ac systems, work on energized electrical conductors and circuit parts, including electrical testing.',
'Maximum of 42 kA available fault current; maximum of 0.33 sec (20 cycles) fault clearing time; minimum working distance 910 mm (36 in.)',
'4', '4.3 m (14 ft)', 'Yes'),

-- Lower-risk configuration (Category 2)
('241V – 600V', 'MCCs (600V class)', 'Testing and Troubleshooting', 
'For ac systems, work on energized electrical conductors and circuit parts, including electrical testing.',
'Maximum of 65 kA available fault current; maximum of 0.03 sec (2 cycles) fault clearing time; minimum working distance 455 mm (18 in.)',
'2', '1.5 m (5 ft)', 'Yes');