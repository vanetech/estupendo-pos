import React, { useState } from 'react';
import Layout from '../../Components/Layout';
import { useForm } from '@inertiajs/react';

export default function CashShiftsIndex({ registers, shifts, currentShift }) {
    const { data: openData, setData: setOpenData, post: postOpen, processing: parsingOpen } = useForm({
        cash_register_id: registers.length > 0 ? registers[0].id : '',
        opening_amount: '0',
    });

    const { data: closeData, setData: setCloseData, post: postClose, processing: parsingClose } = useForm({
        closing_amount_declared: '0',
    });

    const handleOpen = (e) => {
        e.preventDefault();
        postOpen('/cash-shifts/open');
    };

    const handleClose = (e) => {
        e.preventDefault();
        postClose(`/cash-shifts/${currentShift.id}/close`);
    };

    return (
        <Layout>
            <div className="p-8 max-w-6xl mx-auto space-y-8">
                <header className="mb-10">
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Turnos de Caja</h1>
                    <p className="text-slate-500 mt-2 text-lg">Gestiona la apertura y cierre de las cajas registradoras.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                    {/* Status Card */}
                    <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col justify-center relative overflow-hidden group">
                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-br from-indigo-100 to-purple-50 rounded-full blur-3xl opacity-50 group-hover:bg-indigo-200 transition-colors duration-500"></div>
                        <h2 className="text-xl font-bold text-slate-800 mb-6 relative z-10">Estado Actual</h2>
                        {currentShift ? (
                            <div className="space-y-4 relative z-10">
                                <div className="flex items-center text-teal-600 bg-teal-50 px-4 py-2 rounded-xl inline-flex w-max font-bold shadow-inner">
                                    <span className="w-3 h-3 bg-teal-500 rounded-full mr-2 animate-pulse"></span>
                                    Caja Abierta
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <div>
                                        <p className="text-slate-400 text-sm font-medium">Apertura</p>
                                        <p className="text-slate-800 font-bold text-xl">${parseFloat(currentShift.opening_amount).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-400 text-sm font-medium">Caja Registro</p>
                                        <p className="text-slate-800 font-bold text-xl">{currentShift.cash_register?.name || 'Caja Principal'}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4 relative z-10">
                                <div className="flex items-center text-rose-600 bg-rose-50 px-4 py-2 rounded-xl inline-flex w-max font-bold shadow-inner">
                                    <span className="w-3 h-3 bg-rose-500 rounded-full mr-2"></span>
                                    Caja Cerrada
                                </div>
                                <p className="text-slate-500">Ninguna caja registradora está activa en este momento.</p>
                            </div>
                        )}
                    </div>

                    {/* Action form */}
                    <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
                        {!currentShift ? (
                            <form onSubmit={handleOpen} className="space-y-5">
                                <h2 className="text-xl font-bold text-slate-800 mb-6">Abrir Caja</h2>
                                
                                <div>
                                    <label className="block text-sm font-semibold text-slate-600 mb-2">Seleccionar Caja</label>
                                    <select 
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none"
                                        value={openData.cash_register_id}
                                        onChange={e => setOpenData('cash_register_id', e.target.value)}
                                    >
                                        <option value="">Seleccione...</option>
                                        {registers.map(r => (
                                            <option key={r.id} value={r.id}>{r.name}</option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-semibold text-slate-600 mb-2">Monto Inicial (Base)</label>
                                    <input 
                                        type="number" 
                                        step="0.01"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none"
                                        value={openData.opening_amount}
                                        onChange={e => setOpenData('opening_amount', e.target.value)}
                                    />
                                </div>

                                <button 
                                    className="w-full mt-4 bg-gradient-to-r from-teal-500 to-indigo-500 text-white font-bold rounded-xl px-4 py-4 shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
                                    disabled={parsingOpen}
                                >
                                    Abrir Turno
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleClose} className="space-y-5">
                                <h2 className="text-xl font-bold text-slate-800 mb-6">Cerrar Caja</h2>
                                <p className="text-slate-500 text-sm mb-4">Ingresa el dinero físico contabilizado en caja para el cuadre final.</p>
                                
                                <div>
                                    <label className="block text-sm font-semibold text-slate-600 mb-2">Monto Declarado</label>
                                    <input 
                                        type="number" 
                                        step="0.01"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none text-2xl font-bold"
                                        value={closeData.closing_amount_declared}
                                        onChange={e => setCloseData('closing_amount_declared', e.target.value)}
                                    />
                                </div>

                                <button 
                                    className="w-full mt-4 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold rounded-xl px-4 py-4 shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
                                    disabled={parsingClose}
                                >
                                    Cerrar y Cuadrar Caja
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                        <h2 className="text-xl font-bold text-slate-800">Historial de Turnos</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500">
                                    <th className="p-4 font-semibold rounded-tl-lg">ID</th>
                                    <th className="p-4 font-semibold">Caja</th>
                                    <th className="p-4 font-semibold">Apertura</th>
                                    <th className="p-4 font-semibold">Cierre</th>
                                    <th className="p-4 font-semibold">Monto Apertura</th>
                                    <th className="p-4 font-semibold">Diferencia</th>
                                </tr>
                            </thead>
                            <tbody>
                                {shifts.map((shift, i) => (
                                    <tr key={shift.id} className={`border-b border-slate-50 hover:bg-slate-50/60 transition-colors ${i%2===0?'bg-white':'bg-slate-50/20'}`}>
                                        <td className="p-4 font-medium text-slate-800">#{shift.id}</td>
                                        <td className="p-4 text-slate-600">{shift.cash_register?.name || '-'}</td>
                                        <td className="p-4 text-slate-600">{new Date(shift.opened_at).toLocaleString()}</td>
                                        <td className="p-4">
                                            {shift.closed_at ? (
                                                <span className="text-slate-600">{new Date(shift.closed_at).toLocaleString()}</span>
                                            ) : (
                                                <span className="bg-teal-100 text-teal-700 font-medium px-2 py-1 rounded-md text-xs">Activo</span>
                                            )}
                                        </td>
                                        <td className="p-4 font-medium">${parseFloat(shift.opening_amount).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                        <td className="p-4">
                                            {shift.difference !== null ? (
                                                <span className={`font-bold ${parseFloat(shift.difference) < 0 ? 'text-rose-500' : 'text-teal-500'}`}>
                                                    ${parseFloat(shift.difference).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </span>
                                            ) : '-'}
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
