// Nueva implementación solicitada: Panel de Cliente con Tabs (Pedido, Historial, Seguimiento, Programar)
import React, { useState, useEffect } from 'react';
import { loadOrders, saveOrders, broadcastOrdersChange } from './storage';
import { Package, History, MapPin, Calendar, Calculator, Truck, Clock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from './Img/expressia.png';
import { useToast } from './toast';


// NOTA: Se eliminan imports con alias (@/...) y componentes inexistentes.
// Este archivo contiene implementaciones internas simplificadas para Tabs, Layout y componentes necesarios.

// ---------------- Layout Sencillo ----------------
function Layout({ title, subtitle, children }) {
  const navigate = useNavigate();
  const goBack = () => navigate('/'); // Navega al inicio (página principal)
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-[#0D1B2A] text-white py-6 shadow relative">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <img
                  src={logo}
                  alt="Logo"
                  style={{ width: '190px', height: '75px', objectFit: 'cover', cursor: 'pointer' }}
                  onClick={() => navigate('/')}
                />
              </div>
              <div>
                <h1 className="text-2xl font-semibold">{title}</h1>
                {subtitle && <p className="text-sm text-gray-300 mt-1">{subtitle}</p>}
              </div>
            </div>
            <button
              type="button"
              onClick={goBack}
              className="group inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-white bg-transparent hover:bg-[#11263a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F77F00] focus:ring-offset-[#0D1B2A] transition-colors"
              aria-label="Volver al inicio"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              <span className="uppercase tracking-wide">Volver</span>
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="bg-[#0D1B2A] text-gray-300 text-center py-4 text-sm">© 2025 Expressia</footer>
    </div>
  );
}

// ---------------- Sistema de Tabs Funcional ----------------
function Tabs({ children }) { return <div>{children}</div>; }
function TabsList({ children, value, onValueChange }) {
  return (
    <div className="grid grid-cols-4 gap-2 bg-white border rounded-lg overflow-hidden mb-6">
      {React.Children.map(children, child => React.isValidElement(child) ? React.cloneElement(child, { activeValue: value, onValueChange }) : child)}
    </div>
  );
}
function TabsTrigger({ value, activeValue, onValueChange, children }) {
  const active = value === activeValue;
  return (
    <button type="button" onClick={() => onValueChange(value)} className={`flex items-center justify-center gap-2 text-sm font-medium py-3 transition-colors border-r last:border-r-0 ${active ? 'bg-[#0D1B2A] text-white' : 'bg-white hover:bg-gray-100 text-gray-600'}`}>{children}</button>
  );
}
function TabsContent({ value, current, children }) { return value === current ? <div>{children}</div> : null; }

// ---------------- Badge simple ----------------
function Badge({ children, className = '' }) {
  return <span className={`inline-block px-2 py-1 text-xs font-medium rounded border ${className}`}>{children}</span>;
}

// ---------------- Componentes del Dashboard ----------------
export default function ClientDashboard() {
  const [activeTab, setActiveTab] = useState('new-order');
  const [orders, setOrders] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // Cargar pedidos almacenados al montar
  useEffect(() => {
    setOrders(loadOrders());
    // Cargar usuario actual
    try {
      const u = localStorage.getItem('usuarioActual');
      if (u) setCurrentUser(JSON.parse(u));
    } catch {}
  }, []);

  // Listen storage changes (admin edits)
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'expressia_orders' || e.key === 'storage_manual_refresh' || e.key === 'expressia_orders_rev') {
        setOrders(loadOrders());
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  // Persist and broadcast when local client creates
  useEffect(() => {
    if (orders && orders.length) {
      saveOrders(orders);
      broadcastOrdersChange();
    }
  }, [orders]);

  const handleCreateOrder = (order) => {
    setOrders(prev => [order, ...prev]);
  };

  // Filtrar pedidos que pertenecen al usuario actual (si existe uno)
  const visibleOrders = React.useMemo(() => {
    if (!currentUser) return orders; // si no hay usuario (modo legacy) se muestran todos
    return orders.filter(o => {
      if (!o.owner || (!o.owner.email && !o.owner.id)) return false; // pedidos sin dueño quedan ocultos
      // Comparar por email o id si existe
      if (o.owner.email && currentUser.email && o.owner.email === currentUser.email) return true;
      if (o.owner.id && currentUser.id && o.owner.id === currentUser.id) return true;
      return false;
    });
  }, [orders, currentUser]);

  return (
    <Layout title="Gestiona tus envios">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList value={activeTab} onValueChange={setActiveTab}>
          <TabsTrigger value="new-order">
            <Package className="h-4 w-4" /> <span className="hidden sm:inline">Nuevo Pedido</span>
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="h-4 w-4" /> <span className="hidden sm:inline">Historial</span>
          </TabsTrigger>
          <TabsTrigger value="tracking">
            <MapPin className="h-4 w-4" /> <span className="hidden sm:inline">Seguimiento</span>
          </TabsTrigger>
          <TabsTrigger value="schedule">
            <Calendar className="h-4 w-4" /> <span className="hidden sm:inline">Programar</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab} current="new-order"><OrderForm onCreate={handleCreateOrder} /></TabsContent>
  <TabsContent value={activeTab} current="history"><OrderHistory orders={visibleOrders} /></TabsContent>
  <TabsContent value={activeTab} current="tracking"><TrackingMap orders={visibleOrders} /></TabsContent>
        <TabsContent value={activeTab} current="schedule"><SchedulePlaceholder /></TabsContent>
      </Tabs>
    </Layout>
  );
}

// ---------------- Formulario de Pedido ----------------
function OrderForm({ onCreate }) {
  const [formData, setFormData] = useState({
    origin: '', destination: '', weight: '', length: '', width: '', height: '', modalidad: '', description: ''
  });
  const [estimatedCost, setEstimatedCost] = useState(null);

  const countries = [ 'Guatemala','Belice','El Salvador','Honduras','Nicaragua','Costa Rica','Panamá' ];
  const modalidades = [
    { value: 'express', label: 'Express (24-48h)', multiplier: 2.5 },
    { value: 'standard', label: 'Estándar (3-5 días)', multiplier: 1.5 },
    { value: 'economy', label: 'Económico (5-7 días)', multiplier: 1.0 }
  ];

  const calculateCost = () => {
    const weight = parseFloat(formData.weight) || 0;
    const volume = ((parseFloat(formData.length) || 0) * (parseFloat(formData.width) || 0) * (parseFloat(formData.height) || 0)) / 1000000;
    const modalidad = modalidades.find(m => m.value === formData.modalidad);
    const multiplier = modalidad?.multiplier || 1.5;
    const baseCost = Math.max(weight * 5, volume * 100) * multiplier;
    const internationalFee = formData.origin && formData.destination && formData.origin !== formData.destination ? 15 : 0;
    const total = baseCost + internationalFee + 5;
    setEstimatedCost(Math.round(total * 100) / 100);
  };

  const { push } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.origin || !formData.destination || !formData.weight || !formData.modalidad) {
      push('Completa los campos obligatorios marcados con *', { type: 'warning' });
      return;
    }
    const weightNum = parseFloat(formData.weight);
    if (isNaN(weightNum) || weightNum <= 0) {
      push('El peso debe ser un número mayor que cero.', { type: 'error' });
      return;
    }
    // Validar dimensiones si el usuario ingresó valores
    const dims = ['length','width','height'];
    for (const d of dims) {
      if (formData[d] !== '' && formData[d] !== null) {
        const v = parseFloat(formData[d]);
        if (isNaN(v) || v <= 0) {
          push(`La medida de ${d === 'length' ? 'largo' : d === 'width' ? 'ancho' : 'alto'} debe ser > 0 si se ingresa.`, { type: 'error' });
          return;
        }
      }
    }
    const orderNumber = 'EXP' + Math.random().toString(36).substr(2, 9).toUpperCase();
    // Obtener usuario actual para asociar pedido
    let currentUser = null;
    try { const u = localStorage.getItem('usuarioActual'); if (u) currentUser = JSON.parse(u); } catch {}
    const newOrder = {
      id: Date.now().toString(),
      orderNumber,
      origin: formData.origin,
      destination: formData.destination,
      status: 'pendiente',
      date: new Date().toISOString().split('T')[0],
      cost: estimatedCost || 0,
      weight: parseFloat(formData.weight) || 0,
      modalidad: formData.modalidad,
      description: formData.description,
      owner: currentUser ? {
        id: currentUser.id || null,
        name: `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || currentUser.email,
        email: currentUser.email
      } : null
    };
    if (onCreate) onCreate(newOrder);
    push(`Pedido ${orderNumber} creado ($${(estimatedCost || 0).toFixed(2)})`, { type: 'success' });
    setFormData({ origin: '', destination: '', weight: '', length: '', width: '', height: '', modalidad: '', description: '' });
    setEstimatedCost(null);
  };

  const inputClass = 'w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white';
  const labelClass = 'text-sm font-medium text-gray-700';
  const sectionCard = 'bg-white rounded-lg p-6 shadow-sm border';
  const sectionTitle = 'text-lg font-semibold text-[#0D1B2A] flex items-center gap-2';

  return (
    <div className={sectionCard}>
      <h3 className="text-xl font-semibold text-[#0D1B2A] mb-4 flex items-center gap-2">
        <Package className="h-5 w-5" /> Crear Nuevo Pedido
      </h3>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className={labelClass}>País de Origen *</label>
            <select value={formData.origin} onChange={e=>setFormData({...formData, origin: e.target.value})} className={inputClass}>
              <option value="">Selecciona</option>
              {countries.map(c=> <option key={c} value={c}>{c}</option> )}
            </select>
          </div>
          <div className="space-y-2">
            <label className={labelClass}>País de Destino *</label>
            <select value={formData.destination} onChange={e=>setFormData({...formData, destination: e.target.value})} className={inputClass}>
              <option value="">Selecciona</option>
              {countries.map(c=> <option key={c} value={c}>{c}</option> )}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className={sectionTitle}><Package className="h-4 w-4" /> Detalles del Paquete</h4>
          <div className="grid md:grid-cols-4 gap-4">
            {['weight','length','width','height'].map(field => {
              const label = field === 'weight'
                ? 'Peso (kg) *'
                : field === 'length'
                  ? 'Largo (cm)'
                  : field === 'width'
                    ? 'Ancho (cm)'
                    : 'Alto (cm)';
              const placeholder = field === 'weight' ? '0.00' : '0.00';
              const min = 0.01;
              return (
                <div className="space-y-1" key={field}>
                  <label className={labelClass}>{label}</label>
                  <input
                    type="number"
                    className={inputClass}
                    placeholder={placeholder}
                    step="0.01"
                    min={min}
                    value={formData[field]}
                    onChange={e=> {
                      const val = e.target.value;
                      // Evitar valores negativos inmediatamente
                      if (val.startsWith('-')) return;
                      setFormData({...formData,[field]:val});
                    }}
                    onBlur={e=> {
                      const val = e.target.value;
                      if (!val) return;
                      const num = parseFloat(val);
                      if (isNaN(num) || num <= 0) {
                        push(`${label} debe ser mayor que 0.`, { type: 'warning' });
                      }
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <label className={labelClass}>Modalidad de Envío *</label>
          <select value={formData.modalidad} onChange={e=>setFormData({...formData, modalidad: e.target.value})} className={inputClass}>
            <option value="">Selecciona</option>
            {modalidades.map(m=> <option key={m.value} value={m.value}>{m.label}</option> )}
          </select>
        </div>

        <div className="space-y-2">
          <label className={labelClass}>Descripción del Contenido</label>
          <textarea
            className={`${inputClass} h-24 resize-y`}
            placeholder="Describe brevemente el contenido de tu paquete"
            value={formData.description}
            onChange={e=>setFormData({...formData, description: e.target.value})}
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <button
            type="button"
            onClick={calculateCost}
            disabled={!formData.weight || !formData.modalidad}
            className="group inline-flex items-center gap-3 px-6 py-3 rounded-xl text-base font-semibold bg-gradient-to-r from-[#0D1B2A] to-[#14324c] text-white shadow-sm hover:shadow-lg hover:from-[#11263a] hover:to-[#173d58] transition disabled:opacity-50 disabled:shadow-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F77F00] focus:ring-offset-white"
          >
            <Calculator className="h-5 w-5 group-hover:scale-110 transition-transform" />
            <span>Calcular Costo</span>
          </button>
          {estimatedCost !== null && (
            <div className="relative overflow-hidden rounded-xl bg-white/90 backdrop-blur border border-[#F77F00]/40 shadow-sm flex items-center gap-5 px-6 py-5">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-50 via-transparent to-sky-50 pointer-events-none" />
              <div className="relative">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[#F77F00] mb-1">Costo Estimado</p>
                <p className="text-2xl font-bold text-[#0D1B2A] tabular-nums">${estimatedCost.toFixed(2)} <span className="text-sm font-medium text-slate-500">USD</span></p>
              </div>
              <div className="hidden sm:block h-10 w-px bg-gradient-to-b from-transparent via-[#F77F00]/40 to-transparent" />
              <div className="relative hidden sm:flex flex-col text-[11px] text-slate-600 leading-tight">
                <span>Incluye base + modalidad</span>
                <span className="text-slate-500">(Estimación previa)</span>
              </div>
            </div>
          )}
        </div>

        <div className="pt-4 border-t">
          <button type="submit" disabled={!estimatedCost} className="w-full bg-[#0D1B2A] hover:bg-[#1a2f45] text-white font-medium py-2 rounded-md disabled:opacity-50">
            Confirmar Pedido
          </button>
        </div>
      </form>
    </div>
  );
}

// ---------------- Historial de Pedidos (Mock) ----------------
function OrderHistory({ orders }) {
  const hasOrders = orders && orders.length > 0;

  const statusStyles = {
    entregado: 'bg-green-100 text-green-800 border-green-200',
    'en-transito': 'bg-blue-100 text-blue-800 border-blue-200',
    pendiente: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    cancelado: 'bg-red-100 text-red-800 border-red-200'
  };

  const iconFor = (status) => ({entregado:'✅','en-transito':'🚚',pendiente:'⏳',cancelado:'❌'}[status] || '📦');

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="text-xl font-semibold text-[#0D1B2A] mb-2 flex items-center gap-2"><Package className="h-5 w-5" /> Historial de Pedidos</h3>
        <p className="text-gray-600 mb-4">Revisa el estado y detalles de todos tus envíos</p>
        <div className="space-y-4">
          {hasOrders && orders.map(o => (
            <div key={o.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{iconFor(o.status)}</span>
                    <div>
                      <h4 className="font-semibold text-[#0D1B2A]">{o.orderNumber}</h4>
                      <p className="text-xs text-gray-600 flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(o.date).toLocaleDateString('es-ES')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {o.origin} → {o.destination}</span>
                    {o.owner && <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-md">{o.owner.name}</span>}
                    <span>{o.weight} kg</span>
                    <span className="font-semibold text-[#0D1B2A]">${o.cost.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={`${statusStyles[o.status]} capitalize`}>{o.status.replace('-', ' ')}</Badge>
                  <button className="text-sm px-3 py-2 border rounded-md bg-white hover:bg-gray-50 flex items-center gap-1">Detalles</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {!hasOrders && (
          <div className="text-center py-8 text-gray-500">
            <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No tienes pedidos registrados aún</p>
            <p className="text-sm">¡Crea tu primer envío para comenzar!</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------- Seguimiento (Mock) ----------------
function TrackingMap({ orders }) {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const buildTimeline = (order) => {
    // Usar timeline personalizada si existe (creada por administrador)
    const timeline = order.tracking?.timeline && Array.isArray(order.tracking.timeline)
      ? order.tracking.timeline
      : (() => {
          const baseDate = new Date(order.date);
          const addDays = d => { const nd = new Date(baseDate); nd.setDate(nd.getDate()+d); return nd.toISOString().split('T')[0]; };
          const status = order.status;
          return [
            { status: 'Pedido Confirmado', location: order.origin, date: addDays(0), time: '09:00', completed: true },
            { status: 'Recogido por Transportista', location: order.origin, date: addDays(0), time: '14:15', completed: status !== 'pendiente' },
            { status: 'En Tránsito', location: `En ruta hacia ${order.destination}`, date: addDays(1), time: '11:45', completed: status === 'en-transito' || status === 'entregado' },
            { status: 'En Distribución Local', location: order.destination, date: addDays(2), time: 'Estimado', completed: status === 'entregado' },
            { status: 'Entregado', location: order.destination, date: addDays(2), time: 'Estimado', completed: status === 'entregado' }
          ];
        })();
    // Derivar status y progreso desde timeline si es posible
    const delivered = timeline.find(s=>s.status==='Entregado')?.completed;
    const inTransit = timeline.find(s=>s.status==='En Tránsito')?.completed;
    const rawStatus = order.status === 'cancelado' ? 'cancelado' : delivered ? 'entregado' : inTransit ? 'en-transito' : 'pendiente';
    const progress = rawStatus === 'entregado' ? 100 : rawStatus === 'en-transito' ? 60 : rawStatus === 'pendiente' ? 25 : 15;
    const currentLocation = (() => {
      const firstIncomplete = timeline.find(t=>!t.completed);
      if (firstIncomplete) return firstIncomplete.location;
      return timeline[timeline.length-1].location;
    })();
    const estimatedDelivery = timeline[timeline.length-1].date;
    return {
      orderNumber: order.orderNumber,
      status: rawStatus === 'pendiente' ? 'Pendiente' : rawStatus === 'en-transito' ? 'En Tránsito' : rawStatus === 'entregado' ? 'Entregado' : rawStatus,
      currentLocation,
      estimatedDelivery,
      progress,
      timeline
    };
  };

  const demoMock = {
    orderNumber: 'EXP2024002',
    status: 'En Tránsito',
    currentLocation: 'Centro de Distribución - Tegucigalpa, Honduras',
    estimatedDelivery: '2025-09-30',
    progress: 65,
    timeline: [
      { status: 'Pedido Confirmado', location: 'San Salvador, El Salvador', date: '2025-09-24', time: '09:30', completed: true },
      { status: 'Recogido por Transportista', location: 'San Salvador, El Salvador', date: '2025-09-24', time: '14:15', completed: true },
      { status: 'En Tránsito', location: 'Tegucigalpa, Honduras', date: '2025-09-25', time: '11:45', completed: true },
      { status: 'En Distribución Local', location: 'Tegucigalpa, Honduras', date: '2025-09-30', time: 'Estimado', completed: false },
      { status: 'Entregado', location: 'Dirección de Destino', date: '2025-09-30', time: 'Estimado', completed: false }
    ]
  };

  const { push } = useToast();
  const track = () => {
    if (!trackingNumber.trim()) { push('Ingresa un número de seguimiento', { type: 'warning' }); return; }
    setLoading(true);
    setTimeout(() => {
      const numberUp = trackingNumber.toUpperCase();
      if (numberUp === 'EXP2024002') {
        setInfo(demoMock);
  push('Usa este número para probar el flujo completo.', { type: 'info', title: 'Paquete demo encontrado' });
      } else {
        const order = orders.find(o => o.orderNumber === numberUp);
        if (order) {
          setInfo(buildTimeline(order));
          push(`Seguimiento disponible para ${order.orderNumber}`, { type: 'success', title: 'Pedido encontrado' });
        } else {
          setInfo(null);
          push('Verifica el código e inténtalo nuevamente.', { type: 'error', title: 'Pedido no encontrado' });
        }
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="text-xl font-semibold text-[#0D1B2A] mb-2 flex items-center gap-2"><MapPin className="h-5 w-5" /> Seguimiento de Paquete</h3>
        <p className="text-gray-600 mb-4">Ingresa tu número de seguimiento</p>
        <div className="flex gap-2 flex-col sm:flex-row">
          <input value={trackingNumber} onChange={e=>setTrackingNumber(e.target.value)} onKeyDown={e=> e.key==='Enter' && track()} placeholder="Ej: EXP2024002" className="flex-1 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <button onClick={track} disabled={loading} className="px-4 py-2 bg-[#F77F00] hover:bg-[#e6720a] text-white rounded-md text-sm font-medium disabled:opacity-50">{loading ? 'Buscando...' : 'Rastrear'}</button>
        </div>
      </div>
      {info && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Panel Ubicación y Progreso */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(247,127,0,0.12),transparent_70%),radial-gradient(circle_at_85%_80%,rgba(14,116,144,0.15),transparent_65%)] pointer-events-none" />
            <div className="relative flex flex-col lg:flex-row items-center gap-8">
              <div className="relative w-28 h-28">
                <div className="absolute inset-0 rounded-full" style={{ background: `conic-gradient(#F77F00 ${info.progress}%, #e5e7eb ${info.progress}%)` }} />
                <div className="absolute inset-2 rounded-full bg-white flex flex-col items-center justify-center text-center">
                  <span className="text-xl font-bold text-[#0D1B2A] tabular-nums">{info.progress}%</span>
                  <span className="text-[10px] uppercase tracking-wide text-gray-500 leading-tight">Progreso</span>
                </div>
              </div>
              <div className="flex-1 space-y-4 w-full">
                <div className="flex items-start gap-3">
                  <div className="bg-[#F77F00] rounded-xl p-3 shadow text-white">
                    <Truck className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-[#0D1B2A] text-lg leading-snug">Ubicación Actual</h4>
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">{info.currentLocation}</p>
                    <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-200">
                      <span className="inline-block w-2 h-2 rounded-full bg-blue-500 animate-pulse" /> {info.status}
                    </div>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-white/70 backdrop-blur rounded-lg border border-slate-200 p-4 flex flex-col gap-1">
                    <span className="text-[11px] uppercase tracking-wide text-gray-500 font-semibold">Número</span>
                    <span className="font-mono text-sm font-semibold text-[#0D1B2A]">{info.orderNumber}</span>
                  </div>
                  <div className="bg-white/70 backdrop-blur rounded-lg border border-slate-200 p-4 flex flex-col gap-1">
                    <span className="text-[11px] uppercase tracking-wide text-gray-500 font-semibold">Entrega Estimada</span>
                    <span className="text-sm font-semibold text-[#0D1B2A]">{new Date(info.estimatedDelivery).toLocaleDateString('es-ES')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Timeline */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(14,116,144,0.12),transparent_70%)] pointer-events-none" />
            <div className="relative">
              <h4 className="font-semibold text-[#0D1B2A] mb-1 flex items-center gap-2"><Package className="h-5 w-5" /> Historial de Movimientos</h4>
              <p className="text-gray-600 text-sm mb-6">Seguimiento detallado del paquete <span className="font-semibold">{info.orderNumber}</span></p>
              <div className="space-y-4 relative">
                {/* Línea base continua detrás de todos los pasos */}
                <div className="absolute left-[9px] top-0 bottom-0 w-px bg-gradient-to-b from-gray-200 via-gray-300 to-gray-200 pointer-events-none" />
                {info.timeline.map((ev, i) => {
                  const isLast = i === info.timeline.length - 1;
                  const state = ev.completed ? 'done' : (info.timeline.findIndex(t=>!t.completed) === i ? 'current' : 'pending');
                  return (
                    <div key={i} className="relative pl-10 pb-4 group">
                      <div className="absolute left-0 top-1 flex flex-col items-center">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold transition shadow-sm ${state==='done' ? 'bg-[#F77F00] border-[#F77F00] text-white' : state==='current' ? 'bg-white border-[#F77F00] text-[#F77F00] animate-pulse' : 'bg-white border-gray-300 text-gray-400'}`}>{state==='done'?'✓':state==='current'?'•':''}</div>
                        {!isLast && <div className={`flex-1 w-[2px] mt-1 transition ${ev.completed ? 'bg-[#F77F00] shadow-inner' : 'bg-transparent'}`}></div>}
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex flex-wrap justify-between gap-2">
                          <h5 className={`font-medium text-sm ${state==='done' ? 'text-[#0D1B2A]' : state==='current' ? 'text-[#F77F00]' : 'text-gray-500'}`}>{ev.status}</h5>
                          <span className="text-[11px] font-mono text-gray-500">{ev.date} {ev.time}</span>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">{ev.location}</p>
                        {state==='current' && (
                          <div className="mt-2 text-[11px] text-[#F77F00] font-semibold tracking-wide">En progreso...</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
      {!info && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <Package className="h-12 w-12 mx-auto mb-4 text-blue-600" />
          <h4 className="font-semibold text-blue-900 mb-2">Demo de Seguimiento</h4>
          <p className="text-blue-700 mb-4">Para probar el sistema usa el número: <strong>EXP2024002</strong></p>
          <button onClick={()=> { setTrackingNumber('EXP2024002'); track(); }} className="px-4 py-2 border border-blue-300 rounded-md text-sm text-blue-700 hover:bg-blue-100">Probar Demo</button>
        </div>
      )}
    </div>
  );
}

// ---------------- Programar (placeholder) ----------------
function SchedulePlaceholder() {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border">
      <h3 className="text-xl font-semibold text-[#0D1B2A] mb-4">Programar Envío Futuro</h3>
      <p className="text-gray-600 mb-4">Funcionalidad en desarrollo - Próximamente podrás programar envíos para fechas futuras</p>
      <div className="bg-gray-100 p-4 rounded-lg text-sm text-gray-700">
        Esta función permitirá programar envíos con hasta 30 días de anticipación, ideal para entregas especiales.
      </div>
    </div>
  );
}

