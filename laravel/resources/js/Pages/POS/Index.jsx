import React, { useState } from 'react';
import Layout from '../../Components/Layout';
import { useForm } from '@inertiajs/react';

export default function PosIndex({ products, paymentMethods, business, openShift }) {
    const [cart, setCart] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showMobileCart, setShowMobileCart] = useState(false);
    const [discountInput, setDiscountInput] = useState('');
    const [extraChargeInput, setExtraChargeInput] = useState('');
    
    const [toastMessage, setToastMessage] = useState({ show: false, type: '', text: '' });
    
    const [paymentsState, setPaymentsState] = useState([
        { payment_method_id: paymentMethods.length > 0 ? paymentMethods[0].id : '', amount: '' }
    ]);
    
    const { data, setData, post, processing, reset, errors } = useForm({
        business_id: business.id,
        cash_shift_id: openShift ? openShift.id : '',
        discount: 0,
        extra_charge: 0,
        payments: [],
        cart: [],
        notes: '',
    });

    const formatThousands = (val) => {
        if (!val && val !== 0) return '';
        const num = val.toString().replace(/[^\d]/g, '');
        return num ? parseInt(num).toLocaleString('es-CO') : '';
    };

    const parseRawNumber = (val) => {
        return val.toString().replace(/[^\d]/g, '');
    };

    const addToCart = (product) => {
        setCart(prev => {
            const exists = prev.find(item => item.id === product.id);
            if (exists) {
                return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { ...product, quantity: 1, description: '' }];
        });
    };

    const removeFromCart = (productId) => {
        setCart(prev => prev.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId, amount) => {
        setCart(prev => prev.map(item => {
            if (item.id === productId) {
                const newQuantity = item.quantity + amount;
                return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
            }
            return item;
        }));
    };

    const updateDescription = (productId, text) => {
        setCart(prev => prev.map(item => item.id === productId ? { ...item, description: text } : item));
    };

    const subTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discountVal = parseFloat(discountInput) || 0;
    const extraChargeVal = parseFloat(extraChargeInput) || 0;
    const grandTotal = Math.max(0, subTotal - discountVal + extraChargeVal);

    const handleCheckout = () => {
        setPaymentsState([
            { payment_method_id: paymentMethods.length > 0 ? paymentMethods[0].id : '', amount: grandTotal }
        ]);
        setShowConfirmModal(true);
    };

    const updatePayment = (index, field, value) => {
        const newPayments = [...paymentsState];
        newPayments[index][field] = value;
        setPaymentsState(newPayments);
    };

    const addPaymentRow = () => {
        setPaymentsState([...paymentsState, { payment_method_id: paymentMethods.length > 0 ? paymentMethods[0].id : '', amount: '' }]);
    };

    const removePaymentRow = (index) => {
        const newPayments = [...paymentsState];
        newPayments.splice(index, 1);
        setPaymentsState(newPayments);
    };

    const totalTendered = paymentsState.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
    const changeAmount = Math.max(0, totalTendered - grandTotal);
    const balanceRemaining = Math.max(0, grandTotal - totalTendered);
    const canConfirm = totalTendered >= grandTotal && cart.length > 0;

    const confirmCheckout = () => {
        setData({
            ...data,
            cart: cart,
            discount: discountVal,
            extra_charge: extraChargeVal,
            payments: paymentsState.map(p => ({
                payment_method_id: p.payment_method_id,
                amount: parseFloat(p.amount) || 0
            }))
        });

        setTimeout(() => {
            post('/pos/sales', {
                onSuccess: (page) => {
                    const msg = page.props.flash?.success || 'La venta fue registrada.';
                    setCart([]);
                    setDiscountInput('');
                    setExtraChargeInput('');
                    reset('cart', 'discount', 'extra_charge', 'payments', 'notes');
                    setShowConfirmModal(false);
                    setShowMobileCart(false);
                    setToastMessage({ show: true, type: 'success', text: msg });
                    setTimeout(() => setToastMessage({ show: false, type: '', text: '' }), 5000);
                },
                onError: (errs) => {
                    setToastMessage({ show: true, type: 'error', text: 'Ocurrió un error.' });
                    setTimeout(() => setToastMessage({ show: false, type: '', text: '' }), 5000);
                }
            });
        }, 50);
    };

    if (!openShift) {
        return (
            <Layout>
                <div className="flex flex-col items-center justify-center p-4 h-full">
                    <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl w-full flex flex-col items-center max-w-md text-center">
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Caja Cerrada</h2>
                        <p className="text-slate-500 mb-8">Debes abrir una caja primero antes de registrar órdenes.</p>
                        <a href="/cash-shifts" className="px-6 py-3 w-full bg-rose-500 text-white rounded-xl shadow-lg font-medium">
                            Ir a Turnos
                        </a>
                    </div>
                </div>
            </Layout>
        );
    }

    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (product.sku && product.sku.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <Layout>
            {/* FAB Mobile Only */}
            <div className="lg:hidden fixed bottom-6 left-4 right-4 z-30 animate-[fadeIn_0.5s_ease-out]">
                <button 
                    onClick={() => setShowMobileCart(true)} 
                    className="w-full bg-indigo-900 text-white rounded-2xl p-4 shadow-2xl font-black flex justify-between items-center border border-indigo-700/50"
                >
                    <span className="flex items-center gap-2">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        Ver Carrito
                    </span>
                    <span className="bg-white text-indigo-900 px-3 py-1 rounded-full text-sm">
                        {cart.reduce((sum, item) => sum + item.quantity, 0)} - ${grandTotal.toLocaleString('es-CO')}
                    </span>
                </button>
            </div>

            <div className="flex flex-col lg:flex-row h-full p-2 md:p-4 gap-4 relative pb-24 lg:pb-4">
                
                {/* Left: Products Grid */}
                <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden flex flex-col">
                    <div className="p-4 md:p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-white/80 backdrop-blur-md sticky top-0 z-10">
                        <h2 className="text-xl font-bold text-slate-800 w-full md:w-auto">Menú</h2>
                        <div className="relative w-full md:w-auto">
                            <input 
                                type="text" 
                                placeholder="Buscar..." 
                                className="w-full md:w-64 pl-10 pr-4 py-3 md:py-2 bg-slate-50 border border-slate-200 rounded-2xl md:rounded-full focus:ring-2 focus:ring-indigo-500/50 outline-none"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <svg className="w-5 h-5 text-slate-400 absolute left-3 top-3.5 md:top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-4 md:p-6">
                        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                            {filteredProducts.map(product => (
                                <button 
                                    key={product.id} 
                                    onClick={() => addToCart(product)}
                                    className="group bg-white border border-slate-200 rounded-2xl p-3 md:p-4 flex flex-col items-center text-center hover:border-indigo-400 shadow-sm active:scale-95 transition-all"
                                >
                                    {product.image_path ? (
                                        <div className="w-16 h-16 md:w-24 md:h-24 mb-3 rounded-xl overflow-hidden shadow-sm border border-slate-100 group-hover:scale-105 transition-transform">
                                            <img src={`/storage/products/${product.image_path.split('/').pop()}`} alt={product.name} className="object-cover w-full h-full" />
                                        </div>
                                    ) : (
                                        <div className="w-16 h-16 md:w-24 md:h-24 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center mb-3">
                                            <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    )}
                                    <h3 className="font-semibold text-sm md:text-base text-slate-700 truncate w-full">{product.name}</h3>
                                    <p className="text-indigo-600 font-bold mt-1 text-sm md:text-base">${parseFloat(product.price).toLocaleString('es-CO')}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Mobile Backdrop overlay */}
                {showMobileCart && (
                    <div className="fixed inset-0 z-40 bg-slate-900/60 lg:hidden backdrop-blur-sm" onClick={() => setShowMobileCart(false)}></div>
                )}

                {/* Right: Receipt / Cart Drawer (Mobile) AND Fixed panel (Desktop) */}
                <div className={`
                    fixed bottom-0 left-0 w-full h-[85vh] bg-white rounded-t-3xl z-50 flex flex-col shadow-[0_-10px_40px_-5px_rgba(0,0,0,0.3)] transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]
                    lg:static lg:h-full lg:w-[26rem] lg:rounded-3xl lg:translate-y-0 lg:shadow-xl lg:border lg:border-slate-200/60 lg:z-10
                    ${showMobileCart ? 'translate-y-0' : 'translate-y-full'}
                `}>
                    <div className="p-4 md:p-6 border-b border-slate-100 flex justify-between items-center bg-white/80 shrink-0">
                        <h2 className="text-xl font-bold text-slate-800">Orden Actual</h2>
                        <button onClick={() => setShowMobileCart(false)} className="lg:hidden p-2 text-slate-400 bg-slate-100 rounded-full">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2 bg-slate-50/50">
                        {cart.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center space-y-4">
                                <svg className="w-16 h-16 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                <p className="text-sm">El carrito está vacío.</p>
                            </div>
                        ) : (
                            <ul className="space-y-3 p-2">
                                {cart.map(item => (
                                    <li key={item.id} className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex-1 min-w-0 pr-2">
                                                <h4 className="font-medium text-slate-800 text-sm md:text-base truncate">{item.name}</h4>
                                                <p className="text-indigo-600 font-semibold text-sm md:text-base">${parseFloat(item.price).toLocaleString('es-CO')}</p>
                                            </div>
                                            <div className="flex items-center gap-2 md:gap-3">
                                                <div className="flex items-center bg-slate-100 rounded-lg border border-slate-200">
                                                    <button onClick={() => updateQuantity(item.id, -1)} className="px-2 md:px-3 py-1 font-bold active:bg-slate-300">-</button>
                                                    <span className="w-6 md:w-8 text-center text-sm font-bold text-slate-800">{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.id, 1)} className="px-2 md:px-3 py-1 font-bold active:bg-slate-300">+</button>
                                                </div>
                                                <button onClick={() => removeFromCart(item.id)} className="text-rose-400 p-2 bg-rose-50 rounded-lg">
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="mt-1">
                                            <input 
                                                type="text" 
                                                placeholder="Comentarios (ej. sin cebolla...)"
                                                value={item.description}
                                                onChange={e => updateDescription(item.id, e.target.value)}
                                                className="w-full text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 outline-none focus:ring-1 focus:ring-indigo-400"
                                            />
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="border-t border-slate-100 p-4 md:p-6 bg-white shrink-0 z-20 pb-8 lg:pb-6">
                        <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-4">
                            <span className="text-slate-500 font-medium text-sm">Descuento Global ($)</span>
                            <input 
                                type="text" 
                                value={formatThousands(discountInput)}
                                onChange={e => setDiscountInput(parseRawNumber(e.target.value))}
                                placeholder="0"
                                className="w-24 text-right bg-slate-50 border border-slate-200 text-rose-500 font-semibold rounded-lg py-2 px-2 outline-none"
                            />
                        </div>
                        <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-4">
                            <span className="text-slate-500 font-medium text-sm">Cargo Extra ($)</span>
                            <input 
                                type="text" 
                                value={formatThousands(extraChargeInput)}
                                onChange={e => setExtraChargeInput(parseRawNumber(e.target.value))}
                                placeholder="0"
                                className="w-24 text-right bg-slate-50 border border-slate-200 text-indigo-500 font-semibold rounded-lg py-2 px-2 outline-none"
                            />
                        </div>
                        
                        <div className="flex justify-between items-end mb-4">
                            <span className="text-slate-600 font-bold uppercase tracking-wide text-sm">Total</span>
                            <span className="text-3xl md:text-4xl font-black text-slate-800">
                                ${grandTotal.toLocaleString('es-CO')}
                            </span>
                        </div>
                        
                        <button 
                            disabled={cart.length === 0 || processing}
                            onClick={handleCheckout}
                            className={`w-full py-4 rounded-2xl font-bold text-lg shadow-xl outline-none active:scale-95 ${
                                cart.length === 0 || processing ? 'bg-slate-200 text-slate-400 pointer-events-none' : 'bg-gradient-to-r from-indigo-500 to-pink-500 text-white'
                            }`}
                        >
                            {processing ? '...' : 'Cobrar Orden'}
                        </button>
                    </div>
                </div>

            </div>

            {/* Modal de Cobro Múltiple */}
            {showConfirmModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-2 bg-slate-900/60 backdrop-blur-sm shadow-2xl overflow-y-auto">
                    <div className="bg-white rounded-[2rem] w-full max-w-4xl max-h-[95vh] lg:max-h-[85vh] flex flex-col md:flex-row overflow-hidden shadow-2xl relative my-auto border border-slate-100/50">
                        
                        {/* Seccion Izquierda: Detalle de la Orden */}
                        <div className="w-full md:w-1/2 border-b md:border-b-0 md:border-r border-slate-100 flex flex-col bg-slate-50/30 overflow-y-auto hidden lg:flex">
                        {/* Desabilito previsualizacion en movil porque ocupa espacio clave. Desktop unicamente. */}
                            <div className="p-6 border-b border-slate-100 bg-white">
                                <h2 className="text-2xl font-bold text-slate-800">Resumen</h2>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto p-6">
                                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                                    <table className="w-full text-left border-collapse text-sm">
                                        <thead className="bg-slate-50">
                                            <tr>
                                                <th className="p-3">Producto</th>
                                                <th className="p-3 text-center">C.</th>
                                                <th className="p-3 text-right">Sub.</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {cart.map(item => (
                                                <tr key={item.id}>
                                                    <td className="p-3 truncate max-w-[120px]">{item.name}</td>
                                                    <td className="p-3 text-center">{item.quantity}</td>
                                                    <td className="p-3 text-right">${(item.price * item.quantity).toLocaleString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="p-6 border-t border-slate-100 bg-white shrink-0">
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Gran Total</span>
                                    <span className="text-indigo-600">${grandTotal.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Seccion Derecha: Pagos & Notas */}
                        <div className="w-full md:w-1/2 flex flex-col bg-white overflow-y-auto h-full">
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10 shrink-0">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-800">Pago</h2>
                                </div>
                                <button onClick={() => setShowConfirmModal(false)} className="md:hidden bg-slate-100 p-2 rounded-full">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            
                            <div className="p-4 md:p-6 space-y-4 shrink-0">
                                {paymentsState.map((payment, index) => (
                                    <div key={index} className="flex gap-2 items-center bg-slate-50 p-3 md:p-4 rounded-xl border border-slate-200">
                                        <div className="w-1/2">
                                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Medio</label>
                                            <select 
                                                value={payment.payment_method_id}
                                                onChange={e => updatePayment(index, 'payment_method_id', e.target.value)}
                                                className="w-full bg-white border border-slate-200 text-sm rounded-lg p-2 outline-none"
                                            >
                                                {paymentMethods.map(pm => (
                                                    <option key={pm.id} value={pm.id}>{pm.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Monto ($)</label>
                                            <input
                                                type="text"
                                                value={formatThousands(payment.amount)}
                                                onChange={e => updatePayment(index, 'amount', parseRawNumber(e.target.value))}
                                                className="w-full bg-white border border-slate-200 text-sm rounded-lg p-2 outline-none font-bold"
                                            />
                                        </div>
                                        {paymentsState.length > 1 && (
                                            <div className="pt-5">
                                                <button onClick={() => removePaymentRow(index)} className="p-2 text-rose-500">
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                <button 
                                    onClick={addPaymentRow}
                                    className="w-full py-3 border-2 border-dashed border-slate-300 text-slate-500 text-sm font-semibold rounded-xl"
                                >
                                    + Agregar Parte de Pago
                                </button>
                                
                                <div className="mt-4 pt-4 border-t border-slate-100">
                                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Notas (Opcional)</label>
                                    <textarea
                                        value={data.notes}
                                        onChange={e => setData('notes', e.target.value)}
                                        placeholder="Tiempos, Domicilios..."
                                        rows="2"
                                        className="w-full bg-slate-50 border border-slate-200 text-sm rounded-xl p-3 outline-none"
                                    ></textarea>
                                </div>
                            </div>

                            <div className="p-4 md:p-6 bg-slate-50 mt-auto border-t border-slate-200 shrink-0">
                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between font-bold">
                                        <span className="text-slate-800">Pagado:</span>
                                        <span className="text-emerald-600">${totalTendered.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-lg">
                                        <span className="font-black text-rose-500">Cambio Vueltos:</span>
                                        <span className="font-black text-rose-500">${changeAmount.toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => setShowConfirmModal(false)}
                                        className="hidden md:block py-3 px-4 bg-white border border-slate-200 rounded-xl font-bold"
                                    >
                                        Atrás
                                    </button>
                                    <button 
                                        onClick={confirmCheckout}
                                        disabled={!canConfirm || processing}
                                        className={`flex-1 py-4 px-6 rounded-xl font-bold text-center w-full active:scale-95 transition-all ${
                                            !canConfirm || processing ? 'bg-slate-300 text-slate-500' : 'bg-emerald-500 text-white'
                                        }`}
                                    >
                                        Registrar Final
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            )}
            
            {toastMessage.show && (
                <div className="fixed bottom-24 lg:bottom-8 right-4 lg:right-8 z-[100] px-6 py-4 rounded-xl bg-slate-900 border border-slate-800 text-white shadow-2xl flex items-center gap-3 animate-[slideIn_0.3s_ease-out]">
                    <span className="font-semibold">{toastMessage.text}</span>
                </div>
            )}
        </Layout>
    );
}
