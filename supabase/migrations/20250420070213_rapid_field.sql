/*
  # Restore MCC categories and configurations

  1. Changes
    - Add back all MCC task categories and configurations
    - Include both standard and alternate parameter sets
    - Maintain existing voltage ranges and categories
*/

-- First, remove any existing MCC entries to avoid duplicates
DELETE FROM arc_flash_data 
WHERE cleaned_equipment ILIKE '%mcc%';

-- Insert MCC configurations with different parameters
INSERT INTO arc_flash_data 
(voltage_range, cleaned_equipment, general_task_category, specific_task, parameters, arc_flash_ppe_category, arc_flash_boundary, likelihood_of_occurrence)
VALUES
-- Operation of MCCs
('241V – 600V', 'MCCs (600V class)', 'Operation', 
'Operation of circuit breakers (CBs) or switches with covers on.',
'Maximum of 42 kA available fault current; maximum of 0.33 sec (20 cycles) fault clearing time; minimum working distance 910 mm (36 in.)',
'1', '1.5 m (5 ft)', 'No'),

('241V – 600V', 'MCCs (600V class)', 'Operation', 
'Operation of circuit breakers (CBs) or switches with covers off.',
'Maximum of 42 kA available fault current; maximum of 0.33 sec (20 cycles) fault clearing time; minimum working distance 910 mm (36 in.)',
'4', '4.3 m (14 ft)', 'Yes'),

-- Testing and Troubleshooting with standard parameters (Category 4)
('241V – 600V', 'MCCs (600V class)', 'Testing and Troubleshooting', 
'For ac systems, work on energized electrical conductors and circuit parts, including electrical testing.',
'Maximum of 42 kA available fault current; maximum of 0.33 sec (20 cycles) fault clearing time; minimum working distance 910 mm (36 in.)',
'4', '4.3 m (14 ft)', 'Yes'),

-- Testing and Troubleshooting with alternate parameters (Category 2)
('241V – 600V', 'MCCs (600V class)', 'Testing and Troubleshooting', 
'For ac systems, work on energized electrical conductors and circuit parts, including electrical testing.',
'Maximum of 65 kA available fault current; maximum of 0.03 sec (2 cycles) fault clearing time; minimum working distance 455 mm (18 in.)',
'2', '1.5 m (5 ft)', 'Yes'),

-- Voltage Testing
('241V – 600V', 'MCCs (600V class)', 'Voltage Testing', 
'For ac systems, testing for absence of voltage.',
'Maximum of 42 kA available fault current; maximum of 0.33 sec (20 cycles) fault clearing time; minimum working distance 910 mm (36 in.)',
'4', '4.3 m (14 ft)', 'No'),

-- Removal/Installation
('241V – 600V', 'MCCs (600V class)', 'Removal/Installation', 
'For ac systems, removal or installation of CBs or switches.',
'Maximum of 42 kA available fault current; maximum of 0.33 sec (20 cycles) fault clearing time; minimum working distance 910 mm (36 in.)',
'4', '4.3 m (14 ft)', 'Yes'),

-- Maintenance and Inspection
('241V – 600V', 'MCCs (600V class)', 'Maintenance', 
'For ac systems, work on energized electrical conductors and circuit parts, including voltage testing.',
'Maximum of 42 kA available fault current; maximum of 0.33 sec (20 cycles) fault clearing time; minimum working distance 910 mm (36 in.)',
'4', '4.3 m (14 ft)', 'Yes');