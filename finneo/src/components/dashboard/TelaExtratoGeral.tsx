"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { useFinance } from '@/hooks/useFinance';
import { formatCurrency, getBankConfig } from '@/lib/utils';

export default function TelaExtratoGeral() {
  const { accounts, summary, isLoaded } = useFinance();

  if (!isLoaded) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400">Carregando...</div>;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-32 pt-8 px-6">
      
      <h1 className="text-2xl font-bold mb-2">Carteira</h1>
      <p className="text-gray-400 text-sm mb-8">Visão geral do seu patrimônio.</p>

      {/* Resumo Global (Card Preto) */}
      <div className="bg-gradient-to-br from-gray-900 to-black text-white p-6 rounded-[2rem] mb-8 shadow-xl">
        <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-gray-800 rounded-full">
                <TrendingUp size={16} className="text-green-400"/>
            </div>
            <span className="text-gray-400 text-xs uppercase tracking-widest font-bold">Saldo Consolidado</span>
        </div>
        <h2 className="text-4xl font-bold mt-2">{formatCurrency(summary.totalBalance)}</h2>
      </div>

      <h3 className="text-lg font-bold text-gray-800 mb-4">Contas Disponíveis</h3>

      {/* Lista de Contas para Navegar */}
      <div className="space-y-4">
        {accounts.map(acc => {
          const { icon: Icon } = getBankConfig(acc.bank);
          return (
            <Link 
              key={acc.id} 
              href={`/extrato/${acc.id}`} // Vai para o detalhe
              className="group bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between active:scale-[0.98] transition-all hover:border-black/10"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${acc.color}`}>
                   <Icon size={20} className="text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{acc.name}</p>
                  <p className="text-xs text-gray-400">Saldo atual</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <span className={`font-bold text-sm ${acc.balance < 0 ? 'text-red-500' : 'text-gray-900'}`}>
                    {formatCurrency(acc.balance)}
                </span>
                <ArrowRight size={18} className="text-gray-300 group-hover:text-black transition-colors" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}