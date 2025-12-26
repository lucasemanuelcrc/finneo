"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { User, Camera, Settings, Bell, Shield, LogOut, Check, ChevronRight } from 'lucide-react';
import { useFinance } from '@/hooks/useFinance';
import { toast } from 'sonner';

export default function TelaPerfil() {
    const { user, updateProfile, isLoaded } = useFinance();

    // Estados de controle
    const [mounted, setMounted] = useState(false);
    const [novoNome, setNovoNome] = useState('');
    const [editando, setEditando] = useState(false);

    // Efeito para sincronizar montagem e dados iniciais
    useEffect(() => {
        const timer = setTimeout(() => {
            setMounted(true);
            if (user?.name) {
                setNovoNome(user.name);
            }
        }, 0);
        return () => clearTimeout(timer);
    }, [user?.name]);

    // Memoriza a função de salvar
    const handleSalvar = useCallback(() => {
        if (!novoNome.trim()) {
            toast.error("O nome não pode estar vazio");
            return;
        }

        updateProfile({ name: novoNome.trim() });
        setEditando(false);
        toast.success("Perfil atualizado!");
    }, [novoNome, updateProfile]);

    // Proteção de renderização para evitar Hydration Mismatch
    // Strict requirement: if (!mounted || !isLoaded) return null;
    if (!mounted || !isLoaded) return null;

    const itensMenu = [
        { icon: Bell, label: 'Notificações', color: 'text-blue-500' },
        { icon: Shield, label: 'Privacidade e Segurança', color: 'text-green-500' },
        { icon: Settings, label: 'Preferências', color: 'text-gray-500' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-40">
            {/* HEADER PREMIUM */}
            <header className="bg-gradient-to-b from-gray-900 to-black text-white pt-12 pb-24 px-6 rounded-b-[2.5rem] shadow-2xl relative z-10 text-center">
                <div className="relative inline-block mb-4">
                    <div className="w-24 h-24 bg-gray-800 rounded-full border-4 border-gray-700 flex items-center justify-center mx-auto overflow-hidden shadow-inner">
                        <User size={48} className="text-gray-400" />
                    </div>
                    <button className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full border-2 border-black hover:scale-110 transition-transform shadow-lg">
                        <Camera size={16} />
                    </button>
                </div>

                <div className="flex flex-col items-center gap-1">
                    {editando ? (
                        <div className="flex items-center gap-2 mt-2 animate-in fade-in zoom-in-95">
                            <input
                                value={novoNome}
                                onChange={(e) => setNovoNome(e.target.value)}
                                className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-medium w-48 text-center"
                                autoFocus
                                onKeyDown={(e) => e.key === 'Enter' && handleSalvar()}
                            />
                            <button
                                onClick={handleSalvar}
                                className="bg-green-600 p-2.5 rounded-xl hover:bg-green-500 transition-colors shadow-lg"
                            >
                                <Check size={20} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 group">
                            <h2 className="text-2xl font-bold tracking-tight">
                                {user?.name || 'Visitante'}
                            </h2>
                            <button
                                onClick={() => setEditando(true)}
                                className="text-gray-500 hover:text-white transition-colors p-1"
                            >
                                <Settings size={16} />
                            </button>
                        </div>
                    )}
                    <p className="text-gray-400 text-xs font-medium uppercase tracking-widest mt-1">Membro Finneo</p>
                </div>
            </header>

            {/* MENU DE OPÇÕES */}
            <main className="px-6 -mt-10 relative z-20 space-y-4">
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
                    {itensMenu.map((item, idx) => (
                        <button
                            key={idx}
                            className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors active:bg-gray-100"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-xl bg-gray-50 ${item.color.replace('text', 'bg').replace('500', '50')}`}>
                                    <item.icon size={20} className={item.color} />
                                </div>
                                <span className="font-bold text-sm text-gray-700">{item.label}</span>
                            </div>
                            <ChevronRight size={18} className="text-gray-300" />
                        </button>
                    ))}
                </div>

                <button className="w-full bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex items-center gap-4 text-red-500 font-bold hover:bg-red-50 transition-all active:scale-[0.98]">
                    <div className="p-2 rounded-xl bg-red-50">
                        <LogOut size={20} />
                    </div>
                    <span className="text-sm">Sair da Conta</span>
                </button>
            </main>
        </div>
    );
}