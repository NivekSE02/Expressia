// Panel de Administración simplificado
import React, { useState, useEffect } from 'react';
import { Package, BarChart3, Settings, TrendingUp, Truck, DollarSign, Fuel, Search, Edit, Eye } from 'lucide-react';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Input } from './components/ui/input';
import { useNavigate } from 'react-router-dom';

// Layout administrativo reutilizando estilo de Entrada pero independiente
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

// Tabs simples (reutilizamos patrón de Entrada.js para no depender de rutas alias)
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

	// Cargar pedidos creados por clientes (expressia_orders) más algunos mock iniciales si vacío
	useEffect(() => {
		try {
			const stored = localStorage.getItem('expressia_orders');
			const parsed = stored ? JSON.parse(stored) : [];
			setOrders(prev => {
				if (parsed.length === 0 && prev.length === 0) {
					return [
						{ id:'1', orderNumber:'EXP2024001', owner:{ name:'María González', email:'maria@example.com'}, origin:'Guatemala', destination:'Costa Rica', status:'entregado', date:'2025-09-18', cost:45.50, weight:2.5 },
						{ id:'2', orderNumber:'EXP2024002', owner:{ name:'Carlos Rodríguez', email:'carlos@example.com'}, origin:'El Salvador', destination:'Honduras', status:'en-transito', date:'2025-09-22', cost:32.00, weight:1.8 },
						{ id:'3', orderNumber:'EXP2024003', owner:{ name:'Ana Martínez', email:'ana@example.com'}, origin:'Nicaragua', destination:'Panamá', status:'pendiente', date:'2025-09-23', cost:67.25, weight:4.2 }
					];
				}
				return parsed.concat(prev.filter(m=>!parsed.find(p=>p.id===m.id))); // evita duplicar
			});
		} catch {}
	}, []);

	// Persistir cualquier cambio (para estados) en expressia_orders
	useEffect(() => {
		if (orders && orders.length) {
			const clientPart = orders.filter(o => o.id && o.orderNumber);
			localStorage.setItem('expressia_orders', JSON.stringify(clientPart));
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
	const updateStatus = (id, newStatus) => setOrders(o=> o.map(ord => ord.id===id? {...ord, status:newStatus}: ord));
	return (
		<Card>
			<CardHeader><CardTitle className="flex items-center gap-2 text-[#0D1B2A]"><Package className="h-5 w-5" />Gestión de Pedidos</CardTitle><CardDescription>Administra pedidos y estados</CardDescription></CardHeader>
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
									<Button variant="outline" size="sm"><Eye className="h-3 w-3" /></Button>
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
