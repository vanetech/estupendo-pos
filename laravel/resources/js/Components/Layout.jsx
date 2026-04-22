import { Link, usePage } from '@inertiajs/react';
import React from 'react';

export default function Layout({ children }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    
    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-800">
            {/* Sidebar */}
            <aside className="w-64 bg-indigo-950 text-indigo-100 flex flex-col shadow-2xl z-20">
                <div className="h-16 flex items-center justify-center border-b border-indigo-800/50">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-indigo-400 bg-clip-text text-transparent">
                        Estupendo POS
                    </h1>
                </div>

                <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
                    <NavLink href="/pos" active={window.location.pathname === '/pos'}>
                        <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Terminal POS
                    </NavLink>
                    <NavLink href="/cash-shifts" active={window.location.pathname.startsWith('/cash-shifts')}>
                        <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Turnos de Caja
                    </NavLink>
                    <NavLink href="/products" active={window.location.pathname.startsWith('/products')}>
                        <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        Productos
                    </NavLink>
                    <NavLink href="/expenses" active={window.location.pathname.startsWith('/expenses')}>
                        <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Gastos
                    </NavLink>
                    <NavLink href="/reports" active={window.location.pathname.startsWith('/reports')}>
                        <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Reportes
                    </NavLink>
                </nav>

                <div className="p-4 border-t border-indigo-800/50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-400 to-indigo-500 flex items-center justify-center text-white font-bold shadow-md uppercase">
                                {user ? user.name.charAt(0) : 'A'}
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-white truncate max-w-[120px]">{user?.name}</p>
                                <p className="text-xs text-indigo-400 truncate max-w-[120px]">{user?.business?.name || 'Local 1'}</p>
                            </div>
                        </div>
                        
                        <Link 
                            href="/logout" 
                            method="post" 
                            as="button"
                            className="p-2 text-indigo-300 hover:text-white hover:bg-indigo-800/60 rounded-lg transition-colors"
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
            <main className="flex-1 flex flex-col overflow-hidden">
                <div id="main-scroll-container" className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50/50">
                    {children}
                </div>
            </main>
        </div>
    );
}

function NavLink({ href, active, children }) {
    return (
        <Link
            href={href}
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
