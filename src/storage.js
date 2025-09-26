
const ORDERS_KEY = 'expressia_orders';
const SEED_FLAG = 'expressia_orders_seeded';
const REV_KEY = 'expressia_orders_rev';

export function loadOrders() {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

export function saveOrders(orders) {
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    const rev = parseInt(localStorage.getItem(REV_KEY) || '0', 10) + 1;
    localStorage.setItem(REV_KEY, String(rev));
  } catch {}
}

export function ensureSeedOrders(buildTrackingFn) {
  const already = loadOrders();
  if (already.length > 0) return already;
  if (localStorage.getItem(SEED_FLAG) === '1') return already; // no volver a sembrar
  const seed = [
    { id:'1', orderNumber:'EXP2024001', owner:{ name:'María González', email:'maria@example.com'}, origin:'Guatemala', destination:'Costa Rica', status:'entregado', date:'2025-09-18', cost:45.50, weight:2.5 },
    { id:'2', orderNumber:'EXP2024002', owner:{ name:'Carlos Rodríguez', email:'carlos@example.com'}, origin:'El Salvador', destination:'Honduras', status:'en-transito', date:'2025-09-22', cost:32.00, weight:1.8 },
    { id:'3', orderNumber:'EXP2024003', owner:{ name:'Ana Martínez', email:'ana@example.com'}, origin:'Nicaragua', destination:'Panamá', status:'pendiente', date:'2025-09-23', cost:67.25, weight:4.2 }
  ];
  const withTracking = buildTrackingFn ? seed.map(o => ({ ...o, tracking:{ timeline: buildTrackingFn(o) } })) : seed;
  saveOrders(withTracking);
  localStorage.setItem(SEED_FLAG, '1');
  return withTracking;
}

export function onOrdersChange(callback) {
  // Escucha eventos de storage (otras pestañas) y cambios de revision
  const handler = (e) => {
    if (e.key === 'storage_manual_refresh' || e.key === REV_KEY || e.key === ORDERS_KEY) {
      callback(loadOrders());
    }
  };
  window.addEventListener('storage', handler);
  return () => window.removeEventListener('storage', handler);
}

export function broadcastOrdersChange() {
  try { localStorage.setItem('storage_manual_refresh', Date.now().toString()); } catch {}
}
