import React from 'react';
import Header from './Header';

const Login = () => {
    return (
        <div>
            <Header />
            <div style={{
                maxWidth: '900px',
                margin: '40px auto',
                padding: '32px',
                paddingTop: '120px',
                
                
                background: '#fff'
            }}>
                <h1 className="tracking-out-expand-fwd" style={{ textAlign: 'center', marginBottom: '24px' }}>Iniciar Sesión</h1>
                <form>
                    <div style={{ marginBottom: '16px' }}>
                        <label htmlFor="email" style={{ display: 'block', marginBottom: '8px' }}>Correo electrónico</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Ingresa tu correo"
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '4px',
                                border: '1px solid #ccc'
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: '24px' }}>
                        <label htmlFor="password" style={{ display: 'block', marginBottom: '8px' }}>Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Ingresa tu contraseña"
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '4px',
                                border: '1px solid #ccc'
                            }}
                        />
                    </div>
                    <button
                        type="submit"
                        style={{
                            width: '100%',
                            padding: '12px',
                            background: '#1976d2',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}
                    >
                        Iniciar sesión
                    </button>
                </form>
                <div style={{ textAlign: 'center', marginTop: '24px' }}>
                    <button
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#1976d2',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                            fontSize: '16px'
                        }}
                    >
                        Registrarse
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;