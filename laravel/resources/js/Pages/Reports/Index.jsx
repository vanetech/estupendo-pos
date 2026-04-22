import React from 'react';
import Layout from '../../Components/Layout';
import { router } from '@inertiajs/react';

export default function ReportsIndex({ stats, dailyStats = [] }) {
    return (
        <Layout>
            <div className="p-8 max-w-6xl mx-auto space-y-8">
                <header className="mb-10">
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Reportes Financieros</h1>
                    <p className="text-slate-500 mt-2 text-lg">Resumen global de ventas vs gastos y utilidad neta.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Ventas */}
                    <div className="bg-white rounded-3xl p-6 shadow-xl shadow-teal-500/10 border border-teal-100 flex flex-col relative overflow-hidden group">
                        <div className="absolute right-0 top-0 w-32 h-32 bg-teal-50 rounded-bl-full -z-0"></div>
                        <h3 className="text-slate-500 font-semibold mb-2 relative z-10 flex items-center">
                            <span className="w-2 h-2 rounded-full bg-teal-500 mr-2"></span>
                            Total Ventas Brutas
                        </h3>
                        <p className="text-4xl font-black text-slate-800 relative z-10 mt-2">
                            ${parseFloat(stats.totalSales).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                    </div>

                    {/* Gastos */}
                    <div className="bg-white rounded-3xl p-6 shadow-xl shadow-rose-500/10 border border-rose-100 flex flex-col relative overflow-hidden group">
                        <div className="absolute right-0 top-0 w-32 h-32 bg-rose-50 rounded-bl-full -z-0"></div>
                        <h3 className="text-slate-500 font-semibold mb-2 relative z-10 flex items-center">
                            <span className="w-2 h-2 rounded-full bg-rose-500 mr-2"></span>
                            Total Gastos
                        </h3>
                        <p className="text-4xl font-black text-slate-800 relative z-10 mt-2">
                            ${parseFloat(stats.totalExpenses).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                    </div>

                    {/* Utilidad */}
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-6 shadow-xl shadow-indigo-500/30 border border-transparent flex flex-col relative overflow-hidden group text-white">
                        <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-bl-full -z-0"></div>
                        <h3 className="text-indigo-100 font-semibold mb-2 relative z-10 flex items-center">
                            <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                            Utilidad Neta
                        </h3>
                        <p className="text-5xl font-black relative z-10 mt-2">
                            ${parseFloat(stats.profit).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        <p className="text-sm text-indigo-200 mt-2 z-10 font-medium">Margen Global Referencial</p>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 mt-8">
                    <h2 className="text-xl font-bold text-slate-800 mb-6">Desglose Diario</h2>
                    {dailyStats.length === 0 ? (
                        <div className="flex items-center justify-center p-12 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
                            <p className="text-slate-400 font-medium text-center">
                                Aún no existen registros financieros para mostrar.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider">
                                        <th className="p-4 font-semibold rounded-tl-xl rounded-bl-xl">Fecha</th>
                                        <th className="p-4 font-semibold">Total Ventas</th>
                                        <th className="p-4 font-semibold">Total Gastos</th>
                                        <th className="p-4 font-semibold text-right rounded-tr-xl rounded-br-xl">Utilidad Neta</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {dailyStats.map((day, idx) => (
                                        <tr 
                                            key={idx} 
                                            onClick={() => router.visit(`/reports/${day.date}`)}
                                            className="hover:bg-indigo-50/50 cursor-pointer transition-colors group"
                                        >
                                            <td className="p-4 font-medium text-slate-700 group-hover:text-indigo-600 transition-colors">{day.date}</td>
                                            <td className="p-4 text-emerald-600 font-semibold">${day.sales.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                            <td className="p-4 text-rose-500 font-semibold">${day.expenses.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                            <td className={`p-4 font-bold text-right ${day.profit >= 0 ? 'text-indigo-600' : 'text-rose-600'}`}>
                                                ${day.profit.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            </div>
        </Layout>
    );
}
