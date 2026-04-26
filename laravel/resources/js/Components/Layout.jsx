import { Link, usePage, router } from '@inertiajs/react';
import React, { useState } from 'react';

export default function Layout({ children }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    
    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden">
            
            {/* Mobile Header Top-Bar */}
            <div className="lg:hidden fixed top-0 w-full h-16 bg-indigo-950 flex items-center justify-between px-4 z-40 shadow-md">
                <div className="flex items-center">
                    <button 
                        onClick={() => setSidebarOpen(true)}
                        className="text-indigo-200 hover:text-white p-2 focus:outline-none"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <h1 className="ml-3 text-xl font-bold bg-gradient-to-r from-teal-400 to-indigo-400 bg-clip-text text-transparent">
                        Estupendo POS
                    </h1>
                </div>
            </div>

            {/* Admin Switcher Header Layer (Floating Right) */}
            {user?.role === 'admin' && auth?.businesses && (
                <div className="fixed top-0 right-0 h-16 px-4 flex items-center z-50 lg:w-[calc(100%-16rem)] justify-end pointer-events-none">
                    <div className="pointer-events-auto flex items-center bg-white/90 backdrop-blur-md border border-slate-200 rounded-full shadow-lg px-1 py-1">
                        <span className="text-xs font-black uppercase text-slate-400 hidden sm:block pl-3 pr-2 tracking-wider">Sucursal Activa:</span>
                        <select 
                            value={user.business_id}
                            onChange={(e) => router.post('/admin/switch-business', { business_id: e.target.value })}
                            className="bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-bold rounded-full py-1.5 pl-4 pr-8 outline-none focus:ring-0 cursor-pointer shadow-inner"
                        >
                            {auth.businesses.map(b => (
                                <option key={b.id} value={b.id}>{b.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            )}

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-slate-900/60 z-50 lg:hidden backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]" 
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar (Fixed Desktop, OffCanvas Mobile) */}
            <aside 
                className={`fixed lg:static top-0 left-0 w-64 h-full bg-indigo-950 text-indigo-100 flex flex-col shadow-2xl z-[60] transition-transform duration-300 ease-out ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                }`}
            >
                <div className="h-16 flex items-center justify-between px-4 lg:justify-center border-b border-indigo-800/50 shrink-0">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-indigo-400 bg-clip-text text-transparent">
                        Estupendo POS
                    </h1>
                    <button 
                        className="lg:hidden text-indigo-300 hover:text-white"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                    
                    {(user?.role === 'admin' || user?.role === 'cashier') && (
                        <>
                            <NavLink href="/pos" active={window.location.pathname === '/pos'} onClick={() => setSidebarOpen(false)}>
                                <svg className="w-5 h-5 mr-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                Terminal POS
                            </NavLink>
                            <NavLink href="/cash-shifts" active={window.location.pathname.startsWith('/cash-shifts')} onClick={() => setSidebarOpen(false)}>
                                <svg className="w-5 h-5 mr-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                Turnos de Caja
                            </NavLink>
                            <NavLink href="/expenses" active={window.location.pathname.startsWith('/expenses')} onClick={() => setSidebarOpen(false)}>
                                <svg className="w-5 h-5 mr-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                Gastos
                            </NavLink>
                        </>
                    )}

                    {(user?.role === 'admin' || user?.role === 'kitchen' || user?.role === 'cashier') && (
                        <NavLink href="/kitchen" active={window.location.pathname.startsWith('/kitchen')} onClick={() => setSidebarOpen(false)}>
                            <svg className="w-5 h-5 mr-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                            Pantalla de Cocina
                        </NavLink>
                    )}

                    {user?.role === 'admin' && (
                        <>
                            <div className="pt-6 pb-2 px-4 text-xs font-black uppercase text-indigo-400 tracking-wider">Administración General</div>
                            <NavLink href="/products" active={window.location.pathname.startsWith('/products')} onClick={() => setSidebarOpen(false)}>
                                <svg className="w-5 h-5 mr-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                                Productos
                            </NavLink>
                            <NavLink href="/reports" active={window.location.pathname.startsWith('/reports')} onClick={() => setSidebarOpen(false)}>
                                <svg className="w-5 h-5 mr-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                                Reportes
                            </NavLink>
                            <NavLink href="/users" active={window.location.pathname.startsWith('/users')} onClick={() => setSidebarOpen(false)}>
                                <svg className="w-5 h-5 mr-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                Usuarios
                            </NavLink>
                            <NavLink href="/business" active={window.location.pathname.startsWith('/business')} onClick={() => setSidebarOpen(false)}>
                                <svg className="w-5 h-5 mr-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                Sucursales
                            </NavLink>
                        </>
                    )}
                </nav>

                <div className="p-4 border-t border-indigo-800/50 shrink-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-tr from-teal-400 to-indigo-500 flex items-center justify-center text-white font-bold shadow-md uppercase">
                                {user ? user.name.charAt(0) : 'A'}
                            </div>
                            <div className="ml-3 min-w-0">
                                <p className="text-sm font-medium text-white truncate max-w-[120px]">{user?.name}</p>
                                <p className="text-xs text-indigo-400 truncate max-w-[120px]">
                                    Role: <span className="uppercase text-[10px] text-teal-300">{user?.role}</span>
                                </p>
                            </div>
                        </div>
                        
                        <Link 
                            href="/logout" 
                            method="post" 
                            as="button"
                            className="shrink-0 p-2 text-indigo-300 hover:text-white hover:bg-indigo-800/60 rounded-lg transition-colors"
                            title="Log Out"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-full w-full lg:w-auto relative pt-16 lg:pt-0">
                <div id="main-scroll-container" className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50/50 relative">
                    {children}
                </div>
            </main>
        </div>
    );
}

function NavLink({ href, active, children, onClick }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={`flex items-center px-4 py-3 rounded-xl transition-all duration-300 ease-out group ${
                active 
                    ? 'bg-indigo-600 shadow-lg shadow-indigo-600/30 text-white font-medium transform scale-[1.02]' 
                    : 'text-indigo-200 hover:bg-indigo-800/60 hover:text-white hover:pl-6'
            }`}
        >
            {children}
        </Link>
    );
}
