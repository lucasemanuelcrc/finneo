"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { useFinance } from '@/hooks/useFinance';
import { formatCurrency, getBankConfig } from '@/lib/utils';

export default function TelaExtratoGeral() {
  const { accounts, summary, isLoaded } = useFinance();
  const [mounted, setMounted] = useState(false);

  // CORREÇÃO: Usando setTimeout para evitar o erro "Calling setState synchronously within an effect"
  // Isso garante que o componente termine a primeira renderização antes de marcar como montado
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Proteção para evitar erros de hidratação e garantir que os dados do localStorage foram lidos
  if (!mounted || !isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-40 pt-8 px-6">
      <header className="mb-8">
        <h1 className="text-2xl font-black tracking-tight">Extratos</h1>
        <p className="text-gray-400 text-sm font-medium">Histórico consolidado por conta</p>
      </header>

      {/* Card de Patrimônio Total */}
      <div className="bg-black text-white p-7 rounded-[2.5rem] mb-10 shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <span className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">Saldo total disponível</span>
          <h2 className="text-4xl font-bold mt-1 tracking-tighter">
            {formatCurrency(summary.totalBalance)}
          </h2>
        </div>
        <div className="absolute -right-4 -bottom-4 opacity-10">
           <TrendingUp size={120} />
        </div>
      </div>

      <div className="space-y-4">
        {accounts.map(acc => {
          const { icon: Icon } = getBankConfig(acc.bank);
          return (
            <Link 
              key={acc.id} 
              href={`/extrato/${acc.id}`}
              className="group flex items-center justify-between bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm active:scale-95 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${acc.color} shadow-lg shadow-gray-200`}>
                   <Icon size={20} className="text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">{acc.name}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Ver transações dia a dia</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <span className={`font-black text-sm ${acc.balance < 0 ? 'text-red-500' : 'text-gray-900'}`}>
                    {formatCurrency(acc.balance)}
                </span>
                <div className="bg-gray-50 p-2 rounded-full text-gray-300 group-hover:text-black group-hover:bg-gray-100 transition-all">
                  <ArrowRight size={16} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}