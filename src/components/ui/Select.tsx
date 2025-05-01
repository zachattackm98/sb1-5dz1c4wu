import React, { SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Array<{ value: string; label: string }>;
  error?: string;
  fullWidth?: boolean;
}

const Select: React.FC<SelectProps> = ({
  label,
  options,
  error,
  fullWidth = false,
  className = '',
  ...props
}) => {
  const id = props.id || label.toLowerCase().replace(/\s+/g, '-');
  
  return (
    <div className={`mb-4 ${fullWidth ? 'w-full' : ''}`}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        id={id}
        className={`
          block rounded-md shadow-sm
          ${error ? 'border-danger-500 focus:ring-danger-500' : 'border-gray-300 focus:ring-primary-500'}
          focus:border-primary-500 focus:ring-2 focus:ring-opacity-50
          ${fullWidth ? 'w-full' : 'w-auto'}
          ${className}
          p-2 border
        `}
        {...props}
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-danger-600">{error}</p>}
    </div>
  );
};

export default Select;