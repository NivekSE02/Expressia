import React, { createContext, useContext, useState } from 'react';

// Order shape
export const initialOrders = [
  {
    id: 1,
    cliente: 'Juan Perez',
    destino: 'Guatemala',
    estado: 'Pendiente',
    fecha: '2025-09-05',
    descripcion: 'Paquete pequeño',
  },
];

const OrderContext = createContext();

export function useOrders() {
  return useContext(OrderContext);
}

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState(initialOrders);

  // CRUD operations
  const addOrder = (order) => {
    setOrders([...orders, { ...order, id: Date.now() }]);
  };
  const updateOrder = (id, updates) => {
    setOrders(orders.map(o => o.id === id ? { ...o, ...updates } : o));
  };
  const deleteOrder = (id) => {
    setOrders(orders.filter(o => o.id !== id));
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrder, deleteOrder }}>
      {children}
    </OrderContext.Provider>
  );
}
