import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { CheckCircle, AlertTriangle, Info, XCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const ToastContext = createContext(null);

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const remove = useCallback((id) => {
    setToasts(t => t.filter(to => to.id !== id));
  }, []);

  const push = useCallback((msg, opts={}) => {
    const id = ++idCounter;
    const toast = {
      id,
      message: msg,
      type: opts.type || 'info',
      duration: opts.duration || 3500,
      action: opts.action || null, // { label, onClick }
      title: opts.title || null,
      icon: opts.icon || null,
      persistent: opts.persistent || false,
    };
    setToasts(t => [...t, toast]);
    if (toast.duration > 0 && !toast.persistent) {
      setTimeout(()=> remove(id), toast.duration);
    }
    return id;
  }, [remove]);

  return (
    <ToastContext.Provider value={{ push, remove }}>
      {children}
      <div className={`fixed z-[100] pointer-events-none ${isMobile ? 'inset-x-0 top-2 flex flex-col gap-2 px-3 w-full' : 'top-4 right-4 flex flex-col gap-3 w-[340px] max-w-[90vw]'}`}>
        <AnimatePresence initial={false}>
          {toasts.map(t => (
            <ToastItem key={t.id} toast={t} onClose={()=>remove(t.id)} mobile={isMobile} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

// simple fade-in animation (tailwind utility fallback)
// Add to global css if needed:
// .animate-fade-in { animation: fade-in .25s ease-out; }
// @keyframes fade-in { from { opacity:0; transform: translateY(4px);} to {opacity:1; transform: translateY(0);} }

function ToastItem({ toast, onClose, mobile }) {
  const { type, message, title, duration, action, icon, persistent } = toast;
  const [progress, setProgress] = useState(100);
  const startTs = useRef(Date.now());
  const frame = useRef(null);

  useEffect(() => {
    if (!duration || persistent) return;
    const step = () => {
      const elapsed = Date.now() - startTs.current;
      const pct = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(pct);
      if (pct > 0) frame.current = requestAnimationFrame(step);
      else onClose();
    };
    frame.current = requestAnimationFrame(step);
    return () => frame.current && cancelAnimationFrame(frame.current);
  }, [duration, persistent, onClose]);

  const palette = {
    success: { grad:'from-emerald-500/80 to-emerald-600/80', iconWrap:'bg-emerald-50 ring-emerald-100', icon:'text-emerald-600', bar:'bg-emerald-500' },
    error: { grad:'from-rose-500/80 to-rose-600/80', iconWrap:'bg-rose-50 ring-rose-100', icon:'text-rose-600', bar:'bg-rose-500' },
    warning: { grad:'from-amber-500/80 to-amber-600/80', iconWrap:'bg-amber-50 ring-amber-100', icon:'text-amber-600', bar:'bg-amber-500' },
    info: { grad:'from-sky-500/80 to-sky-600/80', iconWrap:'bg-sky-50 ring-sky-100', icon:'text-sky-600', bar:'bg-sky-500' }
  }[type] || { grad:'from-slate-500/80 to-slate-600/80', iconWrap:'bg-slate-50 ring-slate-100', icon:'text-slate-600', bar:'bg-slate-500' };

  const IconCmp = icon || (type === 'success' ? CheckCircle : type === 'error' ? XCircle : type === 'warning' ? AlertTriangle : Info);

  return (
    <motion.div
      layout
      initial={{ opacity:0, y: mobile ? 20 : 0, x: mobile ? 0 : 40, scale:0.98 }}
      animate={{ opacity:1, y:0, x:0, scale:1, transition:{ type:'spring', stiffness:380, damping:28 } }}
      exit={{ opacity:0, y: mobile ? 10 : 0, x: mobile ? 0 : 30, scale:0.95, transition:{ duration:0.18 } }}
      className={`pointer-events-auto group relative overflow-hidden rounded-xl border bg-white shadow-[0_4px_18px_-4px_rgba(0,0,0,0.15)] ring-1 ring-black/5 backdrop-blur supports-[backdrop-filter]:bg-white/70 ${mobile ? 'w-full' : ''}`}
    >      
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${palette.grad}`} />
      <div className={`flex gap-3 ${mobile ? 'px-4 py-3' : 'px-4 py-3'}`}>
        <div className={`mt-0.5 rounded-md p-1.5 ${palette.iconWrap} ring-1`}> <IconCmp className={`h-4 w-4 ${palette.icon}`} /> </div>
        <div className="flex-1 min-w-0">
          {title && <p className="text-[13px] font-semibold text-slate-800 leading-tight mb-0.5">{title}</p>}
            <p className="text-[13px] text-slate-600 leading-snug break-words">{message}</p>
            {action && (
              <div className="pt-2">
                <button onClick={() => { action.onClick?.(); onClose(); }} className={`text-xs font-medium ${palette.icon.replace('text-','text-')} hover:brightness-110 transition inline-flex items-center gap-1`}>{action.label}</button>
              </div>
            )}
        </div>
        <button onClick={onClose} className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition mt-0.5">✕</button>
      </div>
      {(!persistent && duration) && (
        <div className="absolute bottom-0 left-0 h-0.5 bg-slate-200 w-full overflow-hidden">
          <div className={`h-full ${palette.bar}`} style={{ width: progress + '%' }} />
        </div>
      )}
    </motion.div>
  );
}
