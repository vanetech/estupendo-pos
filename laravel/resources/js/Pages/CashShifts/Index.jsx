import React, { useState } from 'react';
import Layout from '../../Components/Layout';
import { useForm } from '@inertiajs/react';

export default function CashShiftsIndex({ registers, shifts, currentShift }) {
    const [viewShift, setViewShift] = useState(null);

    const { data: openData, setData: setOpenData, post: postOpen, processing: parsingOpen } = useForm({
        cash_register_id: registers.length > 0 ? registers[0].id : '',
        opening_amount: '0',
    });

    const { data: closeData, setData: setCloseData, post: postClose, processing: parsingClose } = useForm({
        amount_cash_declared: '',
    });

    const formatThousands = (val) => {
        if (!val && val !== 0) return '';
        const num = val.toString().replace(/[^\d]/g, '');
        return num ? parseInt(num).toLocaleString('es-CO') : '';
    };

    const parseRawNumber = (val) => {
        return val.toString().replace(/[^\d]/g, '');
    };

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
                    <p className="text-slate-500 mt-2 text-lg">Gestiona flujos físicos, transferencias bancarias y cierres contables ciegos.</p>
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
                                        <p className="text-slate-400 text-sm font-medium">Apertura Inicial (Base)</p>
                                        <p className="text-slate-800 font-bold text-2xl">${parseFloat(currentShift.opening_amount).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-400 text-sm font-medium">Terminal Registradora</p>
                                        <p className="text-indigo-600 font-bold text-xl">{currentShift.cash_register?.name || 'Caja Principal'}</p>
                                    </div>
                                    <div className="col-span-2 pt-2 border-t border-slate-100">
                                        <p className="text-slate-400 text-sm font-medium">Abierto Por:</p>
                                        <p className="text-slate-700 font-bold">{currentShift.opened_by?.name || 'Sistema'}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4 relative z-10">
                                <div className="flex items-center text-rose-600 bg-rose-50 px-4 py-2 rounded-xl inline-flex w-max font-bold shadow-inner">
                                    <span className="w-3 h-3 bg-rose-500 rounded-full mr-2"></span>
                                    Cajas Inactivas
                                </div>
                                <p className="text-slate-500">Inicia una sesión contable estableciendo una base en efectivo.</p>
                            </div>
                        )}
                    </div>

                    {/* Action form */}
                    <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
                        {!currentShift ? (
                            <form onSubmit={handleOpen} className="space-y-5">
                                <h2 className="text-xl font-bold text-slate-800 mb-6">Abrir Caja Fija</h2>
                                
                                <div>
                                    <label className="block text-sm font-semibold text-slate-600 mb-2">Seleccionar Caja (Terminal)</label>
                                    <select 
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none text-slate-700"
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
                                    <label className="block text-sm font-semibold text-slate-600 mb-2">Dinero Físico (Efectivo Base)</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none font-bold text-xl text-slate-800"
                                        value={formatThousands(openData.opening_amount)}
                                        onChange={e => setOpenData('opening_amount', parseRawNumber(e.target.value))}
                                    />
                                </div>

                                <button 
                                    className="w-full mt-4 bg-gradient-to-r from-teal-500 to-indigo-500 text-white font-bold rounded-xl px-4 py-4 shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
                                    disabled={parsingOpen}
                                >
                                    Abrir Turno Transaccional
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleClose} className="space-y-5">
                                <h2 className="text-xl font-bold text-slate-800 mb-6">Cierre Contable (Cuadre Ciego)</h2>
                                <p className="text-slate-500 text-sm mb-4">El sistema totalizará los vouchers de tarjetas y Nequi automáticamente. <b>Solo debes contar el papel moneda (efectivo):</b></p>
                                
                                <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100">
                                    <label className="block text-sm font-bold text-rose-700 uppercase tracking-widest mb-2">Efectivo Físico en Cajón</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-white border border-rose-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all outline-none text-3xl font-black text-rose-600 shadow-sm"
                                        value={formatThousands(closeData.amount_cash_declared)}
                                        onChange={e => setCloseData('amount_cash_declared', parseRawNumber(e.target.value))}
                                    />
                                </div>

                                <button 
                                    className="w-full mt-4 bg-slate-900 border border-slate-800 text-white font-bold rounded-xl px-4 py-4 shadow-xl hover:bg-slate-800 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
                                    disabled={parsingClose}
                                >
                                    Declarar Cuadre & Cerrar Turno
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                        <h2 className="text-xl font-bold text-slate-800">Historial Estricto de Turnos</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500">
                                    <th className="p-4 font-semibold rounded-tl-lg">ID</th>
                                    <th className="p-4 font-semibold">Caja</th>
                                    <th className="p-4 font-semibold">Apertura</th>
                                    <th className="p-4 font-semibold">Cierre</th>
                                    <th className="p-4 font-semibold">Diferencia</th>
                                    <th className="p-4 font-semibold text-right">Reporte</th>
                                </tr>
                            </thead>
                            <tbody>
                                {shifts.map((shift, i) => (
                                    <tr key={shift.id} className={`border-b border-slate-50 hover:bg-slate-50/80 transition-colors ${i%2===0?'bg-white':'bg-slate-50/20'}`}>
                                        <td className="p-4 font-medium text-slate-800">#{shift.id}</td>
                                        <td className="p-4 text-slate-600">{shift.cash_register?.name || '-'}</td>
                                        <td className="p-4 text-slate-600">{new Date(shift.opened_at).toLocaleString()}</td>
                                        <td className="p-4">
                                            {shift.closed_at ? (
                                                <span className="text-slate-600">{new Date(shift.closed_at).toLocaleString()}</span>
                                            ) : (
                                                <span className="bg-teal-100 text-teal-700 font-bold px-3 py-1 rounded-full text-xs">Aún Operando</span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            {shift.difference !== null ? (
                                                <span className={`font-black ${parseFloat(shift.difference) < 0 ? 'text-rose-500' : parseFloat(shift.difference) > 0 ? 'text-indigo-500' : 'text-emerald-500'}`}>
                                                    {parseFloat(shift.difference) > 0 && '+'}
                                                    ${parseFloat(shift.difference).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </span>
                                            ) : '-'}
                                        </td>
                                        <td className="p-4 text-right">
                                            {shift.closed_at && (
                                                <button 
                                                    onClick={() => setViewShift(shift)}
                                                    className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                                                    title="Ver Z-Report"
                                                >
                                                    <svg className="w-5 h-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            {/* Shift Details Modal (Z-Report Equivalent) */}
            {viewShift && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full h-[85vh] flex flex-col transform transition-all border border-slate-100/50">
                        
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h1 className="text-2xl font-black text-slate-800">Reporte de Cierre (Z)</h1>
                                <p className="text-slate-500 font-medium text-sm">Turno #{viewShift.id} - {viewShift.cash_register?.name}</p>
                            </div>
                            <button 
                                onClick={() => setViewShift(null)}
                                className="bg-white border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-2 rounded-full transition-all"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-white">
                            
                            {/* Auditoría Section */}
                            <section className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Auditoría Temporal</h3>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-slate-500 text-xs font-semibold mb-1">Apertura</p>
                                        <p className="font-bold text-slate-800 text-sm whitespace-pre-line">
                                            {new Date(viewShift.opened_at).toLocaleString()}{'\n'}
                                            <span className="text-indigo-600 font-medium">Por: {viewShift.opened_by?.name}</span>
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500 text-xs font-semibold mb-1">Cierre</p>
                                        <p className="font-bold text-slate-800 text-sm whitespace-pre-line">
                                            {new Date(viewShift.closed_at).toLocaleString()}{'\n'}
                                            <span className="text-indigo-600 font-medium">Por: {viewShift.closed_by?.name}</span>
                                        </p>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Análisis de Valores Transaccionales</h3>
                                <div className="space-y-4">
                                    
                                    {/* CABECERA */}
                                    <div className="grid grid-cols-4 gap-2 border-b border-indigo-100 pb-2 px-2">
                                        <div className="col-span-1 text-xs font-bold text-slate-500 uppercase">Medio de Pago</div>
                                        <div className="col-span-1 text-xs font-bold text-slate-500 uppercase text-right">Sistema (Calculado)</div>
                                        <div className="col-span-1 text-xs font-bold text-slate-500 uppercase text-right">Cajero (Declarado)</div>
                                        <div className="col-span-1 text-xs font-bold text-slate-500 uppercase text-right">Descuadre</div>
                                    </div>

                                    {/* EFECTIVO BASE */}
                                    <div className="grid grid-cols-4 gap-2 items-center px-2">
                                        <div className="col-span-1 text-sm font-semibold text-slate-400 tracking-wide">Base (Fondo Banco)</div>
                                        <div className="col-span-1 text-right font-medium text-slate-600">${parseFloat(viewShift.opening_amount).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                                        <div className="col-span-1 text-right font-medium text-slate-400">-</div>
                                        <div className="col-span-1 text-right font-medium text-slate-400">-</div>
                                    </div>

                                    {/* EFECTIVO */}
                                    <div className="grid grid-cols-4 gap-2 items-center px-2 py-2 bg-rose-50/50 rounded-lg">
                                        <div className="col-span-1 text-sm font-bold text-rose-700">EFECTIVO (Base+Vtas-Gastos)</div>
                                        <div className="col-span-1 text-right font-bold text-rose-600">${parseFloat(viewShift.amount_cash_calculated).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                                        <div className="col-span-1 text-right font-bold text-slate-800">${parseFloat(viewShift.amount_cash_declared).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                                        <div className="col-span-1 text-right font-black">
                                            <span className={(parseFloat(viewShift.amount_cash_declared) - parseFloat(viewShift.amount_cash_calculated)) < 0 ? 'text-rose-500' : 'text-emerald-500'}>
                                                ${(parseFloat(viewShift.amount_cash_declared) - parseFloat(viewShift.amount_cash_calculated)).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </span>
                                        </div>
                                    </div>

                                    {/* CARD */}
                                    <div className="grid grid-cols-4 gap-2 items-center px-2">
                                        <div className="col-span-1 text-sm font-bold text-indigo-700">TARJETAS (Datafonos)</div>
                                        <div className="col-span-1 text-right font-bold text-indigo-600">${parseFloat(viewShift.amount_card_calculated).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                                        <div className="col-span-1 text-right font-bold text-slate-400">Automatizado</div>
                                        <div className="col-span-1 text-right font-medium text-slate-400">-</div>
                                    </div>

                                    {/* TRANSFERENCIA */}
                                    <div className="grid grid-cols-4 gap-2 items-center px-2">
                                        <div className="col-span-1 text-sm font-bold text-teal-700">TRANSFERENCIAS (Bancos)</div>
                                        <div className="col-span-1 text-right font-bold text-teal-600">${parseFloat(viewShift.amount_transfer_calculated).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                                        <div className="col-span-1 text-right font-bold text-slate-400">Automatizado</div>
                                        <div className="col-span-1 text-right font-medium text-slate-400">-</div>
                                    </div>

                                </div>
                            </section>
                            
                        </div>

                        {/* Totales Fijos */}
                        <div className="bg-slate-900 text-white p-8 rounded-b-3xl">
                            <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-4">
                                <div className="text-slate-300 font-medium">Gran Total Calculado (Operativo)</div>
                                <div className="text-2xl font-bold">${parseFloat(viewShift.closing_amount_calculated).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                            </div>
                            
                            <div className="flex justify-between items-center bg-black/30 p-4 rounded-xl border border-slate-700">
                                <div className="text-slate-300 font-bold uppercase tracking-widest text-sm">Descuadre Real Detectado</div>
                                <div className={`text-4xl font-black ${
                                    parseFloat(viewShift.difference) < 0 
                                      ? 'text-rose-400' 
                                      : parseFloat(viewShift.difference) > 0 ? 'text-indigo-400' : 'text-emerald-400'
                                }`}>
                                    ${parseFloat(viewShift.difference).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </Layout>
    );
}
