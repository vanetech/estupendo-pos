import React, { useEffect, useState } from 'react';
import Layout from '../../Components/Layout';
import { router } from '@inertiajs/react';

export default function KitchenIndex({ orders }) {
    const [updatingParams, setUpdatingParams] = useState(null);

    // Silent HTTP Polling (10s)
    useEffect(() => {
        const interval = setInterval(() => {
            // only reload data silently without altering the full page DOM mapping
            router.reload({ only: ['orders'], preserveScroll: true, preserveState: true });
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    const advanceStatus = (saleId, currentStatus) => {
        setUpdatingParams(saleId);
        
        let targetStatus = 'PENDING';
        if (currentStatus === 'PENDING') targetStatus = 'PREPARING';
        else if (currentStatus === 'PREPARING') targetStatus = 'READY';
        else if (currentStatus === 'READY') targetStatus = 'DELIVERED';

        router.post(`/kitchen/${saleId}/status`, {
            preparation_status: targetStatus
        }, {
            preserveScroll: true,
            onFinish: () => setUpdatingParams(null)
        });
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'PENDING': return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'PREPARING': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'READY': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            default: return 'bg-slate-100 text-slate-800 border-slate-200';
        }
    };

    const getStatusLabel = (status) => {
        switch(status) {
            case 'PENDING': return 'En Espera';
            case 'PREPARING': return 'Preparando';
            case 'READY': return 'Listos para Entrega';
            default: return status;
        }
    };

    const getNextActionLabel = (status) => {
        switch(status) {
            case 'PENDING': return 'Iniciar Preparación';
            case 'PREPARING': return 'Marcar como Listo';
            case 'READY': return 'Entregar a Cliente / Despacho';
            default: return 'Terminado';
        }
    };

    // Calculate elapsed time strictly simply
    const getElapsedMinutes = (dateString) => {
        const orderDate = new Date(dateString);
        const now = new Date();
        const diffMs = now - orderDate;
        return Math.floor(diffMs / 60000);
    };

    return (
        <Layout>
            <div className="h-full flex flex-col pt-4">
                <header className="px-8 pb-4 flex justify-between items-center border-b border-slate-200/60 bg-slate-50/50">
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Pantalla de Cocina (KDS)</h1>
                        <p className="text-slate-500 mt-1">Los tickets se actualizan automáticamente cada 10 segundos.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="flex h-3 w-3 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                        </span>
                        <span className="text-sm font-bold text-slate-600">Sistema Conectado en Tiempo Real</span>
                    </div>
                </header>

                <div className="flex-1 w-full p-4 lg:p-8 overflow-hidden flex flex-col">
                    <div className="flex gap-4 md:gap-6 h-full pb-4 items-start overflow-x-auto overflow-y-hidden snap-x snap-mandatory">
                        
                        {/* PENDING COLUMN */}
                        <div className="min-w-[85vw] md:min-w-[350px] snap-center flex flex-col bg-slate-100/50 rounded-3xl border border-slate-200/60 p-4 h-full shadow-inner">
                            <h2 className="font-black text-slate-700 tracking-wider mb-4 flex justify-between items-center px-2">
                                EN ESPERA
                                <span className="bg-amber-100 text-amber-700 py-1 px-3 rounded-full text-sm">{orders.filter(o => o.preparation_status === 'PENDING').length}</span>
                            </h2>
                            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                                {orders.filter(o => o.preparation_status === 'PENDING').map(order => (
                                    <OrderCard 
                                        key={order.id} 
                                        order={order} 
                                        loading={updatingParams === order.id}
                                        onAdvance={() => advanceStatus(order.id, 'PENDING')}
                                        statusColor={getStatusColor('PENDING')}
                                        actionLabel={getNextActionLabel('PENDING')}
                                        elapsed={getElapsedMinutes(order.created_at)}
                                    />
                                ))}
                                {orders.filter(o => o.preparation_status === 'PENDING').length === 0 && (
                                    <p className="text-slate-400 text-center py-8 font-medium">No hay tickets esperando.</p>
                                )}
                            </div>
                        </div>

                        {/* PREPARING COLUMN */}
                        <div className="min-w-[85vw] md:min-w-[350px] snap-center flex flex-col bg-slate-100/50 rounded-3xl border border-slate-200/60 p-4 h-full shadow-inner">
                            <h2 className="font-black text-slate-700 tracking-wider mb-4 flex justify-between items-center px-2">
                                EN PREPARACIÓN
                                <span className="bg-blue-100 text-blue-700 py-1 px-3 rounded-full text-sm">{orders.filter(o => o.preparation_status === 'PREPARING').length}</span>
                            </h2>
                            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                                {orders.filter(o => o.preparation_status === 'PREPARING').map(order => (
                                    <OrderCard 
                                        key={order.id} 
                                        order={order} 
                                        loading={updatingParams === order.id}
                                        onAdvance={() => advanceStatus(order.id, 'PREPARING')}
                                        statusColor={getStatusColor('PREPARING')}
                                        actionLabel={getNextActionLabel('PREPARING')}
                                        elapsed={getElapsedMinutes(order.created_at)}
                                    />
                                ))}
                                {orders.filter(o => o.preparation_status === 'PREPARING').length === 0 && (
                                    <p className="text-slate-400 text-center py-8 font-medium">Nadie está cocinando nada.</p>
                                )}
                            </div>
                        </div>

                        {/* READY COLUMN */}
                        <div className="min-w-[85vw] md:min-w-[350px] snap-center flex flex-col bg-slate-100/50 rounded-3xl border border-slate-200/60 p-4 h-full shadow-inner">
                            <h2 className="font-black text-slate-700 tracking-wider mb-4 flex justify-between items-center px-2">
                                LISTOS PARA ENTREGAR
                                <span className="bg-emerald-100 text-emerald-700 py-1 px-3 rounded-full text-sm">{orders.filter(o => o.preparation_status === 'READY').length}</span>
                            </h2>
                            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                                {orders.filter(o => o.preparation_status === 'READY').map(order => (
                                    <OrderCard 
                                        key={order.id} 
                                        order={order} 
                                        loading={updatingParams === order.id}
                                        onAdvance={() => advanceStatus(order.id, 'READY')}
                                        statusColor={getStatusColor('READY')}
                                        actionLabel={getNextActionLabel('READY')}
                                        elapsed={getElapsedMinutes(order.created_at)}
                                    />
                                ))}
                                {orders.filter(o => o.preparation_status === 'READY').length === 0 && (
                                    <p className="text-slate-400 text-center py-8 font-medium">No hay pedidos listos.</p>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </Layout>
    );
}

// Subcomponent para los tickets individuales simulando comandas reales
function OrderCard({ order, loading, onAdvance, statusColor, actionLabel, elapsed }) {
    // Si la orden pasa de 15 minutos, ponemos el tiempo en rojo alertando urgencia
    const timeAlert = elapsed > 15 ? 'text-rose-600 bg-rose-50' : 'text-slate-500 bg-slate-50';

    return (
        <div className={`bg-white border-2 ${statusColor.split(' ')[2]} rounded-2xl p-5 shadow-lg shadow-slate-200/50 transition-all flex flex-col ${loading ? 'opacity-50 scale-95' : 'hover:-translate-y-1'}`}>
            <div className="flex justify-between items-start mb-4 border-b border-slate-100 pb-3">
                <div>
                    <h3 className="font-black text-lg text-slate-800">Orden #{order.id}</h3>
                    <p className={`text-xs font-bold px-2 py-1 rounded-md mt-1 inline-block ${timeAlert}`}>
                        Hace {elapsed} min
                    </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColor}`}>
                    {order.preparation_status}
                </div>
            </div>

            {order.notes && (
                <div className="bg-amber-50 text-amber-800 p-3 rounded-xl text-sm font-semibold border border-amber-200 mb-4 shadow-sm">
                    <span className="block text-xs uppercase text-amber-500 font-bold mb-1 tracking-wider">Atención Especial</span>
                    {order.notes}
                </div>
            )}

            <div className="flex-1 space-y-3 mb-5">
                {order.items.map(item => (
                    <div key={item.id} className="flex gap-3">
                        <div className="font-black text-slate-800 bg-slate-100 h-6 w-6 flex items-center justify-center rounded-md text-sm shrink-0">
                            {item.quantity}
                        </div>
                        <div className="flex-1">
                            <p className="font-bold text-slate-700 leading-tight">{item.product_name}</p>
                            {item.description && (
                                <p className="text-sm font-semibold text-rose-500 mt-1 bg-rose-50 px-2 py-1 rounded-md">
                                    Nota: {item.description}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <button 
                onClick={onAdvance}
                disabled={loading}
                className={`w-full py-3 rounded-xl font-black text-sm uppercase tracking-wider transition-all shadow-md ${
                    order.preparation_status === 'PENDING' ? 'bg-amber-400 text-amber-900 shadow-amber-400/30 hover:bg-amber-500' :
                    order.preparation_status === 'PREPARING' ? 'bg-blue-500 text-white shadow-blue-500/30 hover:bg-blue-600' :
                    'bg-emerald-500 text-white shadow-emerald-500/30 hover:bg-emerald-600'
                }`}
            >
                {loading ? 'Procesando...' : actionLabel}
            </button>
        </div>
    );
}
