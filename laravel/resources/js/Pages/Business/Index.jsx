import React, { useState } from 'react';
import Layout from '../../Components/Layout';
import { useForm } from '@inertiajs/react';

export default function BusinessIndex({ businesses }) {
    const [isAdding, setIsAdding] = useState(false);

    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
        currency: 'COP',
        active: true,
    });

    const submit = (e) => {
        e.preventDefault();
        post('/business', {
            onSuccess: () => {
                setIsAdding(false);
                reset();
            }
        });
    };

    return (
        <Layout>
            <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Sucursales (Multi-Tenancy)</h1>
                        <p className="text-slate-500 mt-2 text-lg">Crea nuevos bloques de negocio totalmente aislados.</p>
                    </div>
                    <button 
                        onClick={() => setIsAdding(!isAdding)}
                        className="bg-emerald-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:bg-emerald-600 transition-all"
                    >
                        {isAdding ? 'Cerrar Panel' : '+ Nueva Sucursal'}
                    </button>
                </div>

                {isAdding && (
                    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-emerald-100 animate-[fadeIn_0.2s_ease-out]">
                        <h2 className="text-xl font-bold text-slate-800 mb-6">Crear Sucursal Autónoma</h2>
                        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            <div>
                                <label className="block text-sm font-semibold text-slate-600 mb-2">Nombre Comercial</label>
                                <input 
                                    type="text" 
                                    required
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    placeholder="Ej: Local Centro, Sede Norte..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-600 mb-2">Divisa Base</label>
                                <input 
                                    type="text" 
                                    required
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none uppercase"
                                    value={data.currency}
                                    onChange={e => setData('currency', e.target.value)}
                                    maxLength={3}
                                    placeholder="COP, USD, MXN..."
                                />
                            </div>

                            <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                                <button 
                                    type="submit" 
                                    disabled={processing}
                                    className="bg-emerald-500 text-white font-bold rounded-xl px-8 py-3 hover:bg-emerald-600"
                                >
                                    Crear Infraestructura
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider">
                                    <th className="px-6 py-4 font-semibold">ID</th>
                                    <th className="px-6 py-4 font-semibold">Sucursal</th>
                                    <th className="px-6 py-4 font-semibold">Moneda</th>
                                    <th className="px-6 py-4 font-semibold">Integridad</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {businesses.map(b => (
                                    <tr key={b.id} className="hover:bg-slate-50 text-slate-700">
                                        <td className="px-6 py-4 font-bold text-slate-400">#{b.id}</td>
                                        <td className="px-6 py-4 font-bold">{b.name}</td>
                                        <td className="px-6 py-4 font-medium text-slate-500">{b.currency}</td>
                                        <td className="px-6 py-4">
                                            {b.active ? (
                                                <span className="text-emerald-500 font-bold bg-emerald-50 px-3 py-1 rounded-full text-xs">Aislada (Operacional)</span>
                                            ) : (
                                                <span className="text-rose-500 font-bold bg-rose-50 px-3 py-1 rounded-full text-xs">Clausurada</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </Layout>
    );
}
