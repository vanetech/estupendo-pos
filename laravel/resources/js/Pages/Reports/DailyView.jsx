import React from 'react';
import Layout from '../../Components/Layout';
import { Link } from '@inertiajs/react';

export default function DailyView({ date, sales, expenses, totals }) {
    
    // Format timestamp nicely without UTC timezone shifts
    const [year, month, day] = date.split('-');
    const formattedDate = new Date(year, month - 1, day).toLocaleDateString('es-ES', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    return (
        <Layout>
            <div className="p-8 max-w-7xl mx-auto space-y-8 animate-[fadeIn_0.3s_ease-out]">
                
                {/* Header & Back Button */}
                <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-4">
                        <Link href="/reports" className="p-3 bg-slate-50 text-slate-500 rounded-xl hover:bg-slate-100 hover:text-indigo-600 transition-colors">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-black text-slate-800 capitalize">{formattedDate}</h1>
                            <p className="text-slate-500 font-medium">Detalle Diario de Transacciones</p>
                        </div>
                    </div>
                    
                    <div className="flex gap-6">
                        <div className="text-right">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Ventas</span>
                            <span className="text-xl font-bold text-emerald-500">${parseFloat(totals.sales).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        <div className="text-right">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Gastos</span>
                            <span className="text-xl font-bold text-rose-500">${parseFloat(totals.expenses).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        <div className="text-right pl-6 border-l border-slate-100">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Utilidad Lograda</span>
                            <span className={`text-2xl font-black ${totals.profit >= 0 ? 'text-indigo-600' : 'text-rose-600'}`}>
                                ${parseFloat(totals.profit).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    
                    {/* Sales Column */}
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Ventas Registradas
                            </h2>
                            <span className="bg-white border border-slate-200 px-3 py-1 rounded-full text-xs font-bold text-slate-500">
                                {sales.length} Órdenes
                            </span>
                        </div>
                        
                        <div className="p-6 space-y-4">
                            {sales.length === 0 ? (
                                <p className="text-slate-400 text-center py-8">No hubieron ventas este día.</p>
                            ) : (
                                sales.map(sale => (
                                    <div key={sale.id} className="border border-slate-100 rounded-2xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow group">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50 px-2 py-1 rounded-md">Orden #{sale.id}</span>
                                                <div className="text-sm text-slate-500 mt-2">
                                                    {new Date(sale.created_at).toLocaleTimeString('es-ES', {hour: '2-digit', minute:'2-digit'})}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-lg font-bold text-emerald-600">${parseFloat(sale.total_amount).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                                                {parseFloat(sale.discount) > 0 && (
                                                    <div className="text-xs text-rose-400 font-medium">Desc: -${parseFloat(sale.discount).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                                                )}
                                            </div>
                                        </div>
                                        
                                        {/* Items breakdown */}
                                        <div className="bg-slate-50 rounded-xl p-3 mb-3 border border-slate-100/50">
                                            <div className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Artículos</div>
                                            <ul className="space-y-1">
                                                {sale.items.map(item => (
                                                    <li key={item.id} className="text-sm flex justify-between">
                                                        <span className="text-slate-700">
                                                            <span className="text-slate-400 mr-2">{item.quantity}x</span>
                                                            {item.product_name}
                                                            {item.description && <span className="text-indigo-400 ml-2 italic text-xs">({item.description})</span>}
                                                        </span>
                                                        <span className="text-slate-500">${parseFloat(item.subtotal).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Payments breakdown */}
                                        <div className="flex flex-wrap gap-2">
                                            {sale.payments.map((p, idx) => (
                                                <span key={idx} className="bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-lg font-medium flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                                    </svg>
                                                    {p.payment_method?.name || 'Varios'} : ${parseFloat(p.amount).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Expenses Column */}
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <svg className="w-5 h-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Egresos y Gastos
                            </h2>
                            <span className="bg-white border border-slate-200 px-3 py-1 rounded-full text-xs font-bold text-slate-500">
                                {expenses.length} Movimientos
                            </span>
                        </div>

                        <div className="p-6 space-y-4">
                            {expenses.length === 0 ? (
                                <p className="text-slate-400 text-center py-8">No hubieron gastos este día.</p>
                            ) : (
                                expenses.map(exp => (
                                    <div key={exp.id} className="border border-slate-100 rounded-2xl p-5 bg-white shadow-sm hover:shadow-md transition-all border-l-4 border-l-rose-400">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex-1 pr-4">
                                                <h4 className="font-bold text-slate-800">{exp.description}</h4>
                                                <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                                                    <span className="bg-slate-100 px-2 py-0.5 rounded-md font-medium">{exp.category?.name || 'General'}</span>
                                                    <span>{new Date(exp.created_at).toLocaleTimeString('es-ES', {hour: '2-digit', minute:'2-digit'})}</span>
                                                </div>
                                            </div>
                                            <div className="text-xl font-black text-rose-500">
                                                -${parseFloat(exp.amount).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </Layout>
    );
}
