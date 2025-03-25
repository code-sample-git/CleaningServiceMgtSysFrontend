import React from 'react';

const Form = ({ onSubmit, children, className }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className={`form ${className || ''}`}>
      <div className="form-grid">
        {children}
      </div>
    </form>
  );
};

export const FormField = ({ label, error, children }) => {
  return (
    <div className="form-field">
      {label && <label className="form-label">{label}</label>}
      {children}
      {error && <span className="form-error">{error}</span>}
    </div>
  );
};

export const FormInput = ({ type = 'text', label, error, ...props }) => {
  return (
    <FormField label={label} error={error}>
      <input type={type} className="form-input" {...props} />
    </FormField>
  );
};

export const FormSelect = ({ label, error, options, ...props }) => {
  return (
    <FormField label={label} error={error}>
      <select className="form-select" {...props}>
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FormField>
  );
};

export const FormTextarea = ({ label, error, ...props }) => {
  return (
    <FormField label={label} error={error}>
      <textarea className="form-textarea" {...props} />
    </FormField>
  );
};

export default Form; 