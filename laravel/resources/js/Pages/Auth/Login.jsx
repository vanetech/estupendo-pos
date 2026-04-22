import { useForm, Head } from '@inertiajs/react';
import React from 'react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <div className="min-h-screen bg-slate-50 relative flex items-center justify-center">
            <Head title="Ingresar Seguro" />
            
            {/* Background design elements */}
            <div className="absolute inset-0 bg-slate-50 overflow-hidden pointer-events-none">
                <div className="absolute -top-10 -right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 -left-20 w-72 h-72 bg-teal-400/10 rounded-full blur-3xl delay-150"></div>
                
                {/* Minimal grid illustration */}
                <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M0 40V0H40" fill="none" stroke="currentColor" strokeWidth="1"></path>
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)"></rect>
                </svg>
            </div>

            <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10 border border-slate-100/50 animate-[fadeIn_0.5s_ease-out]">
                
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-gradient-to-tr from-teal-400 to-indigo-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-6">
                        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Estupendo POS</h1>
                    <p className="text-slate-500 font-medium mt-2">Acceso a tu sucursal local.</p>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Correo Electrónico</label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={e => setData('email', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium"
                            placeholder="admin@estupendo.pos"
                            required
                        />
                        {errors.email && <div className="text-rose-500 text-xs font-bold mt-2 ml-1">{errors.email}</div>}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Contraseña</label>
                        <input
                            type="password"
                            value={data.password}
                            onChange={e => setData('password', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="flex items-center text-sm font-medium text-slate-600 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={data.remember}
                                onChange={e => setData('remember', e.target.checked)}
                                className="mr-2 rounded text-indigo-600 focus:ring-indigo-500"
                            />
                            Mantener sesión
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-indigo-600 text-white font-bold rounded-xl py-3.5 px-4 shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 hover:shadow-indigo-600/40 active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                        {processing ? 'Iniciando sesión...' : 'Ingresar al POS'}
                    </button>
                    
                    <p className="text-center text-xs text-slate-400 mt-6 font-medium">
                        Sistema protegido por encriptación avanzada.
                    </p>
                </form>
            </div>
        </div>
    );
}
