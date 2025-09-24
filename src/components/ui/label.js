import React from 'react';

export function Label({ className = '', children, htmlFor }) {
  return (
    <label htmlFor={htmlFor} className={`block text-sm font-medium text-gray-700 ${className}`}>
      {children}
    </label>
  );
}
