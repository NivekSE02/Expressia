import React from 'react';

export function Input({ className = '', ...rest }) {
  const base = 'w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50';
  return <input className={`${base} ${className}`} {...rest} />;
}
