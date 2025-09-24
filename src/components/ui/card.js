import React from 'react';

export function Card({ className = '', children }) {
  return <div className={`bg-white rounded-xl shadow border border-gray-200 ${className}`}>{children}</div>;
}
export function CardHeader({ className = '', children }) {
  return <div className={`px-6 pt-6 ${className}`}>{children}</div>;
}
export function CardTitle({ className = '', children }) {
  return <h2 className={`font-bold tracking-tight ${className}`}>{children}</h2>;
}
export function CardDescription({ className = '', children }) {
  return <p className={`text-sm text-gray-500 ${className}`}>{children}</p>;
}
export function CardContent({ className = '', children }) {
  return <div className={`px-6 pb-6 ${className}`}>{children}</div>;
}
