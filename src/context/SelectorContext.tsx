import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SelectorContextType {
  // Selection state
  voltageRange: string;
  equipment: string;
  taskCategory: string;
  specificTask: string;
  properlyMaintained: boolean;
  useAdvancedParams: boolean;
  
  // Setters
  setVoltageRange: (value: string) => void;
  setEquipment: (value: string) => void;
  setTaskCategory: (value: string) => void;
  setSpecificTask: (value: string) => void;
  setProperlyMaintained: (value: boolean) => void;
  setUseAdvancedParams: (value: boolean) => void;
  
  // Reset
  resetSelections: () => void;
}

const SelectorContext = createContext<SelectorContextType | undefined>(undefined);

export function SelectorProvider({ children }: { children: ReactNode }) {
  const [voltageRange, setVoltageRange] = useState('');
  const [equipment, setEquipment] = useState('');
  const [taskCategory, setTaskCategory] = useState('');
  const [specificTask, setSpecificTask] = useState('');
  const [properlyMaintained, setProperlyMaintained] = useState(false);
  const [useAdvancedParams, setUseAdvancedParams] = useState(false);
  
  const resetSelections = () => {
    setVoltageRange('');
    setEquipment('');
    setTaskCategory('');
    setSpecificTask('');
    setProperlyMaintained(false);
    setUseAdvancedParams(false);
  };
  
  return (
    <SelectorContext.Provider 
      value={{
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
        resetSelections
      }}
    >
      {children}
    </SelectorContext.Provider>
  );
}

export function useSelector() {
  const context = useContext(SelectorContext);
  if (context === undefined) {
    throw new Error('useSelector must be used within a SelectorProvider');
  }
  return context;
}