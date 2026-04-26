import React, { useState } from 'react';
import Layout from '../../Components/Layout';
import { useForm } from '@inertiajs/react';

export default function ExpensesIndex({ expenses, categories, paymentMethods }) {
    const [isAdding, setIsAdding] = useState(false);

    const { data, setData, post, processing, reset, errors } = useForm({
        expense_category_id: categories.length > 0 ? categories[0].id : '',
        payment_method_id: paymentMethods.length > 0 ? paymentMethods[0].id : '',
        amount: '',
        description: '',
        expense_date: new Date().toISOString().split('T')[0],
    });

    const formatThousands = (val) => {
        if (!val && val !== 0) return '';
        const num = val.toString().replace(/[^\d]/g, '');
        return num ? parseInt(num).toLocaleString('es-CO') : '';
    };

    const parseRawNumber = (val) => {
        return val.toString().replace(/[^\d]/g, '');
    };

    const submit = (e) => {
        e.preventDefault();
        post('/expenses', {
            onSuccess: () => {
                setIsAdding(false);
                reset();
            }
        });
    };

    return (
        <Layout>
            <div className="p-8 max-w-6xl mx-auto space-y-6">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-rose-950 tracking-tight">Registro de Gastos</h1>
                        <p className="text-rose-800/60 mt-2 text-lg">Asignación operativa y registros rápidos.</p>
                    </div>
                    <button 
                        onClick={() => setIsAdding(!isAdding)}
                        className="bg-rose-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50 hover:bg-rose-600 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                        {isAdding ? 'Cerrar' : '+ Registrar Gasto'}
                    </button>
                </div>

                {isAdding && (
                    <div className="bg-white rounded-3xl p-8 shadow-xl border border-rose-100 animate-[slideIn_0.3s_ease-out]">
                        <h2 className="text-xl font-bold text-slate-800 mb-6">Detalle del Gasto</h2>
                        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            {categories.length === 0 && (
                                <div className="col-span-2 p-4 bg-orange-50 text-orange-700 rounded-xl mb-4">
                                    Debes crear Categorías de Gasto en la base de datos antes de registrar un gasto.
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-semibold text-slate-600 mb-2">Categoría</label>
                                <select 
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 outline-none"
                                    value={data.expense_category_id}
                                    onChange={e => setData('expense_category_id', e.target.value)}
                                >
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-semibold text-slate-600 mb-2">Método de Pago</label>
                                <select 
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 outline-none"
                                    value={data.payment_method_id}
                                    onChange={e => setData('payment_method_id', e.target.value)}
                                >
                                    {paymentMethods.map(pm => <option key={pm.id} value={pm.id}>{pm.name}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-600 mb-2">Valor ($)</label>
                                <input 
                                    type="text" 
                                    required
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 outline-none"
                                    value={formatThousands(data.amount)}
                                    onChange={e => setData('amount', parseRawNumber(e.target.value))}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-600 mb-2">Fecha</label>
                                <input 
                                    type="date" 
                                    required
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 outline-none"
                                    value={data.expense_date}
                                    onChange={e => setData('expense_date', e.target.value)}
                                />
                            </div>

                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-sm font-semibold text-slate-600 mb-2">Descripción</label>
                                <input 
                                    type="text" 
                                    required
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 outline-none"
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                />
                            </div>

                            <div className="md:col-span-2 flex justify-end mt-4">
                                <button 
                                    type="submit" 
                                    disabled={processing}
                                    className="bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold rounded-xl px-8 py-3 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
                                >
                                    Guardar Gasto
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead>
                                <tr className="bg-slate-50/80 text-slate-500">
                                    <th className="px-6 py-4 font-semibold rounded-tl-lg">Fecha</th>
                                    <th className="px-6 py-4 font-semibold">Descripción</th>
                                    <th className="px-6 py-4 font-semibold">Categoría</th>
                                    <th className="px-6 py-4 font-semibold">Monto</th>
                                </tr>
                            </thead>
                            <tbody>
                                {expenses.length === 0 ? (
                                    <tr><td colSpan="4" className="text-center p-8 text-slate-400">No has registrado gastos.</td></tr>
                                ) : expenses.map(exp => (
                                    <tr key={exp.id} className="border-b border-slate-50 hover:bg-rose-50/30 transition-colors">
                                        <td className="px-6 py-4 text-slate-600">{new Date(exp.expense_date).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 font-medium text-slate-800">{exp.description}</td>
                                        <td className="px-6 py-4 text-slate-600">{exp.category?.name || '-'}</td>
                                        <td className="px-6 py-4 font-bold text-rose-600">
                                            -${parseFloat(exp.amount).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
