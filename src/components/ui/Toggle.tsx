import React from 'react';

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
}

const Toggle: React.FC<ToggleProps> = ({ label, checked, onChange, description }) => {
  const id = `toggle-${label.toLowerCase().replace(/\s+/g, '-')}`;
  
  return (
    <div className="flex items-start mb-4">
      <div className="flex items-center h-5">
        <button
          type="button"
          id={id}
          role="switch"
          aria-checked={checked}
          className={`
            relative inline-flex h-6 w-11 items-center rounded-full
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
            ${checked ? 'bg-primary-500' : 'bg-gray-300'}
            transition-colors duration-200
          `}
          onClick={() => onChange(!checked)}
        >
          <span
            className={`
              inline-block h-4 w-4 transform rounded-full bg-white
              transition-transform duration-200
              ${checked ? 'translate-x-6' : 'translate-x-1'}
            `}
          />
        </button>
      </div>
      <div className="ml-3 text-sm">
        <label htmlFor={id} className="font-medium text-gray-700">
          {label}
        </label>
        {description && (
          <p className="text-gray-500">{description}</p>
        )}
      </div>
    </div>
  );
};

export default Toggle;