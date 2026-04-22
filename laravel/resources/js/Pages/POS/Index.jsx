import React, { useState } from 'react';
import Layout from '../../Components/Layout';
import { useForm } from '@inertiajs/react';

export default function PosIndex({ products, paymentMethods, business, openShift }) {
    const [cart, setCart] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [discountInput, setDiscountInput] = useState('');
    
    const [toastMessage, setToastMessage] = useState({ show: false, type: '', text: '' });
    
    // Modal specific payments state array
    const [paymentsState, setPaymentsState] = useState([
        { payment_method_id: paymentMethods.length > 0 ? paymentMethods[0].id : '', amount: '' }
    ]);
    
    const { data, setData, post, processing, reset, errors } = useForm({
        business_id: business.id,
        cash_shift_id: openShift ? openShift.id : '',
        discount: 0,
        payments: [],
        cart: [],
    });

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
    const grandTotal = Math.max(0, subTotal - discountVal);

    const handleCheckout = () => {
        // Pre-fill amount of the first payment method to be the grand total to save time
        setPaymentsState([
            { payment_method_id: paymentMethods.length > 0 ? paymentMethods[0].id : '', amount: grandTotal.toFixed(2) }
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
        // Hydrate the Inertia form with the accurate cart, discount and payments before posting
        setData({
            ...data,
            cart: cart,
            discount: discountVal,
            payments: paymentsState.map(p => ({
                payment_method_id: p.payment_method_id,
                amount: parseFloat(p.amount) || 0
            }))
        });

        // We use setTimeout to ensure React state batching applies `data` before firing post
        setTimeout(() => {
            post('/pos/sales', {
                onSuccess: () => {
                    setCart([]);
                    setDiscountInput('');
                    reset('cart', 'discount', 'payments');
                    setShowConfirmModal(false);
                    setToastMessage({ show: true, type: 'success', text: 'La venta y el pago fueron registrados con éxito.' });
                    setTimeout(() => setToastMessage({ show: false, type: '', text: '' }), 5000);
                },
                onError: (errs) => {
                    setToastMessage({ show: true, type: 'error', text: 'Ocurrió un error al registrar la venta.' });
                    setTimeout(() => setToastMessage({ show: false, type: '', text: '' }), 5000);
                }
            });
        }, 50);
    };

    if (!openShift) {
        return (
            <Layout>
                <div className="flex flex-col items-center justify-center h-full">
                    <div className="bg-white p-10 rounded-3xl shadow-xl border border-rose-100 flex flex-col items-center max-w-md text-center transform transition-all duration-500 hover:scale-[1.01]">
                        <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
                            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Caja Cerrada</h2>
                        <p className="text-slate-500 mb-8 leading-relaxed">No puedes realizar ventas porque no hay un turno de caja abierto en este momento. Abre la caja primero.</p>
                        <a href="/cash-shifts" className="px-6 py-3 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-xl shadow-lg shadow-rose-500/30 font-medium hover:shadow-xl hover:shadow-rose-500/40 transition-all active:scale-95">
                            Ir a Turnos de Caja
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
            <div className="flex h-full p-4 gap-4">
                
                {/* Left: Products Grid */}
                <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-10">
                        <h2 className="text-xl font-bold text-slate-800">Menú de Productos</h2>
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="Buscar producto..." 
                                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none w-64 shadow-inner"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <svg className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {filteredProducts.map(product => (
                                <button 
                                    key={product.id} 
                                    onClick={() => addToCart(product)}
                                    className="group bg-white border border-slate-200 rounded-2xl p-4 flex flex-col items-center text-center hover:border-indigo-400 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 ease-out transform active:scale-95 relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    
                                    {product.image_path ? (
                                        <div className="w-24 h-24 mb-4 rounded-xl overflow-hidden shadow-sm border border-slate-100 group-hover:scale-110 transition-transform duration-300">
                                            <img src={`/storage/products/${product.image_path.split('/').pop()}`} alt={product.name} className="object-cover w-full h-full" />
                                        </div>
                                    ) : (
                                        <div className="w-24 h-24 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 border border-slate-100">
                                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    )}
                                    <h3 className="font-semibold text-slate-700 truncate w-full z-10">{product.name}</h3>
                                    <p className="text-indigo-600 font-bold mt-1 z-10">${parseFloat(product.price).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                    
                                    {product.stock !== null && (
                                        <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-full mt-2 z-10">
                                            Stock: {product.stock}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Receipt / Cart */}
                <div className="w-[26rem] bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/60 overflow-hidden flex flex-col relative">
                    <div className="p-6 border-b border-slate-100 bg-white/80 backdrop-blur-md">
                        <h2 className="text-xl font-bold text-slate-800">Orden Actual</h2>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2 bg-slate-50/50">
                        {cart.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center space-y-4">
                                <svg className="w-16 h-16 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <p className="text-sm">El carrito está vacío. Toca un producto para agregarlo.</p>
                            </div>
                        ) : (
                            <ul className="space-y-3 p-2">
                                {cart.map(item => (
                                    <li key={item.id} className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex flex-col group animate-[slideIn_0.2s_ease-out]">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex-1 min-w-0 pr-2">
                                                <h4 className="font-medium text-slate-800 truncate">{item.name}</h4>
                                                <p className="text-indigo-600 font-semibold text-sm">${parseFloat(item.price).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center bg-slate-100 rounded-lg overflow-hidden border border-slate-200/60">
                                                    <button onClick={() => updateQuantity(item.id, -1)} className="px-2 py-1 text-slate-600 hover:bg-slate-200 transition-colors active:bg-slate-300">-</button>
                                                    <span className="w-8 text-center text-sm font-semibold text-slate-800">{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.id, 1)} className="px-2 py-1 text-slate-600 hover:bg-slate-200 transition-colors active:bg-slate-300">+</button>
                                                </div>
                                                <button onClick={() => removeFromCart(item.id)} className="text-rose-400 hover:text-rose-600 p-1 bg-rose-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="border-t border-slate-50 pt-2 mt-1">
                                            <input 
                                                type="text" 
                                                placeholder="Comentarios (ej. sin cebolla, extra queso...)"
                                                value={item.description}
                                                onChange={e => updateDescription(item.id, e.target.value)}
                                                className="w-full text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-3 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 placeholder-slate-400"
                                            />
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="border-t border-slate-100 p-6 bg-white shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] z-20">
                        
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-slate-500 font-medium text-sm">Subtotal</span>
                            <span className="text-slate-800 font-semibold">${subTotal.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        
                        <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-4">
                            <span className="text-slate-500 font-medium text-sm">Descuento ($)</span>
                            <input 
                                type="number" 
                                min="0" 
                                step="0.01"
                                value={discountInput}
                                onChange={e => setDiscountInput(e.target.value)}
                                placeholder="0.00"
                                className="w-24 text-right bg-slate-50 border border-slate-200 text-rose-500 font-semibold rounded-lg py-1 px-2 focus:ring-2 focus:ring-rose-500/50 outline-none transition-all shadow-inner"
                            />
                        </div>
                        
                        <div className="flex justify-between items-end mb-6">
                            <span className="text-slate-600 font-bold uppercase tracking-wide text-sm">Total a Pagar</span>
                            <span className="text-4xl font-black text-slate-800 bg-gradient-to-r from-slate-800 to-indigo-900 bg-clip-text text-transparent transform scale-105 origin-right transition-all">
                                ${grandTotal.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                        </div>
                        
                        <button 
                            disabled={cart.length === 0 || processing}
                            onClick={handleCheckout}
                            className={`w-full py-4 px-6 rounded-2xl font-bold text-lg shadow-xl outline-none focus:ring-4 focus:ring-indigo-500/50 transition-all duration-300 transform active:scale-95 ${
                                cart.length === 0 || processing
                                    ? 'bg-slate-200 text-slate-400 shadow-none cursor-not-allowed'
                                    : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600'
                            }`}
                        >
                            {processing ? 'Procesando...' : 'Proceder al Cobro'}
                        </button>
                    </div>
                </div>

            </div>

            {/* Modal de Cobro Múltiple */}
            {showConfirmModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
                    <div className="bg-white rounded-[2rem] shadow-2xl max-w-4xl w-full h-[85vh] overflow-hidden flex transform transition-all border border-slate-100/50">
                        
                        {/* Seccion Izquierda: Detalle de la Orden */}
                        <div className="w-1/2 border-r border-slate-100 flex flex-col bg-slate-50/30">
                            <div className="p-6 border-b border-slate-100 bg-white">
                                <h2 className="text-2xl font-bold text-slate-800">Resumen de Orden</h2>
                                <p className="text-slate-500 text-sm mt-1">Verifica los detalles antes de cobrar.</p>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto p-6">
                                <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                                                <th className="p-3 font-semibold">Producto</th>
                                                <th className="p-3 font-semibold text-center">Cant.</th>
                                                <th className="p-3 font-semibold text-right">Precio</th>
                                                <th className="p-3 font-semibold text-right">Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 text-sm">
                                            {cart.map(item => (
                                                <tr key={item.id} className="hover:bg-slate-50/50">
                                                    <td className="p-3">
                                                        <div className="font-semibold text-slate-800">{item.name}</div>
                                                        {item.description && (
                                                            <div className="text-xs text-indigo-500 mt-0.5 max-w-[160px] truncate" title={item.description}>
                                                                Nota: {item.description}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="p-3 text-center text-slate-600">{item.quantity}</td>
                                                    <td className="p-3 text-right text-slate-600">${parseFloat(item.price).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                                    <td className="p-3 text-right font-medium text-slate-800">${(item.price * item.quantity).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="p-6 border-t border-slate-100 bg-white">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-slate-600">
                                        <span>Subtotal:</span>
                                        <span>${subTotal.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-rose-500 font-medium">
                                        <span>Descuento:</span>
                                        <span>- ${discountVal.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                                        <span className="text-slate-800 font-bold uppercase tracking-wider">Gran Total</span>
                                        <span className="text-3xl font-black text-indigo-600">${grandTotal.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Seccion Derecha: Split Payments */}
                        <div className="w-1/2 flex flex-col bg-white">
                            <div className="p-6 border-b border-slate-100">
                                <h2 className="text-2xl font-bold text-slate-800">Métodos de Pago</h2>
                                <p className="text-slate-500 text-sm mt-1">Puedes dividir el pago en múltiples métodos.</p>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                {paymentsState.map((payment, index) => (
                                    <div key={index} className="flex gap-4 items-center bg-slate-50 p-4 rounded-2xl border border-slate-100 group transition-all shrink-0">
                                        <div className="flex-1">
                                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Método</label>
                                            <select 
                                                value={payment.payment_method_id}
                                                onChange={e => updatePayment(index, 'payment_method_id', e.target.value)}
                                                className="w-full bg-white border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 outline-none shadow-sm"
                                            >
                                                {paymentMethods.map(pm => (
                                                    <option key={pm.id} value={pm.id}>{pm.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Monto Cobrado ($)</label>
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={payment.amount}
                                                onChange={e => updatePayment(index, 'amount', e.target.value)}
                                                placeholder="0.00"
                                                className="w-full bg-white border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 outline-none shadow-sm font-semibold"
                                            />
                                        </div>
                                        {paymentsState.length > 1 && (
                                            <div className="pt-6">
                                                <button 
                                                    onClick={() => removePaymentRow(index)}
                                                    className="p-2 text-rose-400 hover:text-rose-600 bg-white border border-rose-100 hover:border-rose-200 rounded-xl transition-all"
                                                    title="Eliminar"
                                                >
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                <button 
                                    onClick={addPaymentRow}
                                    className="w-full py-3 px-4 border-2 border-dashed border-slate-300 text-slate-500 font-semibold rounded-2xl hover:border-indigo-400 hover:text-indigo-500 hover:bg-indigo-50/50 transition-all flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Agregar otro método de pago
                                </button>
                                
                                {Object.keys(errors).length > 0 && (
                                    <div className="bg-rose-50 text-rose-600 p-4 rounded-xl text-sm border border-rose-100">
                                        <p className="font-semibold mb-1">Error processing the transaction:</p>
                                        <ul className="list-disc pl-5 space-y-1">
                                            {Object.entries(errors).map(([key, err]) => (
                                                <li key={key}>{err}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            <div className="p-6 bg-slate-50 border-t border-slate-200/60 shadow-inner">
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-500 font-medium">Recibido Total:</span>
                                        <span className="text-slate-800 font-semibold text-lg">${totalTendered.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className={`font-semibold ${balanceRemaining > 0 ? 'text-amber-500' : 'text-emerald-500'}`}>
                                            Restante:
                                        </span>
                                        <span className={`font-bold ${balanceRemaining > 0 ? 'text-amber-500' : 'text-emerald-500'}`}>
                                            ${balanceRemaining.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                                        <span className="font-bold text-slate-700">Cambio a Entregar:</span>
                                        <span className="text-2xl font-black text-rose-500">${changeAmount.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button 
                                        onClick={() => setShowConfirmModal(false)}
                                        disabled={processing}
                                        className="py-4 px-6 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-100 hover:text-slate-800 transition-all"
                                    >
                                        Cancelar
                                    </button>
                                    <button 
                                        onClick={confirmCheckout}
                                        disabled={!canConfirm || processing}
                                        className={`flex-1 py-4 px-6 rounded-2xl font-bold shadow-lg transition-all transform hover:-translate-y-0.5 ${
                                            !canConfirm || processing
                                                ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                                                : 'bg-gradient-to-r from-emerald-400 to-emerald-600 text-white shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:from-emerald-500 hover:to-emerald-700'
                                        }`}
                                    >
                                        {processing ? 'Registrando Venta...' : 'Completar Venta y Ticket'}
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            )}
            {/* Toast Notification */}
            {toastMessage.show && (
                <div className={`fixed bottom-8 right-8 z-[100] px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 transform transition-all animate-[slideIn_0.3s_ease-out] border ${
                    toastMessage.type === 'success' 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800 shadow-emerald-500/20' 
                    : 'bg-rose-50 border-rose-200 text-rose-800 shadow-rose-500/20'
                }`}>
                    {toastMessage.type === 'success' ? (
                        <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    ) : (
                        <svg className="w-6 h-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    )}
                    <span className="font-semibold">{toastMessage.text}</span>
                    <button 
                        onClick={() => setToastMessage({ show: false, type: '', text: '' })}
                        className="ml-4 opacity-60 hover:opacity-100 transition-opacity"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            )}
        </Layout>
    );
}
