import React, { useState } from 'react';
import Layout from '../../Components/Layout';
import { useForm, router } from '@inertiajs/react';

export default function ProductsIndex({ products }) {
    const [isAdding, setIsAdding] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [viewProduct, setViewProduct] = useState(null);

    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
        price: '',
        cost: '',
        stock: '0',
        image: null,
    });

    const formatThousands = (val) => {
        if (!val && val !== 0) return '';
        const num = val.toString().replace(/[^\d]/g, '');
        return num ? parseInt(num).toLocaleString('es-CO') : '';
    };

    const parseRawNumber = (val) => {
        return val.toString().replace(/[^\d]/g, '');
    };

    const handleCreateNew = () => {
        setEditProduct(null);
        reset();
        setIsAdding(!isAdding);
        document.getElementById('main-scroll-container')?.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleEdit = (product) => {
        setEditProduct(product);
        setData({
            name: product.name,
            price: product.price,
            cost: product.cost || '',
            stock: product.stock,
            photo: null,
        });
        setIsAdding(true);
        document.getElementById('main-scroll-container')?.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleToggleActive = (product) => {
        if (confirm(`¿Estás seguro de que deseas ${product.active ? 'desactivar' : 'reactivar'} este producto?`)) {
            router.delete(`/products/${product.id}`);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        const url = editProduct ? `/products/${editProduct.id}` : '/products';
        
        post(url, {
            preserveScroll: true,
            onSuccess: () => {
                setIsAdding(false);
                setEditProduct(null);
                reset();
            }
        });
    };

    return (
        <Layout>
            <div className="p-8 max-w-6xl mx-auto space-y-6">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Inventario General</h1>
                        <p className="text-slate-500 mt-2 text-lg">Catálogo POS con control multi-media.</p>
                    </div>
                    <button 
                        onClick={handleCreateNew}
                        className="bg-indigo-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:bg-indigo-700 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                        {isAdding ? 'Cancelar Edición / Creación' : '+ Nuevo Producto'}
                    </button>
                </div>

                {isAdding && (
                    <div className="bg-white rounded-3xl p-8 shadow-xl shadow-indigo-100/50 border border-indigo-50 animate-[slideIn_0.3s_ease-out]">
                        <h2 className="text-xl font-bold text-slate-800 mb-6">
                            {editProduct ? `Editando: ${editProduct.name}` : 'Agregar Nuevo Producto'}
                        </h2>
                        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-6" encType="multipart/form-data">
                            <div>
                                <label className="block text-sm font-semibold text-slate-600 mb-2">Nombre del Producto</label>
                                <input 
                                    type="text" 
                                    required
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                />
                                {errors.name && <p className="text-rose-500 text-xs mt-1">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-600 mb-2">Precio de Venta ($)</label>
                                <input 
                                    type="text" 
                                    required
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none"
                                    value={formatThousands(data.price)}
                                    onChange={e => setData('price', parseRawNumber(e.target.value))}
                                />
                                {errors.price && <p className="text-rose-500 text-xs mt-1">{errors.price}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-600 mb-2">Costo Interno ($)</label>
                                <input 
                                    type="text" 
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none"
                                    value={formatThousands(data.cost)}
                                    onChange={e => setData('cost', parseRawNumber(e.target.value))}
                                />
                                {errors.cost && <p className="text-rose-500 text-xs mt-1">{errors.cost}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-600 mb-2">Stock Inicial</label>
                                <input 
                                    type="text" 
                                    required
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none"
                                    value={formatThousands(data.stock)}
                                    onChange={e => setData('stock', parseRawNumber(e.target.value))}
                                />
                                {errors.stock && <p className="text-rose-500 text-xs mt-1">{errors.stock}</p>}
                            </div>
                            
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-slate-600 mb-2">
                                    Subir Fotografía <span className="text-slate-400 font-normal">(Opcional)</span>
                                </label>
                                <div className="border-2 border-dashed border-slate-300 bg-slate-50 rounded-2xl p-6 text-center hover:bg-slate-100 transition-colors">
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        onChange={e => setData('photo', e.target.files[0])}
                                        className="w-full text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                    />
                                </div>
                                {errors.photo && <p className="text-rose-500 text-xs mt-1">{errors.photo}</p>}
                            </div>

                            <div className="md:col-span-2 flex justify-end mt-4">
                                <button 
                                    type="submit" 
                                    disabled={processing}
                                    className="bg-gradient-to-r from-teal-500 to-indigo-500 text-white font-bold rounded-xl px-8 py-3 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                                >
                                    {editProduct ? 'Guardar Cambios' : 'Registrar Producto'}
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
                                    <th className="px-6 py-4 font-semibold rounded-tl-lg">Producto</th>
                                    <th className="px-6 py-4 font-semibold">Precio Venta</th>
                                    <th className="px-6 py-4 font-semibold">Stock</th>
                                    <th className="px-6 py-4 font-semibold">Estado</th>
                                    <th className="px-6 py-4 font-semibold text-right rounded-tr-lg">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.length === 0 ? (
                                    <tr><td colSpan="5" className="text-center p-8 text-slate-500">El catálogo está vacío.</td></tr>
                                ) : products.map((product) => (
                                    <tr key={product.id} className={`border-b border-slate-50 transition-colors ${!product.active ? 'bg-slate-50/50 opacity-75' : 'hover:bg-indigo-50/30'}`}>
                                        <td className="px-6 py-4 font-medium text-slate-800 flex items-center space-x-3">
                                            {product.image_path ? (
                                                <img src={`/storage/${product.image_path}`} alt="product" className="w-10 h-10 rounded-lg object-cover shadow-sm border border-slate-100" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-300 border border-indigo-100">
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                </div>
                                            )}
                                            <span className={!product.active ? 'line-through text-slate-400' : ''}>{product.name}</span>
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-indigo-600">
                                            ${parseFloat(product.price).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${product.stock > 10 ? 'bg-teal-100 text-teal-700' : 'bg-rose-100 text-rose-700'}`}>
                                                {product.stock}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {product.active ? (
                                                <span className="text-teal-500 font-medium flex items-center"><span className="w-2 h-2 rounded-full bg-teal-400 mr-2"></span>Activo</span>
                                            ) : (
                                                <span className="text-slate-400 flex items-center"><span className="w-2 h-2 rounded-full bg-slate-300 mr-2"></span>Inactivo</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2 flex justify-end">
                                            <button 
                                                onClick={() => setViewProduct(product)}
                                                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                title="Detalles"
                                            >
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                            </button>
                                            <button 
                                                onClick={() => handleEdit(product)}
                                                className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                                                title="Editar"
                                            >
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                            </button>
                                            <button 
                                                onClick={() => handleToggleActive(product)}
                                                className={`p-2 rounded-lg transition-colors ${product.active ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50' : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'}`}
                                                title={product.active ? "Desactivar" : "Activar"}
                                            >
                                                {product.active ? (
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                ) : (
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            {/* View Details Modal */}
            {viewProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
                    <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative animate-[fadeIn_0.3s_ease-out]">
                        
                        <div className="relative h-64 bg-slate-100 flex items-center justify-center group">
                            {viewProduct.image_path ? (
                                <img src={`/storage/${viewProduct.image_path}`} alt="Product" className="object-cover w-full h-full" />
                            ) : (
                                <svg className="w-20 h-20 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            )}
                            <button 
                                onClick={() => setViewProduct(null)}
                                className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 rounded-full text-white transition-all shadow-sm"
                            >
                                <svg className="w-5 h-5 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-2xl font-black text-slate-800">{viewProduct.name}</h3>
                                    <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold ${viewProduct.active ? 'bg-teal-100 text-teal-700' : 'bg-rose-100 text-rose-700'}`}>
                                        {viewProduct.active ? 'Producto Activo' : 'Producto Desactivado'}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-black text-indigo-600">
                                        ${parseFloat(viewProduct.price).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 mt-8 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Costo Interno</p>
                                    <p className="text-sm font-semibold text-slate-700">
                                        {viewProduct.cost ? `$${parseFloat(viewProduct.cost).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'No asignado'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Unidades en Stock</p>
                                    <p className="text-sm font-semibold text-slate-700">{viewProduct.stock} uds.</p>
                                </div>
                            </div>

                            <button 
                                onClick={() => setViewProduct(null)}
                                className="w-full bg-slate-900 text-white font-bold py-3 px-4 rounded-xl mt-8 hover:bg-slate-800 transition-colors"
                            >
                                Cerrar Detalles
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}
