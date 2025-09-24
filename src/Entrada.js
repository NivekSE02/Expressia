// Nueva implementación solicitada: Panel de Cliente con Tabs (Pedido, Historial, Seguimiento, Programar)
import React, { useState, useEffect } from 'react';
import { Package, History, MapPin, Calendar, Calculator, Truck, Clock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from './Img/expressia.png';


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

  // Cargar pedidos almacenados al montar
  useEffect(() => {
    try {
      const stored = localStorage.getItem('expressia_orders');
      if (stored) setOrders(JSON.parse(stored));
    } catch {}
  }, []);

  // Persistir pedidos cuando cambien
  useEffect(() => {
    localStorage.setItem('expressia_orders', JSON.stringify(orders));
  }, [orders]);

  const handleCreateOrder = (order) => {
    setOrders(prev => [order, ...prev]);
  };

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
        <TabsContent value={activeTab} current="history"><OrderHistory orders={orders} /></TabsContent>
        <TabsContent value={activeTab} current="tracking"><TrackingMap orders={orders} /></TabsContent>
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.origin || !formData.destination || !formData.weight || !formData.modalidad) {
      alert('Por favor completa los campos obligatorios');
      return;
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
    alert(`Pedido creado. Número: ${orderNumber}. Costo estimado: $${(estimatedCost || 0).toFixed(2)}`);
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
            {['weight','length','width','height'].map(field => (
              <div className="space-y-1" key={field}>
                <label className={labelClass}>
                  {field === 'weight' ? 'Peso (kg) *' : field.charAt(0).toUpperCase()+field.slice(1)+' (cm)'}
                </label>
                <input type="number" className={inputClass} value={formData[field]} onChange={e=>setFormData({...formData,[field]:e.target.value})} />
              </div>
            ))}
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
          <textarea className={`${inputClass} h-24 resize-y`} value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})} />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-start">
          <button type="button" onClick={calculateCost} disabled={!formData.weight || !formData.modalidad} className="inline-flex items-center gap-2 px-4 py-2 bg-white border rounded-md text-sm font-medium hover:bg-gray-50 disabled:opacity-50">
            <Calculator className="h-4 w-4" /> Calcular Costo
          </button>
          {estimatedCost !== null && (
            <Badge className="bg-[#F77F00] border-[#F77F00] text-white text-sm">Costo Estimado: ${estimatedCost.toFixed(2)} USD</Badge>
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
    const baseDate = new Date(order.date);
    const addDays = d => { const nd = new Date(baseDate); nd.setDate(nd.getDate()+d); return nd.toISOString().split('T')[0]; };
    const status = order.status;
    const timeline = [
      { status: 'Pedido Confirmado', location: order.origin, date: addDays(0), time: '09:00', completed: true },
      { status: 'Preparando Envío', location: order.origin, date: addDays(0), time: '12:00', completed: status !== 'pendiente' },
      { status: 'En Tránsito', location: `En ruta hacia ${order.destination}`, date: addDays(1), time: '08:00', completed: status === 'en-transito' || status === 'entregado' },
      { status: 'En Distribución Local', location: order.destination, date: addDays(2), time: 'Estimado', completed: status === 'entregado' },
      { status: 'Entregado', location: order.destination, date: addDays(2), time: 'Estimado', completed: status === 'entregado' }
    ];
    let progress = 15;
    if (status === 'pendiente') progress = 25;
    else if (status === 'en-transito') progress = 60;
    else if (status === 'entregado') progress = 100;
    return {
      orderNumber: order.orderNumber,
      status: status === 'pendiente' ? 'Pendiente' : status === 'en-transito' ? 'En Tránsito' : status === 'entregado' ? 'Entregado' : status,
      currentLocation: timeline.find(t => !t.completed)?.location || order.destination,
      estimatedDelivery: timeline[4].date,
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

  const track = () => {
    if (!trackingNumber.trim()) { alert('Ingresa un número de seguimiento'); return; }
    setLoading(true);
    setTimeout(() => {
      const numberUp = trackingNumber.toUpperCase();
      if (numberUp === 'EXP2024002') {
        setInfo(demoMock);
        alert('Paquete demo encontrado');
      } else {
        const order = orders.find(o => o.orderNumber === numberUp);
        if (order) {
          setInfo(buildTimeline(order));
          alert('Pedido encontrado');
        } else {
          setInfo(null);
          alert('Número no encontrado');
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
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h4 className="font-semibold text-[#0D1B2A] mb-4 flex items-center gap-2"><Truck className="h-5 w-5" /> Ubicación Actual</h4>
            <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg p-6 border-2 border-dashed border-gray-300 min-h-[260px] flex flex-col items-center justify-center">
              <div className="text-center space-y-4">
                <div className="bg-[#F77F00] p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center animate-pulse">
                  <Truck className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h5 className="font-semibold text-[#0D1B2A] mb-2">{info.currentLocation}</h5>
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">{info.status}</Badge>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm w-full">
                  <p className="text-sm text-gray-600 mb-2">Progreso del Envío</p>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-[#F77F00] h-3 rounded-full" style={{ width: `${info.progress}%` }} />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{info.progress}% completado</p>
                </div>
              </div>
            </div>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg text-sm text-blue-800 flex items-center gap-2"><Clock className="h-4 w-4" />Entrega estimada: {new Date(info.estimatedDelivery).toLocaleDateString('es-ES')}</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h4 className="font-semibold text-[#0D1B2A] mb-1 flex items-center gap-2"><Package className="h-5 w-5" /> Historial de Movimientos</h4>
            <p className="text-gray-600 text-sm mb-4">Seguimiento detallado del paquete {info.orderNumber}</p>
            <div className="space-y-4">
              {info.timeline.map((ev, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-4 h-4 rounded-full border-2 ${ev.completed ? 'bg-[#F77F00] border-[#F77F00]' : 'bg-white border-gray-300'}`} />
                    {i < info.timeline.length - 1 && <div className={`w-0.5 flex-1 ${ev.completed ? 'bg-[#F77F00]' : 'bg-gray-300'}`} />}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex justify-between items-start mb-1">
                      <h5 className={`font-medium ${ev.completed ? 'text-[#0D1B2A]' : 'text-gray-500'}`}>{ev.status}</h5>
                      <span className="text-xs text-gray-500">{ev.date} {ev.time}</span>
                    </div>
                    <p className="text-sm text-gray-600">{ev.location}</p>
                  </div>
                </div>
              ))}
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

