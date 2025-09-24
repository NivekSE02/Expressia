import React from 'react';

export function Button({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  disabled,
  ...rest
}) {
  const variants = {
    default: 'bg-blue-600 hover:bg-blue-700 text-white',
    outline: 'border border-gray-300 hover:bg-gray-100 text-gray-800 bg-white',
    link: 'text-blue-600 underline hover:text-blue-800 bg-transparent border-none p-0',
  };
  const sizes = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-5 py-3',
  };
  const base = 'inline-flex items-center justify-center rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
  const cls = `${base} ${variants[variant] || variants.default} ${sizes[size] || sizes.md} ${className}`;
  return (
    <button className={cls} disabled={disabled} {...rest}>
      {children}
    </button>
  );
}
