import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { User, Lock, Eye, EyeOff, ShieldCheck, Zap, PackageSearch } from 'lucide-react';
import Header from './Header';
import { useToast } from './toast';

export default function Login() {
  const navigate = useNavigate();
  const { push } = useToast();

  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [registrando, setRegistrando] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const demo = {
    admin: { firstName: 'Admin', lastName: 'Expressia', email: "admin@expressia.com", password: "admin123" },
    client: { firstName: 'Cliente', lastName: 'Demo', email: "cliente@expressia.com", password: "cliente123" },
  };

  const getUsuarios = () => {
    const usuarios = localStorage.getItem("usuarios");
    return usuarios ? JSON.parse(usuarios) : [];
  };

  const guardarUsuario = (nuevoUsuario) => {
    const usuarios = getUsuarios();
    usuarios.push(nuevoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password || (registrando && (!formData.firstName || !formData.lastName))) {
      push('Completa los campos marcados antes de continuar.', { type:'warning', title:'Faltan datos' });
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      if (registrando) {
        const usuarios = getUsuarios();
        const existe = usuarios.find((u) => u.email === formData.email);

        if (existe) {
          push('Ese correo ya está asociado a una cuenta existente.', { type:'error', title:'Correo en uso' });
        } else {
          guardarUsuario({
            id: Date.now().toString(),
            firstName: formData.firstName.trim(),
            lastName: formData.lastName.trim(),
            email: formData.email.trim().toLowerCase(),
            password: formData.password,
            createdAt: new Date().toISOString()
          });
          push('Tu cuenta fue creada correctamente. Inicia sesión para continuar.', { type:'success', title:'Registro exitoso' });
          setRegistrando(false);
          setFormData({ firstName: "", lastName: "", email: "", password: "" });
        }
      } else {
        const usuarios = getUsuarios();
        const usuarioValido = usuarios.find(
          (u) => u.email === formData.email.trim().toLowerCase() && u.password === formData.password
        );

        if (formData.email === demo.admin.email && formData.password === demo.admin.password) {
          push('Panel administrativo listo.', { type:'success', title:'¡Bienvenido Administrador!' });
          navigate("/admin");
          localStorage.setItem('usuarioActual', JSON.stringify(demo.admin));
        } else if (formData.email === demo.client.email && formData.password === demo.client.password) {
          push('Accede a tus envíos y seguimiento.', { type:'success', title:'¡Bienvenido!' });
          localStorage.setItem('usuarioActual', JSON.stringify(demo.client));
          navigate("/Inicio");
        } else if (usuarioValido) {
          localStorage.setItem("usuarioActual", JSON.stringify(usuarioValido));
          push(`Hola ${usuarioValido.firstName || ''} ¡tu sesión está activa!`, { type:'success', title:'Bienvenido de nuevo' });
          navigate("/Inicio");
        } else {
          push('Revisa tu correo y contraseña e inténtalo nuevamente.', { type:'error', title:'Credenciales incorrectas' });
        }
      }

      setIsLoading(false);
    }, 1000);
  };

  const fillDemo = (type) => {
    setFormData(demo[type]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-slate-50 to-sky-50 relative">
      <Header />
      <div className="flex-1 grid lg:grid-cols-2 gap-0 items-stretch relative">
        {/* Lado informativo */}
        <motion.div initial={{ opacity:0, x:-40 }} animate={{ opacity:1, x:0 }} transition={{ duration:.7, ease:'easeOut' }} className="hidden lg:flex flex-col justify-center px-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(247,127,0,0.18),transparent_60%),radial-gradient(circle_at_80%_70%,rgba(14,116,144,0.25),transparent_60%)] pointer-events-none" />
          <div className="relative space-y-8 max-w-xl">
            <motion.h2 initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:.15, duration:.6 }} className="text-4xl font-extrabold tracking-tight text-slate-800 leading-tight">
              Gestiona envíos con <span className="bg-gradient-to-r from-[#F77F00] via-[#fb923c] to-[#0D1B2A] bg-clip-text text-transparent">fluidez</span>
            </motion.h2>
            <motion.p initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:.25, duration:.6 }} className="text-lg text-slate-600 leading-relaxed">
              Crea pedidos, sigue el tracking en tiempo real y administra tus paquetes 
            </motion.p>
            <div className="grid grid-cols-3 gap-5 pt-4">
              <FeatureMini icon={<ShieldCheck className="h-5 w-5" />} title="Auditoría" desc="Historial de cambios" />
              <FeatureMini icon={<PackageSearch className="h-5 w-5" />} title="Tracking" desc="Hitos editables" />
              <FeatureMini icon={<Zap className="h-5 w-5" />} title="Confiabilidad" desc="Seguro y estable" />
            </div>
          </div>
        </motion.div>

        {/* Formulario */}
        <div className="flex items-center justify-center px-6 py-12 lg:py-0 relative">
          <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:.6, ease:'easeOut' }} className="w-full max-w-md">
            <Card className="border border-slate-200/70 backdrop-blur bg-white/80 shadow-xl shadow-slate-200/40">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl text-[#0D1B2A] flex items-center justify-center gap-2 font-bold">
                  <User className="h-6 w-6" /> {registrando ? 'Crear Cuenta' : 'Iniciar Sesión'}
                </CardTitle>
                <CardDescription className="text-slate-500 text-sm">
                  {registrando ? 'Completa los datos para registrarte' : 'Accede con tus credenciales'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  {registrando && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-slate-600 text-xs font-semibold tracking-wide">Nombre *</Label>
                        <Input id="firstName" value={formData.firstName} onChange={e=>setFormData({...formData, firstName:e.target.value})} disabled={isLoading} className="text-sm" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-slate-600 text-xs font-semibold tracking-wide">Apellido *</Label>
                        <Input id="lastName" value={formData.lastName} onChange={e=>setFormData({...formData, lastName:e.target.value})} disabled={isLoading} className="text-sm" />
                      </div>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-600 text-xs font-semibold tracking-wide">Correo Electrónico</Label>
                    <Input id="email" type="email" placeholder="tu@email.com" value={formData.email} onChange={e=>setFormData({...formData, email:e.target.value})} disabled={isLoading} className="text-sm" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-slate-600 text-xs font-semibold tracking-wide">Contraseña</Label>
                    <div className="relative">
                      <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={formData.password} onChange={e=>setFormData({...formData, password:e.target.value})} disabled={isLoading} className="pr-10 text-sm" />
                      <button type="button" onClick={()=>setShowPassword(p=>!p)} className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-500 hover:text-slate-700" tabIndex={-1}>
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="pt-2">
                    <Button type="submit" className="w-full bg-[#0D1B2A] hover:bg-[#173249] text-white font-medium tracking-wide" disabled={isLoading}>
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/70 border-t-transparent rounded-full animate-spin" />
                          <span className="text-xs">Procesando...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-sm">
                          <Lock className="h-4 w-4" /> {registrando ? 'Registrarse' : 'Iniciar Sesión'}
                        </div>
                      )}
                    </Button>
                  </div>
                </form>
                <div className="mt-5 text-center">
                  <Button variant="link" onClick={()=>setRegistrando(!registrando)} disabled={isLoading} className="text-xs font-medium">
                    {registrando ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
                  </Button>
                </div>
                {!registrando && (
                  <div className="mt-6 pt-4 border-t border-slate-200">
                    <p className="text-xs text-slate-500 text-center mb-3 font-medium tracking-wide">Accesos de demostración</p>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm" className="w-full text-[11px] justify-start gap-2" onClick={()=>fillDemo('admin')} disabled={isLoading}>👨‍💼 <span className="font-semibold">Admin</span> admin@expressia.com / admin123</Button>
                      <Button variant="outline" size="sm" className="w-full text-[11px] justify-start gap-2" onClick={()=>fillDemo('client')} disabled={isLoading}>👤 <span className="font-semibold">Cliente</span> cliente@expressia.com / cliente123</Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            <p className="mt-8 text-[11px] text-center text-slate-400 tracking-wide">© 2025 Expressia. Plataforma académica demostrativa.</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function FeatureMini({ icon, title, desc }) {
  return (
    <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ duration:.5 }} className="bg-white/70 backdrop-blur rounded-xl p-4 border border-white/50 shadow-sm hover:shadow-md transition flex flex-col gap-2">
      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#F77F00] to-[#0D1B2A] text-white flex items-center justify-center shadow">
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-800 leading-tight">{title}</p>
        <p className="text-[11px] text-slate-600 leading-snug">{desc}</p>
      </div>
    </motion.div>
  );
}
