import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Zap, Settings, CheckCircle2, AlertTriangle } from 'lucide-react';

import Card from '../ui/Card';
import Button from '../ui/Button';
import Select from '../ui/Select';
import Toggle from '../ui/Toggle';
import { useSelector } from '../../context/SelectorContext';
import {
  getVoltageRanges,
  getEquipmentByVoltage,
  getTaskCategoriesByEquipment,
  getSpecificTasksByTaskCategory,
} from '../../lib/supabase';

const SelectorStepper: React.FC = () => {
  const navigate = useNavigate();
  const {
    voltageRange,
    equipment,
    taskCategory,
    specificTask,
    properlyMaintained,
    useAdvancedParams,
    setVoltageRange,
    setEquipment,
    setTaskCategory,
    setSpecificTask,
    setProperlyMaintained,
    setUseAdvancedParams,
  } = useSelector();

  const [step, setStep] = useState(1);
  const [voltageOptions, setVoltageOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [equipmentOptions, setEquipmentOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [taskCategoryOptions, setTaskCategoryOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [specificTaskOptions, setSpecificTaskOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMCC, setIsMCC] = useState(false);

  // Load voltage ranges on component mount
  useEffect(() => {
    async function loadVoltageRanges() {
      setLoading(true);
      setError(null);
      try {
        const ranges = await getVoltageRanges();
        setVoltageOptions(
          ranges.map((range) => ({
            value: range,
            label: range,
          }))
        );
      } catch (err) {
        setError('Failed to load voltage ranges. Please try again.');
        console.error('Error loading voltage ranges:', err);
      } finally {
        setLoading(false);
      }
    }
    loadVoltageRanges();
  }, []);

  // Reset dependent fields when voltage changes
  useEffect(() => {
    if (voltageRange) {
      setEquipment('');
      setTaskCategory('');
      setSpecificTask('');
      setProperlyMaintained(false);
      loadEquipment(voltageRange);
    }
  }, [voltageRange, setEquipment, setTaskCategory, setSpecificTask, setProperlyMaintained]);

  // Load equipment options when voltage range changes
  const loadEquipment = async (voltage: string) => {
    setLoading(true);
    setError(null);
    try {
      const equipment = await getEquipmentByVoltage(voltage);
      setEquipmentOptions(
        equipment.map((equip) => ({
          value: equip,
          label: equip,
        }))
      );
    } catch (err) {
      setError('Failed to load equipment options. Please try again.');
      console.error('Error loading equipment:', err);
    } finally {
      setLoading(false);
    }
  };

  // Reset dependent fields when equipment changes
  useEffect(() => {
    if (voltageRange && equipment) {
      setTaskCategory('');
      setSpecificTask('');
      setProperlyMaintained(false);
      loadTaskCategories(voltageRange, equipment);
      setIsMCC(equipment.toLowerCase().includes('mcc'));
    }
  }, [equipment, voltageRange, setTaskCategory, setSpecificTask, setProperlyMaintained]);

  // Load task categories when equipment changes
  const loadTaskCategories = async (voltage: string, equip: string) => {
    setLoading(true);
    setError(null);
    try {
      const categories = await getTaskCategoriesByEquipment(voltage, equip);
      setTaskCategoryOptions(
        categories.map((category) => ({
          value: category,
          label: category,
        }))
      );
    } catch (err) {
      setError('Failed to load task categories. Please try again.');
      console.error('Error loading task categories:', err);
    } finally {
      setLoading(false);
    }
  };

  // Reset specific task and properlyMaintained when task category changes
  useEffect(() => {
    if (voltageRange && equipment && taskCategory) {
      setSpecificTask('');
      setProperlyMaintained(false);
      loadSpecificTasks(voltageRange, equipment, taskCategory);
    }
  }, [taskCategory, voltageRange, equipment, setSpecificTask, setProperlyMaintained]);

  // Load specific tasks when task category changes
  const loadSpecificTasks = async (voltage: string, equip: string, category: string) => {
    setLoading(true);
    setError(null);
    try {
      const tasks = await getSpecificTasksByTaskCategory(voltage, equip, category);
      setSpecificTaskOptions(
        tasks.map((task) => ({
          value: task,
          label: task,
        }))
      );
    } catch (err) {
      setError('Failed to load specific tasks. Please try again.');
      console.error('Error loading specific tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle next step
  const handleNext = () => {
    if (step === 5) {
      navigate('/results');
    } else {
      setStep(step + 1);
    }
  };

  // Handle back step
  const handleBack = () => {
    setStep(step - 1);
  };

  // Check if current step is complete to enable next button
  const isStepComplete = () => {
    switch (step) {
      case 1:
        return Boolean(voltageRange);
      case 2:
        return Boolean(equipment);
      case 3:
        return Boolean(taskCategory);
      case 4:
        return Boolean(specificTask);
      case 5:
        return true; // Always allow proceeding from the maintenance status step
      default:
        return false;
    }
  };

  // Render step content
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="animate-fade-in">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Zap className="mr-2 text-primary-500" size={20} />
              Step 1: Select Voltage Range
            </h2>
            <Select
              label="Voltage Range"
              options={voltageOptions}
              value={voltageRange}
              onChange={(e) => setVoltageRange(e.target.value)}
              disabled={loading}
              error={error || undefined}
              fullWidth
            />
          </div>
        );
      case 2:
        return (
          <div className="animate-fade-in">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Settings className="mr-2 text-primary-500" size={20} />
              Step 2: Select Equipment
            </h2>
            <Select
              label="Equipment"
              options={equipmentOptions}
              value={equipment}
              onChange={(e) => setEquipment(e.target.value)}
              disabled={loading}
              error={error || undefined}
              fullWidth
            />
          </div>
        );
      case 3:
        return (
          <div className="animate-fade-in">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <ShieldAlert className="mr-2 text-primary-500" size={20} />
              Step 3: Select General Task Category
            </h2>
            <Select
              label="Task Category"
              options={taskCategoryOptions}
              value={taskCategory}
              onChange={(e) => setTaskCategory(e.target.value)}
              disabled={loading}
              error={error || undefined}
              fullWidth
            />
          </div>
        );
      case 4:
        return (
          <div className="animate-fade-in">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <CheckCircle2 className="mr-2 text-primary-500" size={20} />
              Step 4: Select Specific Task
            </h2>
            <Select
              label="Specific Task"
              options={specificTaskOptions}
              value={specificTask}
              onChange={(e) => setSpecificTask(e.target.value)}
              disabled={loading}
              error={error || undefined}
              fullWidth
            />
          </div>
        );
      case 5:
        return (
          <div className="animate-fade-in">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <AlertTriangle className="mr-2 text-warning-500" size={20} />
              Step 5: Equipment Condition
            </h2>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
              <Toggle
                label="Is the equipment properly installed, maintained, and in normal operating condition?"
                checked={properlyMaintained}
                onChange={setProperlyMaintained}
                description="This affects whether PPE is required for certain tasks."
              />
            </div>
            
            {isMCC && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <Toggle
                  label="I know the fault current and breaker clearing time"
                  checked={useAdvancedParams}
                  onChange={setUseAdvancedParams}
                  description="For MCCs, this may reduce the required PPE to Category 2 if the available fault current is ≤ 65 kA and the clearing time is ≤ 0.03 sec (2 cycles)."
                />
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  if (error) {
    return (
      <Card className="max-w-2xl mx-auto">
        <div className="text-center text-danger-600 p-4">
          <AlertTriangle size={48} className="mx-auto mb-4" />
          <p>{error}</p>
          <Button
            variant="primary"
            onClick={() => window.location.reload()}
            className="mt-4"
          >
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className={`flex flex-col items-center ${
                index < step ? 'text-primary-500' : 'text-gray-400'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                  index < step ? 'bg-primary-500 text-white' : 'bg-gray-200'
                }`}
              >
                {index + 1}
              </div>
              <span className="text-xs hidden sm:inline">
                {index === 0
                  ? 'Voltage'
                  : index === 1
                  ? 'Equipment'
                  : index === 2
                  ? 'Task Category'
                  : index === 3
                  ? 'Specific Task'
                  : 'Condition'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {renderStepContent()}

      <div className="mt-8 flex justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={step === 1}
        >
          Back
        </Button>
        <Button
          variant="primary"
          onClick={handleNext}
          disabled={!isStepComplete() || loading}
        >
          {step === 5 ? 'View Results' : 'Next'}
        </Button>
      </div>
    </Card>
  );
};

export default SelectorStepper;