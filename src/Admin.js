
import React, { useState, useEffect } from 'react';
import { Package, BarChart3, Settings, TrendingUp, Truck, DollarSign, Fuel, Search, Edit, Eye, MapPin, X } from 'lucide-react';
import { loadOrders, saveOrders, ensureSeedOrders, broadcastOrdersChange } from './storage';
import { useToast } from './toast';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Input } from './components/ui/input';
import { useNavigate } from 'react-router-dom';


function AdminLayout({ title, subtitle, children }) {
	const navigate = useNavigate();
	return (
		<div className="min-h-screen bg-gray-50 flex flex-col">
			<header className="bg-[#0D1B2A] text-white py-6 shadow">
				<div className="max-w-7xl mx-auto px-4 flex items-start justify-between gap-4">
					<div>
						<h1 className="text-2xl font-semibold">{title}</h1>
						{subtitle && <p className="text-sm text-gray-300 mt-1">{subtitle}</p>}
					</div>
					<Button variant="outline" className="bg-transparent border-white/30 text-white hover:bg-white/10" onClick={()=>navigate('/')}>Inicio</Button>
				</div>
			</header>
			<main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">{children}</main>
			<footer className="bg-[#0D1B2A] text-gray-300 text-center py-4 text-sm">© 2025 Expressia</footer>
		</div>
	);
}

function Tabs({ children }) { return <div>{children}</div>; }
function TabsList({ children, value, onValueChange }) {
	return (
		<div className="grid grid-cols-3 gap-2 bg-white border rounded-lg overflow-hidden mb-6">
			{React.Children.map(children, child => React.isValidElement(child) ? React.cloneElement(child, { activeValue: value, onValueChange }) : child)}
		</div>
	);
}
function TabsTrigger({ value, activeValue, onValueChange, children }) {
	const active = value === activeValue;
	return (
		<button type="button" onClick={()=>onValueChange(value)} className={`flex items-center justify-center gap-2 text-sm font-medium py-3 transition-colors border-r last:border-r-0 ${active ? 'bg-[#0D1B2A] text-white' : 'bg-white hover:bg-gray-100 text-gray-600'}`}>{children}</button>
	);
}
function TabsContent({ value, current, children }) { return value === current ? <div>{children}</div> : null; }

// Badge simple
function Badge({ children, className='' }) { return <span className={`inline-block px-2 py-1 text-xs font-medium rounded border ${className}`}>{children}</span>; }

export default function Admin() {
	const [activeTab, setActiveTab] = useState('orders');
	return (
		<AdminLayout title="Panel de Administración" subtitle="Gestión y métricas del sistema">
			<Tabs value={activeTab} onValueChange={setActiveTab}>
				<TabsList value={activeTab} onValueChange={setActiveTab}>
					<TabsTrigger value="orders"><Package className="h-4 w-4" /> <span className="hidden sm:inline">Pedidos</span></TabsTrigger>
					<TabsTrigger value="metrics"><BarChart3 className="h-4 w-4" /> <span className="hidden sm:inline">Métricas</span></TabsTrigger>
					<TabsTrigger value="settings"><Settings className="h-4 w-4" /> <span className="hidden sm:inline">Configuración</span></TabsTrigger>
				</TabsList>
				<TabsContent value={activeTab} current="orders"><OrdersTable Badge={Badge} /></TabsContent>
				<TabsContent value={activeTab} current="metrics"><MetricsPanel Badge={Badge} /></TabsContent>
				<TabsContent value={activeTab} current="settings"><SettingsPlaceholder /></TabsContent>
			</Tabs>
		</AdminLayout>
	);
}

function MetricsPanel({ Badge }) {
	const metrics = {
		totalOrders: 1247,
		deliveredOrders: 1089,
		inTransitOrders: 98,
		pendingOrders: 45,
		canceledOrders: 15,
		totalRevenue: 45680.50,
		fuelConsumption: 2340.75,
		averageDeliveryTime: 2.8,
		customerSatisfaction: 94.5
	};
	const monthlyData = [
		{ month: 'Ene', orders: 89, revenue: 3240 },
		{ month: 'Feb', orders: 102, revenue: 3890 },
		{ month: 'Mar', orders: 125, revenue: 4560 },
		{ month: 'Abr', orders: 143, revenue: 5120 },
		{ month: 'May', orders: 167, revenue: 6230 },
		{ month: 'Jun', orders: 189, revenue: 7150 }
	];
	const topRoutes = [
		{ route: 'Guatemala → Costa Rica', orders: 234, revenue: 8940 },
		{ route: 'El Salvador → Honduras', orders: 198, revenue: 6780 },
		{ route: 'Nicaragua → Panamá', orders: 156, revenue: 5670 },
		{ route: 'Costa Rica → Guatemala', orders: 143, revenue: 4890 },
		{ route: 'Panamá → El Salvador', orders: 121, revenue: 4230 }
	];
	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-gray-600">Total Pedidos</p><p className="text-2xl font-bold text-[#0D1B2A]">{metrics.totalOrders.toLocaleString()}</p></div><div className="bg-[#F77F00] p-3 rounded-full"><Package className="h-6 w-6 text-white" /></div></div><div className="mt-2 flex items-center"><TrendingUp className="h-4 w-4 text-green-500 mr-1" /><span className="text-sm text-green-600">+12.5% vs mes anterior</span></div></CardContent></Card>
				<Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-gray-600">Ingresos Totales</p><p className="text-2xl font-bold text-[#0D1B2A]">${metrics.totalRevenue.toLocaleString()}</p></div><div className="bg-green-500 p-3 rounded-full"><DollarSign className="h-6 w-6 text-white" /></div></div><div className="mt-2 flex items-center"><TrendingUp className="h-4 w-4 text-green-500 mr-1" /><span className="text-sm text-green-600">+8.3% vs mes anterior</span></div></CardContent></Card>
				<Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-gray-600">Tiempo Promedio</p><p className="text-2xl font-bold text-[#0D1B2A]">{metrics.averageDeliveryTime} días</p></div><div className="bg-blue-500 p-3 rounded-full"><Truck className="h-6 w-6 text-white" /></div></div><div className="mt-2 flex items-center"><span className="text-sm text-blue-600">Tiempo de entrega</span></div></CardContent></Card>
				<Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-gray-600">Combustible</p><p className="text-2xl font-bold text-[#0D1B2A]">{metrics.fuelConsumption}L</p></div><div className="bg-red-500 p-3 rounded-full"><Fuel className="h-6 w-6 text-white" /></div></div><div className="mt-2 flex items-center"><span className="text-sm text-red-600">Consumo mensual</span></div></CardContent></Card>
			</div>
			<Card><CardHeader><CardTitle className="flex items-center gap-2 text-[#0D1B2A]"><BarChart3 className="h-5 w-5" />Distribución de Estados</CardTitle><CardDescription>Estado actual de todos los pedidos</CardDescription></CardHeader><CardContent><div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				<div className="text-center p-4 bg-green-50 rounded-lg"><div className="text-3xl font-bold text-green-600 mb-2">{metrics.deliveredOrders}</div><Badge className="bg-green-100 text-green-800">Entregados</Badge><div className="text-sm text-green-600 mt-1">{((metrics.deliveredOrders/metrics.totalOrders)*100).toFixed(1)}%</div></div>
				<div className="text-center p-4 bg-blue-50 rounded-lg"><div className="text-3xl font-bold text-blue-600 mb-2">{metrics.inTransitOrders}</div><Badge className="bg-blue-100 text-blue-800">En Tránsito</Badge><div className="text-sm text-blue-600 mt-1">{((metrics.inTransitOrders/metrics.totalOrders)*100).toFixed(1)}%</div></div>
				<div className="text-center p-4 bg-yellow-50 rounded-lg"><div className="text-3xl font-bold text-yellow-600 mb-2">{metrics.pendingOrders}</div><Badge className="bg-yellow-100 text-yellow-800">Pendientes</Badge><div className="text-sm text-yellow-600 mt-1">{((metrics.pendingOrders/metrics.totalOrders)*100).toFixed(1)}%</div></div>
				<div className="text-center p-4 bg-red-50 rounded-lg"><div className="text-3xl font-bold text-red-600 mb-2">{metrics.canceledOrders}</div><Badge className="bg-red-100 text-red-800">Cancelados</Badge><div className="text-sm text-red-600 mt-1">{((metrics.canceledOrders/metrics.totalOrders)*100).toFixed(1)}%</div></div>
			</div></CardContent></Card>
			<div className="grid lg:grid-cols-2 gap-6">
				<Card><CardHeader><CardTitle className="text-[#0D1B2A]">Tendencias Mensuales</CardTitle><CardDescription>Pedidos e ingresos por mes</CardDescription></CardHeader><CardContent><div className="space-y-4">{monthlyData.map((d,i)=>(<div key={d.month} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"><div className="flex items-center gap-3"><div className="w-12 h-12 bg-[#F77F00] rounded-lg flex items-center justify-center text-white font-semibold">{d.month}</div><div><p className="font-semibold text-[#0D1B2A]">{d.orders} pedidos</p><p className="text-sm text-gray-600">${d.revenue.toLocaleString()}</p></div></div><div className="text-right"><div className="w-24 h-2 bg-gray-200 rounded-full"><div className="h-2 bg-[#F77F00] rounded-full" style={{width: `${(d.orders/200)*100}%`}}></div></div></div></div>))}</div></CardContent></Card>
				<Card><CardHeader><CardTitle className="text-[#0D1B2A]">Rutas Más Populares</CardTitle><CardDescription>Rutas con mayor volumen</CardDescription></CardHeader><CardContent><div className="space-y-4">{topRoutes.map((r,i)=>(<div key={i} className="flex items-center justify-between p-3 border rounded-lg"><div className="flex items-center gap-3"><div className="w-8 h-8 bg-[#0D1B2A] rounded-full flex items-center justify-center text-white text-sm font-semibold">{i+1}</div><div><p className="font-semibold text-[#0D1B2A]">{r.route}</p><p className="text-sm text-gray-600">{r.orders} pedidos</p></div></div><div className="text-right"><p className="font-semibold text-[#F77F00]">${r.revenue.toLocaleString()}</p></div></div>))}</div></CardContent></Card>
			</div>
			<Card><CardHeader><CardTitle className="text-[#0D1B2A]">Indicadores de Rendimiento</CardTitle><CardDescription>Métricas clave del sistema</CardDescription></CardHeader><CardContent><div className="grid md:grid-cols-3 gap-6">
				<div className="text-center"><div className="text-4xl font-bold text-[#F77F00] mb-2">{metrics.customerSatisfaction}%</div><p className="text-sm text-gray-600">Satisfacción</p><div className="w-full bg-gray-200 rounded-full h-2 mt-2"><div className="bg-[#F77F00] h-2 rounded-full" style={{width: `${metrics.customerSatisfaction}%`}}></div></div></div>
				<div className="text-center"><div className="text-4xl font-bold text-green-600 mb-2">98.2%</div><p className="text-sm text-gray-600">Tasa de Entrega</p><div className="w-full bg-gray-200 rounded-full h-2 mt-2"><div className="bg-green-600 h-2 rounded-full" style={{width:'98.2%'}}></div></div></div>
				<div className="text-center"><div className="text-4xl font-bold text-blue-600 mb-2">15.3</div><p className="text-sm text-gray-600">Km/L Promedio</p><div className="w-full bg-gray-200 rounded-full h-2 mt-2"><div className="bg-blue-600 h-2 rounded-full" style={{width:'76%'}}></div></div></div>
			</div></CardContent></Card>
		</div>
	);
}

function OrdersTable({ Badge }) {
	const [searchTerm, setSearchTerm] = useState('');
	const [statusFilter, setStatusFilter] = useState('all');
	const [orders, setOrders] = useState([]);
	// Nuevos estados para gestión de tracking
	const [trackingEditOrder, setTrackingEditOrder] = useState(null);
	const [draftTimeline, setDraftTimeline] = useState([]); // timeline editable
	const [savingTracking, setSavingTracking] = useState(false);
	const [viewTrackingOrder, setViewTrackingOrder] = useState(null); // solo lectura

	// Construye timeline inicial si el pedido no la tiene
	const buildInitialTimeline = (order) => {
		const baseDate = new Date(order.date);
		const addDays = d => { const nd = new Date(baseDate); nd.setDate(nd.getDate()+d); return nd.toISOString().split('T')[0]; };
		return [
			{ status: 'Pedido Confirmado', location: order.origin, date: addDays(0), time: '09:00', completed: true },
			{ status: 'Recogido por Transportista', location: order.origin, date: addDays(0), time: '14:15', completed: order.status !== 'pendiente' },
			{ status: 'En Tránsito', location: `En ruta hacia ${order.destination}`, date: addDays(1), time: '11:45', completed: order.status === 'en-transito' || order.status === 'entregado' },
			{ status: 'En Distribución Local', location: order.destination, date: addDays(2), time: 'Estimado', completed: order.status === 'entregado' },
			{ status: 'Entregado', location: order.destination, date: addDays(2), time: 'Estimado', completed: order.status === 'entregado' }
		];
	};

	const deriveStatusFromTimeline = (timeline, currentStatus) => {
		if (currentStatus === 'cancelado') return 'cancelado';
		const delivered = timeline.find(s=>s.status==='Entregado')?.completed;
		if (delivered) return 'entregado';
		const inTransit = timeline.find(s=>s.status==='En Tránsito')?.completed;
		if (inTransit) return 'en-transito';
		return 'pendiente';
	};


	useEffect(() => {
		// Sembrar si vacío (una sola vez) y cargar
		const seeded = ensureSeedOrders(buildInitialTimeline);
		// fusionar tracking faltante
		const enhanced = (seeded.length ? seeded : loadOrders()).map(o => o.tracking?.timeline ? o : { ...o, tracking:{ timeline: buildInitialTimeline(o) } });
		setOrders(enhanced);
	}, []);

	// Suscribirse a cambios externos (otra pestaña / cliente creando pedidos)
	useEffect(() => {
		const unsub = window.addEventListener ? ( () => {
			const handler = () => setOrders(prev => {
				const latest = loadOrders();
				// mantener modificaciones locales si no están en latest? asumimos latest fuente de verdad
				return latest.map(o => o.tracking?.timeline ? o : { ...o, tracking:{ timeline: buildInitialTimeline(o) } });
			});
			window.addEventListener('storage', handler);
			return () => window.removeEventListener('storage', handler);
		})() : undefined;
		return unsub;
	}, []);

	// Helper para persistir inmediatamente y emitir broadcast
	const persistOrders = (updater) => {
		setOrders(prev => {
			const updated = typeof updater === 'function' ? updater(prev) : updater;
			saveOrders(updated);
			broadcastOrdersChange();
			return updated;
		});
	};

	const { push } = useToast();

	
	useEffect(() => {
		if (orders && orders.length) {
			saveOrders(orders);
			broadcastOrdersChange();
		}
	}, [orders]);
	const statusOptions = [
		{ value: 'pendiente', label: 'Pendiente' },
		{ value: 'en-transito', label: 'En Tránsito' },
		{ value: 'entregado', label: 'Entregado' },
		{ value: 'cancelado', label: 'Cancelado' }
	];
	const filtered = orders.filter(o => {
		const search = searchTerm.toLowerCase();
		const ownerName = o.owner?.name || '';
		const matchSearch = o.orderNumber.toLowerCase().includes(search) || ownerName.toLowerCase().includes(search);
		const matchStatus = statusFilter === 'all' || o.status === statusFilter;
		return matchSearch && matchStatus;
	});
	const updateStatus = (id, newStatus) => {
		persistOrders(o=> o.map(ord => ord.id===id? {
			...ord,
			status:newStatus,
			history:[...(ord.history||[]), { type:'status', at:new Date().toISOString(), value:newStatus }]
		} : ord));
		push(`Estado actualizado a ${newStatus}`, { type: 'info' });
	};

	const openTrackingEditor = (order) => {
		if (order.status === 'entregado') { push('No se puede editar tracking de un pedido entregado', { type:'warning' }); return; }
		let withTracking = order;
		if (!withTracking.tracking || !withTracking.tracking.timeline) {
			withTracking = { ...order, tracking: { timeline: buildInitialTimeline(order) } };
			setOrders(prev => prev.map(o => o.id===order.id ? withTracking : o));
		}
		setDraftTimeline(withTracking.tracking.timeline.map(ev => ({ ...ev })));
		setTrackingEditOrder(withTracking);
	};

	const closeTrackingEditor = () => { setTrackingEditOrder(null); setDraftTimeline([]); };

	const updateDraftEvent = (index, field, value) => {
		setDraftTimeline(tl => tl.map((ev,i) => i===index ? { ...ev, [field]: value } : ev));
	};

	const toggleCompleted = (index, value) => {
		setDraftTimeline(tl => tl.map((ev,i) => {
			if (i===index) {
				return { ...ev, completed: value };
			} else if (i>index && value===false) {
				return { ...ev, completed:false };
			}
			return ev;
		}));
	};

	// Validar orden cronológico (no permitir fecha anterior a la previa cuando ambas estén completadas o editar en general)
	const validateTimelineChronology = (timeline) => {
		let lastDate = null;
		let lastDateTime = null; // ISO string for combined date+time comparisons
		for (let i=0;i<timeline.length;i++) {
			const d = timeline[i].date;
			const time = timeline[i].time;
			if (d && /\d{4}-\d{2}-\d{2}/.test(d)) {
				if (lastDate && d < lastDate) {
					return { ok:false, index:i, message:`La fecha del paso ${i+1} es anterior a un paso previo` };
				}
				lastDate = d;
				// Si hay hora, validar cronológicamente también
				if (time && /\d{2}:\d{2}/.test(time)) {
					const currentDT = `${d}T${time.length===5 ? time+':00' : time}`;
					if (lastDateTime && currentDT < lastDateTime) {
						return { ok:false, index:i, message:`La hora del paso ${i+1} es anterior a un paso previo` };
					}
					lastDateTime = currentDT;
				}
			}
		}
		return { ok:true };
	};

	const saveTracking = () => {
		setSavingTracking(true);
		persistOrders(prev => prev.map(o => {
			if (o.id === trackingEditOrder.id) {
				const validation = validateTimelineChronology(draftTimeline);
				if (!validation.ok) {
					setSavingTracking(false);
					push(validation.message, { type:'error' });
					throw new Error('abort-save');
				}
				const newStatus = deriveStatusFromTimeline(draftTimeline, o.status);
				return { ...o, status: newStatus, tracking: { timeline: draftTimeline }, history:[...(o.history||[]), { type:'tracking', at:new Date().toISOString(), status:newStatus, snapshot: draftTimeline }] };
			}
			return o;
		}));
		setSavingTracking(false);
		closeTrackingEditor();
		push('Tracking actualizado y guardado', { type:'success' });
	};
	return (
		<Card>
			<CardHeader>
				<div className="flex items-start justify-between gap-4 flex-wrap">
					<div>
						<CardTitle className="flex items-center gap-2 text-[#0D1B2A]"><Package className="h-5 w-5" />Gestión de Pedidos</CardTitle>
						<CardDescription>Administra pedidos, tracking y exporta historial</CardDescription>
					</div>
					<div className="flex gap-2">
						<button onClick={() => {
							// Export TXT (legible)
							const lines = [];
							lines.push('HISTORIAL DE PEDIDOS');
							lines.push('Generado: '+ new Date().toLocaleString());
							lines.push('');
							orders.forEach(o => {
								lines.push(`Pedido: ${o.orderNumber}  Estado: ${o.status}`);
								(o.history||[]).forEach(h => {
									const val = h.value || h.status || '';
									lines.push(`  - [${h.type}] ${h.at} ${val ? '=> '+val : ''}`);
								});
								lines.push('');
							});
							const blob = new Blob([lines.join('\n')], { type:'text/plain' });
							const url = URL.createObjectURL(blob);
							const a = document.createElement('a'); a.href = url; a.download = 'historial_pedidos.txt'; a.click(); URL.revokeObjectURL(url);
							push('Exportado historial TXT', { type:'success' });
						}} className="px-3 py-2 text-xs rounded-md bg-gray-100 hover:bg-gray-200 border">TXT</button>
						<button onClick={async () => {
							// Export PDF (jsPDF) con tabla estética
							try {
								const { jsPDF } = await import('jspdf');
								const doc = new jsPDF({ orientation:'p', unit:'pt', format:'a4' });
								const marginX = 40;
								let y = 50;
								doc.setFontSize(18); doc.setTextColor(30,30,30); doc.text('Historial de Pedidos', marginX, y); y += 18;
								doc.setFontSize(10); doc.setTextColor(80,80,80); doc.text(`Generado: ${new Date().toLocaleString()}`, marginX, y); y += 20;
								// Resumen
								const total = orders.length;
								const delivered = orders.filter(o=>o.status==='entregado').length;
								const inTransit = orders.filter(o=>o.status==='en-transito').length;
								const pending = orders.filter(o=>o.status==='pendiente').length;
								const canceled = orders.filter(o=>o.status==='cancelado').length;
								doc.setFontSize(9); doc.setTextColor(50,50,50);
								doc.text(`Resumen: Total ${total} | Entregados ${delivered} | En Tránsito ${inTransit} | Pendientes ${pending} | Cancelados ${canceled}`, marginX, y); y+=16;
								// SECCION 1: Tabla de Pedidos
								doc.setFontSize(11); doc.setTextColor(30,30,30); doc.setFont(undefined,'bold');
								doc.text('Listado de Pedidos', marginX, y); y+=10; doc.setFont(undefined,'normal');
								const orderHeaders = ['Pedido','Fecha','Origen','Destino','Modalidad','Peso','Costo','Estado','Propietario'];
								const orderCols = [70,55,70,70,70,45,55,60,90]; // suma ~585
								let ox = marginX; const orderHeaderH = 18;
								doc.setFillColor(0,63,99); doc.setTextColor(255,255,255); doc.setFontSize(8); doc.setFont(undefined,'bold');
								orderHeaders.forEach((h,i)=>{ doc.rect(ox, y, orderCols[i], orderHeaderH, 'F'); doc.text(h, ox+4, y+12); ox+=orderCols[i]; });
								y+=orderHeaderH; doc.setFont(undefined,'normal');
								let orderAlt = false; doc.setTextColor(30,30,30);
								orders.forEach(o => {
									if (y > 780) { // nueva página y reimprimir encabezado
										doc.addPage(); y=50; doc.setFontSize(8); doc.setFillColor(0,63,99); doc.setTextColor(255,255,255); ox=marginX; orderHeaders.forEach((h,i)=>{ doc.rect(ox, y, orderCols[i], orderHeaderH, 'F'); doc.text(h, ox+4, y+12); ox+=orderCols[i];}); y+=orderHeaderH; doc.setTextColor(30,30,30); }
									if (orderAlt) { doc.setFillColor(245,245,245); doc.rect(marginX, y, orderCols.reduce((a,b)=>a+b,0), 14, 'F'); }
									doc.setFontSize(7);
									const vals = [
										o.orderNumber,
										o.date || '-',
										o.origin || '-',
										o.destination || '-',
										o.modalidad || '-',
										(o.weight!=null? o.weight+'kg':'-'),
										(o.cost!=null? '$'+(Number(o.cost).toFixed(2)):'-'),
										o.status || '-',
										o.owner?.name || '-'
									];
									let cx = marginX;
									vals.forEach((v,i)=>{ const w = orderCols[i]; const lines = doc.splitTextToSize(String(v), w-6); doc.text(lines, cx+3, y+10); cx+=w; });
									y+=14; orderAlt = !orderAlt;
								});
								y+=10;
								// SECCION 2: Eventos (historial) si existen
								const flatEvents = [];
								orders.forEach(o => (o.history||[]).forEach(h => flatEvents.push({
									order:o.orderNumber,
									status:o.status,
									type:h.type,
									when:h.at,
									value: h.value || h.status || ''
								})));
								if (flatEvents.length>0) {
									if (y > 720) { doc.addPage(); y=50; }
									doc.setFontSize(11); doc.setFont(undefined,'bold'); doc.setTextColor(30,30,30); doc.text('Eventos / Auditoría', marginX, y); y+=10; doc.setFont(undefined,'normal');
									const headers = ['Pedido','Estado','Tipo','Fecha/Hora','Valor'];
									const colWidths = [80,65,80,160,140];
									let x = marginX; const headerHeight = 18;
									doc.setFillColor(247,127,0); doc.setTextColor(255,255,255); doc.setFontSize(8); doc.setFont(undefined,'bold');
									headers.forEach((h,i)=>{ doc.rect(x, y, colWidths[i], headerHeight, 'F'); doc.text(h, x+4, y+12); x+=colWidths[i]; }); y+=headerHeight; doc.setFont(undefined,'normal'); doc.setTextColor(30,30,30);
									let rowAlt = false;
									flatEvents.forEach(ev => {
										if (y > 780) { doc.addPage(); y=50; x=marginX; doc.setFillColor(247,127,0); doc.setTextColor(255,255,255); headers.forEach((h,i)=>{ doc.rect(x, y, colWidths[i], headerHeight, 'F'); doc.text(h, x+4, y+12); x+=colWidths[i]; }); y+=headerHeight; doc.setTextColor(30,30,30); }
										if (rowAlt) { doc.setFillColor(245,245,245); doc.rect(marginX, y, colWidths.reduce((a,b)=>a+b,0), 14, 'F'); }
										doc.setFontSize(7); let cx = marginX;
										const cells = [ev.order, ev.status, ev.type, ev.when, ev.value];
										cells.forEach((c,i)=>{ const w = colWidths[i]; const lines = doc.splitTextToSize(String(c), w-6); doc.text(lines, cx+3, y+10); cx+=w; });
										y+=14; rowAlt = !rowAlt;
									});
								} else {
									if (y > 760) { doc.addPage(); y=50; }
									doc.setFontSize(9); doc.setTextColor(120,120,120); doc.text('No hay eventos / auditoría registrados.', marginX, y);
								}
								doc.save('historial_pedidos.pdf');
								push('Exportado PDF', { type:'success' });
							} catch(e) {
								console.error(e);
								push('Error exportando PDF. Instala dependencias.', { type:'error' });
							}
						}} className="px-3 py-2 text-xs rounded-md bg-gray-100 hover:bg-gray-200 border">PDF</button>
						<button onClick={async () => {
							// Export Excel (xlsx) con hoja resumen y ajustes de ancho
							try {
								const XLSX = await import('xlsx');
								// Hoja de pedidos (características principales)
								const pedidosHeader = ['Pedido','Fecha','Origen','Destino','Modalidad','Peso(kg)','Costo','$ Estado','Propietario','Descripción'];
								const pedidosData = orders.map(o => [
									o.orderNumber,
									o.date || '-',
									o.origin || '-',
									o.destination || '-',
									o.modalidad || '-',
									o.weight != null ? o.weight : '-',
									o.cost != null ? Number(o.cost).toFixed(2) : '-',
									o.status || '-',
									o.owner?.name || '-',
									o.description ? (o.description.length>40? o.description.slice(0,37)+'...' : o.description) : '-'
								]);
								const wsPedidos = XLSX.utils.aoa_to_sheet([['Listado de Pedidos'], pedidosHeader, ...pedidosData]);
								wsPedidos['!merges'] = [{ s:{ r:0,c:0 }, e:{ r:0,c:pedidosHeader.length-1 } }];
								wsPedidos['!cols'] = pedidosHeader.map((h,i)=>({ wch: Math.min(45, Math.max(12, (h.length+2), ...pedidosData.map(r => String(r[i]||'').length+2))) }));
								// Hoja de eventos / historial (auditoría)
								const eventosHeader = ['Pedido','Estado','Tipo','Fecha/Hora','Valor'];
								const eventosData = [];
								orders.forEach(o => (o.history||[]).forEach(h => eventosData.push([
									o.orderNumber,
									o.status,
									h.type,
									h.at,
									h.value || h.status || ''
								])));
								const wsEventos = XLSX.utils.aoa_to_sheet([['Eventos / Auditoría'], eventosHeader, ...eventosData]);
								wsEventos['!merges'] = [{ s:{ r:0,c:0 }, e:{ r:0,c:eventosHeader.length-1 } }];
								wsEventos['!cols'] = eventosHeader.map((h,i)=>({ wch: Math.min(60, Math.max(12, (h.length+2), ...eventosData.map(r => String(r[i]||'').length+2))) }));
								// Hoja resumen
								const summary = [
									['Resumen'],
									['Generado', new Date().toLocaleString()],
									['Total pedidos', orders.length],
									['Entregados', orders.filter(o=>o.status==='entregado').length],
									['En Tránsito', orders.filter(o=>o.status==='en-transito').length],
									['Pendientes', orders.filter(o=>o.status==='pendiente').length],
									['Cancelados', orders.filter(o=>o.status==='cancelado').length]
								];
								const wsSummary = XLSX.utils.aoa_to_sheet(summary);
								wsSummary['!cols'] = [{ wch:20 }, { wch:30 }];
								const wb = XLSX.utils.book_new();
								XLSX.utils.book_append_sheet(wb, wsSummary, 'Resumen');
								XLSX.utils.book_append_sheet(wb, wsPedidos, 'Pedidos');
								XLSX.utils.book_append_sheet(wb, wsEventos, 'Eventos');
								const wbout = XLSX.write(wb, { bookType:'xlsx', type:'array' });
								const blob = new Blob([wbout], { type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
								const url = URL.createObjectURL(blob);
								const a = document.createElement('a'); a.href = url; a.download = 'historial_pedidos.xlsx'; a.click(); URL.revokeObjectURL(url);
								push('Exportado Excel', { type:'success' });
							} catch(e) {
								console.error(e);
								push('Error exportando Excel. Instala dependencias.', { type:'error' });
							}
						}} className="px-3 py-2 text-xs rounded-md bg-gray-100 hover:bg-gray-200 border">Excel</button>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<div className="flex flex-col sm:flex-row gap-4 mb-6">
					<div className="flex-1 relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" /><Input placeholder="Buscar pedido o cliente" value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} className="pl-10" /></div>
					<div className="flex gap-2">
						<select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} className="border rounded-md px-3 py-2 text-sm bg-white">
							<option value="all">Todos</option>
							{statusOptions.map(s=> <option key={s.value} value={s.value}>{s.label}</option>)}
						</select>
					</div>
				</div>
				<div className="space-y-4">
					{filtered.map(order => (
						<div key={order.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
							<div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
								<div className="md:col-span-2">
									  <h3 className="font-semibold text-[#0D1B2A]">{order.orderNumber}</h3>
									  <p className="text-sm text-gray-600">{order.owner?.name || '—'}</p>
									<p className="text-xs text-gray-500">{new Date(order.date).toLocaleDateString('es-ES')}</p>
								</div>
								<div className="text-sm"><p className="font-medium text-gray-700">Ruta</p><p className="text-gray-600">{order.origin} → {order.destination}</p></div>
								<div className="text-sm"><p className="font-medium text-gray-700">Detalles</p><p className="text-gray-600">{order.weight} kg</p><p className="font-semibold text-[#0D1B2A]">${order.cost.toFixed(2)}</p></div>
								<div>
									<select value={order.status} onChange={e=>updateStatus(order.id, e.target.value)} className="border rounded-md px-2 py-2 text-sm bg-white w-full">
										{statusOptions.map(s=> <option key={s.value} value={s.value}>{s.label}</option>)}
									</select>
								</div>
								<div className="flex gap-2">
									<Button variant="outline" size="sm" onClick={()=>openTrackingEditor(order)} title="Editar Tracking"><MapPin className="h-3 w-3" /></Button>
									<Button variant="outline" size="sm" onClick={()=> setViewTrackingOrder(order)} title="Ver Tracking"><Eye className="h-3 w-3" /></Button>
									<Button variant="outline" size="sm"><Edit className="h-3 w-3" /></Button>
								</div>
							</div>
						</div>
					))}
				</div>
				{filtered.length===0 && (
					<div className="text-center py-8 text-gray-500"><Package className="h-12 w-12 mx-auto mb-4 opacity-50" /><p>No se encontraron pedidos</p><p className="text-sm">Ajusta los filtros</p></div>
				)}
				<div className="mt-6 pt-4 border-t">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
						<div className="bg-yellow-50 p-3 rounded-lg"><p className="text-2xl font-bold text-yellow-600">{orders.filter(o=>o.status==='pendiente').length}</p><p className="text-sm text-yellow-700">Pendientes</p></div>
						<div className="bg-blue-50 p-3 rounded-lg"><p className="text-2xl font-bold text-blue-600">{orders.filter(o=>o.status==='en-transito').length}</p><p className="text-sm text-blue-700">En Tránsito</p></div>
						<div className="bg-green-50 p-3 rounded-lg"><p className="text-2xl font-bold text-green-600">{orders.filter(o=>o.status==='entregado').length}</p><p className="text-sm text-green-700">Entregados</p></div>
						<div className="bg-red-50 p-3 rounded-lg"><p className="text-2xl font-bold text-red-600">{orders.filter(o=>o.status==='cancelado').length}</p><p className="text-sm text-red-700">Cancelados</p></div>
					</div>
				</div>
			{viewTrackingOrder && !trackingEditOrder && (
				<div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
					<div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
						<div className="px-6 py-4 border-b flex items-center justify-between">
							<h4 className="font-semibold text-[#0D1B2A] flex items-center gap-2"><MapPin className="h-4 w-4" />Tracking: {viewTrackingOrder.orderNumber}</h4>
							<button onClick={()=> setViewTrackingOrder(null)} className="p-2 rounded hover:bg-gray-100"><X className="h-4 w-4" /></button>
						</div>
						<div className="flex-1 overflow-y-auto p-6 space-y-6">
							<div className="space-y-4">
								{(viewTrackingOrder.tracking?.timeline || []).map((ev, i) => (
									<div key={i} className="border rounded-lg p-4 flex gap-4">
										<div className="flex flex-col items-center">
											<div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${ev.completed ? 'bg-[#F77F00] text-white border-[#F77F00]' : 'bg-white text-gray-400 border-gray-300'}`}>{i+1}</div>
											{i < (viewTrackingOrder.tracking?.timeline.length||0)-1 && <div className={`w-0.5 flex-1 ${ev.completed ? 'bg-[#F77F00]' : 'bg-gray-300'}`} />}
										</div>
										<div className="flex-1">
											<h5 className="font-medium text-[#0D1B2A] mb-1">{ev.status}</h5>
											<p className="text-xs text-gray-500 mb-1">{ev.date} {ev.time}</p>
											<p className="text-sm text-gray-600">{ev.location}</p>
										</div>
									</div>
								))}
							</div>
						</div>
						<div className="px-6 py-4 border-t bg-gray-50 text-right">
							<button onClick={()=> setViewTrackingOrder(null)} className="px-4 py-2 rounded-md text-sm bg-white border hover:bg-gray-100">Cerrar</button>
						</div>
					</div>
				</div>
			)}
			{trackingEditOrder && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
					<div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
						<div className="px-6 py-4 border-b flex items-center justify-between">
							<h4 className="font-semibold text-[#0D1B2A] flex items-center gap-2"><MapPin className="h-4 w-4" />Editar Tracking: {trackingEditOrder.orderNumber}</h4>
							<button onClick={closeTrackingEditor} className="p-2 rounded hover:bg-gray-100"><X className="h-4 w-4" /></button>
						</div>
						<div className="flex-1 overflow-y-auto p-6 space-y-6">
							<p className="text-sm text-gray-600">Modifica la línea de tiempo. Respeta el orden cronológico. Pasos completados se usarán para derivar el estado.</p>
							<div className="space-y-4">
								{draftTimeline.map((ev, idx) => {
									const prevCompleted = idx === 0 || draftTimeline[idx-1].completed;
									return (
										<div key={idx} className="border rounded-lg p-4">
											<div className="flex items-start gap-4">
												<div className="flex flex-col items-center">
													<div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${ev.completed ? 'bg-[#F77F00] text-white border-[#F77F00]' : 'bg-white text-gray-400 border-gray-300'}`}>{idx+1}</div>
													{idx < draftTimeline.length -1 && <div className={`w-0.5 flex-1 ${ev.completed ? 'bg-[#F77F00]' : 'bg-gray-300'}`} />}
												</div>
												<div className="flex-1 space-y-3">
													<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
														<h5 className="font-medium text-[#0D1B2A]">{ev.status}</h5>
														<label className="inline-flex items-center gap-2 text-xs text-gray-600">
															<input type="checkbox" className="rounded" checked={ev.completed} disabled={!prevCompleted && !ev.completed} onChange={e=>toggleCompleted(idx, e.target.checked)} /> Completado
														</label>
													</div>
													<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
														<div className="space-y-1">
															<label className="text-xs font-medium text-gray-600">Ubicación</label>
															<input type="text" value={ev.location} onChange={e=>updateDraftEvent(idx,'location', e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm" />
														</div>
														<div className="space-y-1">
															<label className="text-xs font-medium text-gray-600">Fecha</label>
															<input type="date" value={ev.date} onChange={e=>updateDraftEvent(idx,'date', e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm" />
														</div>
														<div className="space-y-1">
															<label className="text-xs font-medium text-gray-600">Hora / Nota</label>
															<input type="text" value={ev.time} onChange={e=>updateDraftEvent(idx,'time', e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm" placeholder="HH:MM o Estimado" />
														</div>
													</div>
											</div>
											</div>
										</div>
									);
								})}
							</div>
						</div>
						<div className="px-6 py-4 border-t flex items-center justify-between bg-gray-50">
							<button onClick={closeTrackingEditor} className="px-4 py-2 rounded-md text-sm bg-white border hover:bg-gray-100">Cancelar</button>
							<button onClick={saveTracking} disabled={savingTracking} className="px-4 py-2 rounded-md text-sm bg-[#F77F00] text-white hover:bg-[#e6720a] disabled:opacity-50">{savingTracking? 'Guardando...' : 'Guardar Cambios'}</button>
						</div>
					</div>
				</div>
			)}
			</CardContent>
		</Card>
	);
}

function SettingsPlaceholder() {
	return (
		<div className="bg-white rounded-lg p-6 shadow-sm border">
			<h3 className="text-xl font-semibold text-[#0D1B2A] mb-4">Configuración del Sistema</h3>
			<p className="text-gray-600 mb-4">Funcionalidad en desarrollo - Configuraciones avanzadas del sistema</p>
			<div className="bg-gray-100 p-4 rounded-lg text-sm text-gray-700">
				Esta sección incluirá configuraciones de tarifas, zonas de cobertura, gestión de usuarios y parámetros del sistema.
			</div>
		</div>
	);
}
