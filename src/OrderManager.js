import React, { useState } from 'react';
import { useOrders } from './OrderContext';

export default function OrderManager() {
  const { orders, addOrder, updateOrder, deleteOrder } = useOrders();
  const [form, setForm] = useState({ cliente: '', destino: '', estado: 'Pendiente', fecha: '', descripcion: '' });
  const [editId, setEditId] = useState(null);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (editId) {
      updateOrder(editId, form);
      setEditId(null);
    } else {
      addOrder(form);
    }
    setForm({ cliente: '', destino: '', estado: 'Pendiente', fecha: '', descripcion: '' });
  };

  const handleEdit = order => {
    setForm(order);
    setEditId(order.id);
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto' }}>
      <h2>Gestión de pedidos</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input name="cliente" value={form.cliente} onChange={handleChange} placeholder="Cliente" required />
        <input name="destino" value={form.destino} onChange={handleChange} placeholder="Destino" required />
        <input name="fecha" value={form.fecha} onChange={handleChange} placeholder="Fecha" type="date" required />
        <input name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Descripción" required />
        <select name="estado" value={form.estado} onChange={handleChange}>
          <option value="Pendiente">Pendiente</option>
          <option value="Enviado">Enviado</option>
          <option value="Entregado">Entregado</option>
        </select>
        <button type="submit">{editId ? 'Actualizar' : 'Agregar'}</button>
        {editId && <button type="button" onClick={() => { setEditId(null); setForm({ cliente: '', destino: '', estado: 'Pendiente', fecha: '', descripcion: '' }); }}>Cancelar</button>}
      </form>
      <table border="1" width="100%">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Destino</th>
            <th>Fecha</th>
            <th>Descripción</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.cliente}</td>
              <td>{order.destino}</td>
              <td>{order.fecha}</td>
              <td>{order.descripcion}</td>
              <td>{order.estado}</td>
              <td>
                <button onClick={() => handleEdit(order)}>Editar</button>
                <button onClick={() => deleteOrder(order.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
