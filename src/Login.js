import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { User, Lock } from "lucide-react";
import Header from "./Header"; // <-- Importamos tu header

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [registrando, setRegistrando] = useState(false);

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
      alert("Por favor completa todos los campos obligatorios");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      if (registrando) {
        const usuarios = getUsuarios();
        const existe = usuarios.find((u) => u.email === formData.email);

        if (existe) {
          alert("⚠️ El correo ya está registrado");
        } else {
          guardarUsuario({
            id: Date.now().toString(),
            firstName: formData.firstName.trim(),
            lastName: formData.lastName.trim(),
            email: formData.email.trim().toLowerCase(),
            password: formData.password,
            createdAt: new Date().toISOString()
          });
          alert("✅ Registro exitoso, ahora inicia sesión");
          setRegistrando(false);
          setFormData({ firstName: "", lastName: "", email: "", password: "" });
        }
      } else {
        const usuarios = getUsuarios();
        const usuarioValido = usuarios.find(
          (u) => u.email === formData.email.trim().toLowerCase() && u.password === formData.password
        );

        if (formData.email === demo.admin.email && formData.password === demo.admin.password) {
          alert("¡Bienvenido Administrador!");
          navigate("/admin");
          localStorage.setItem('usuarioActual', JSON.stringify(demo.admin));
        } else if (formData.email === demo.client.email && formData.password === demo.client.password) {
          alert("¡Bienvenido Cliente!");
          localStorage.setItem('usuarioActual', JSON.stringify(demo.client));
          navigate("/Inicio");
        } else if (usuarioValido) {
          localStorage.setItem("usuarioActual", JSON.stringify(usuarioValido));
          alert("¡Bienvenido de nuevo!");
          navigate("/Inicio");
        } else {
          alert("❌ Credenciales incorrectas");
        }
      }

      setIsLoading(false);
    }, 1000);
  };

  const fillDemo = (type) => {
    setFormData(demo[type]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col items-center">
      {/* Header reemplazado */}
      <Header />

      {/* Formulario */}
      <Card className="w-full max-w-md mt-20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-[#0D1B2A] flex items-center justify-center gap-2">
            <User className="h-6 w-6" />
            {registrando ? "Registrarse" : "Iniciar Sesión"}
          </CardTitle>
          <CardDescription>
            {registrando
              ? "Crea tu cuenta para comenzar a usar el sistema"
              : "Ingresa tus credenciales para acceder"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {registrando && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombre *</Label>
                  <Input id="firstName" value={formData.firstName} onChange={e=>setFormData({...formData, firstName:e.target.value})} disabled={isLoading} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellido *</Label>
                  <Input id="lastName" value={formData.lastName} onChange={e=>setFormData({...formData, lastName:e.target.value})} disabled={isLoading} />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[#0D1B2A] hover:bg-[#1a2f45] text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Procesando...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  {registrando ? "Registrarse" : "Iniciar Sesión"}
                </div>
              )}
            </Button>
          </form>

          {/* Switch login/register */}
          <div className="mt-4 text-center">
            <Button
              variant="link"
              onClick={() => setRegistrando(!registrando)}
              disabled={isLoading}
            >
              {registrando
                ? "¿Ya tienes cuenta? Inicia sesión"
                : "¿No tienes cuenta? Regístrate"}
            </Button>
          </div>

          {/* Demo creds */}
          {!registrando && (
            <div className="mt-6 pt-4 border-t">
              <p className="text-sm text-gray-600 text-center mb-3">
                Credenciales de demostración:
              </p>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => fillDemo("admin")} disabled={isLoading}>👨‍💼 Admin: admin@expressia.com / admin123</Button>
                <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => fillDemo("client")} disabled={isLoading}>👤 Cliente: cliente@expressia.com / cliente123</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#1C1C1C] text-white py-4">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 Expressia. Conectando Centroamérica con confianza.
          </p>
        </div>
      </div>
    </div>
  );
}
