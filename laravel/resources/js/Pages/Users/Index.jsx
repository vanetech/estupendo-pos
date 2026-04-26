import React, { useState } from 'react';
import Layout from '../../Components/Layout';
import { useForm, router } from '@inertiajs/react';

export default function UsersIndex({ users, businesses }) {
    const [isAdding, setIsAdding] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    const { data, setData, post, put, processing, reset, errors } = useForm({
        name: '',
        email: '',
        password: '',
        role: 'cashier',
        business_id: businesses.length > 0 ? businesses[0].id : '',
        active: true,
    });

    const openNew = () => {
        setEditingUser(null);
        reset();
        setData('business_id', businesses.length > 0 ? businesses[0].id : '');
        setIsAdding(true);
    };

    const openEdit = (u) => {
        setEditingUser(u);
        setData({
            name: u.name,
            email: u.email, // Not editable in simple flow but passed
            password: '', 
            role: u.role,
            business_id: u.business_id,
            active: u.active
        });
        setIsAdding(true);
    };

    const submit = (e) => {
        e.preventDefault();
        if (editingUser) {
            put(`/users/${editingUser.id}`, {
                onSuccess: () => {
                    setIsAdding(false);
                    reset();
                }
            });
        } else {
            post('/users', {
                onSuccess: () => {
                    setIsAdding(false);
                    reset();
                }
            });
        }
    };

    return (
        <Layout>
            <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Gestión de Usuarios</h1>
                        <p className="text-slate-500 mt-2 text-lg">Configura empleados, cajeros y personal de cocina.</p>
                    </div>
                    <button 
                        onClick={openNew}
                        className="bg-indigo-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:bg-indigo-700 transition-all"
                    >
                        + Nuevo Usuario
                    </button>
                </div>

                {isAdding && (
                    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-100 animate-[fadeIn_0.2s_ease-out]">
                        <h2 className="text-xl font-bold text-slate-800 mb-6">{editingUser ? 'Editar Usuario' : 'Crear Usuario'}</h2>
                        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            <div>
                                <label className="block text-sm font-semibold text-slate-600 mb-2">Nombre Completo</label>
                                <input 
                                    type="text" 
                                    required
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                />
                                {errors.name && <p className="text-rose-500 mt-1">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-600 mb-2">Correo (Acceso)</label>
                                <input 
                                    type="email" 
                                    required
                                    disabled={!!editingUser}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none disabled:opacity-50"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                />
                                {errors.email && <p className="text-rose-500 mt-1">{errors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-600 mb-2">Rol de Acceso</label>
                                <select 
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none"
                                    value={data.role}
                                    onChange={e => setData('role', e.target.value)}
                                >
                                    <option value="admin">Administrador (Total)</option>
                                    <option value="cashier">Cajero / Mesero</option>
                                    <option value="kitchen">Personal de Cocina</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-600 mb-2">Asignar a Sucursal</label>
                                <select 
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none"
                                    value={data.business_id}
                                    onChange={e => setData('business_id', e.target.value)}
                                >
                                    {businesses.map(b => (
                                        <option key={b.id} value={b.id}>{b.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-600 mb-2">Contraseña {editingUser && '(Déjalo vacío para no cambiar)'}</label>
                                <input 
                                    type="password" 
                                    required={!editingUser}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none"
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                />
                            </div>

                            {editingUser && (
                                <div className="flex items-center mt-6">
                                    <input 
                                        type="checkbox" 
                                        id="activeStatus"
                                        checked={data.active}
                                        onChange={e => setData('active', e.target.checked)}
                                        className="w-5 h-5 text-indigo-600 mr-3"
                                    />
                                    <label htmlFor="activeStatus" className="font-semibold text-slate-700">Usuario Activo</label>
                                </div>
                            )}

                            <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                                <button 
                                    type="button" 
                                    onClick={() => setIsAdding(false)}
                                    className="px-6 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={processing}
                                    className="bg-indigo-600 text-white font-bold rounded-xl px-8 py-3 hover:bg-indigo-700"
                                >
                                    {editingUser ? 'Guardar Cambios' : 'Crear Usuario'}
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
                                    <th className="px-6 py-4 font-semibold">Usuario</th>
                                    <th className="px-6 py-4 font-semibold">Correo</th>
                                    <th className="px-6 py-4 font-semibold">Rol</th>
                                    <th className="px-6 py-4 font-semibold">Sucursal Base</th>
                                    <th className="px-6 py-4 font-semibold text-right">Opciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {users.map(u => (
                                    <tr key={u.id} className={u.active ? 'hover:bg-slate-50 text-slate-700' : 'bg-slate-50 text-slate-400 opacity-70'}>
                                        <td className="px-6 py-4 font-bold">{u.name}</td>
                                        <td className="px-6 py-4 font-medium">{u.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase
                                                ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : ''}
                                                ${u.role === 'cashier' ? 'bg-emerald-100 text-emerald-700' : ''}
                                                ${u.role === 'kitchen' ? 'bg-orange-100 text-orange-700' : ''}
                                            `}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">{u.business?.name}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => openEdit(u)}
                                                className="text-indigo-500 font-bold hover:text-indigo-700 bg-indigo-50 px-3 py-2 rounded-lg"
                                            >
                                                Editar
                                            </button>
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
