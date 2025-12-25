"use client";

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, ArrowUpCircle, ArrowDownCircle, Trash2, Calendar, Clock } from 'lucide-react';
import { useFinance } from '@/hooks/useFinance';
import { formatCurrency, getBankConfig } from '@/lib/utils';
import { Transaction } from '@/types';
import TransactionModal from './TransactionModal';

interface TelaExtratoProps {
  accountId: string;
}

export default function TelaExtrato({ accountId }: TelaExtratoProps) {
  const router = useRouter();
  const { accounts, transactions, isLoaded, addTransaction, removeTransaction } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const account = accounts.find(a => a.id === accountId);

  // --- LÓGICA DE AGRUPAMENTO POR DATA ---
  const groupedTransactions = useMemo(() => {
    // Filtra as transações desta conta
    const filtered = transactions.filter(t => t.accountId === accountId);
    
    // Agrupa por string de data (YYYY-MM-DD)
    const groups: { [key: string]: Transaction[] } = {};
    
    filtered.forEach(t => {
      const dateKey = new Date(t.date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(t);
    });

    return groups;
  }, [transactions, accountId]);

  if (!isLoaded) return <div className="min-h-screen bg-gray-50" />;
  if (!account) return null;

  const { icon: BankIcon } = getBankConfig(account.bank);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans relative pb-32">
      
      {/* HEADER */}
      <header className="bg-gradient-to-b from-gray-900 to-black text-white pt-8 pb-20 px-6 rounded-b-[2.5rem] shadow-2xl relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => router.back()} className="p-2 bg-gray-800/50 rounded-full hover:bg-gray-700 transition-colors backdrop-blur-md">
            <ArrowLeft size={20} className="text-white" />
          </button>
          <span className="text-sm font-medium text-gray-300">Extrato por Dia</span>
        </div>

        <div className="flex flex-col items-center">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg ring-4 ring-black/20 ${account.color}`}>
             <BankIcon size={32} className="text-white" />
          </div>
          <h1 className="text-lg font-medium text-gray-300 mb-1">{account.name}</h1>
          <h2 className="text-4xl font-bold tracking-tight">{formatCurrency(account.balance)}</h2>
        </div>
      </header>

      {/* LISTA AGRUPADA */}
      <main className="px-6 -mt-10 relative z-20 space-y-8">
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 min-h-[500px] overflow-hidden">
          
          {Object.keys(groupedTransactions).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-gray-400 gap-3">
              <Clock size={40} className="opacity-20" />
              <p className="text-sm font-medium">Nenhum registro encontrado.</p>
            </div>
          ) : (
            // Mapeia cada grupo de data
            Object.entries(groupedTransactions).map(([date, items]) => (
              <div key={date} className="pt-6">
                {/* Header do Dia */}
                <div className="px-6 mb-2 flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                    <Calendar size={12} />
                    {date}
                  </span>
                  <span className="text-[10px] font-bold text-gray-300">
                    {items.length} {items.length === 1 ? 'item' : 'itens'}
                  </span>
                </div>

                {/* Itens do Dia */}
                <div className="divide-y divide-gray-50 px-2">
                  {items.map(t => (
                    <div key={t.id} className="group p-4 rounded-2xl hover:bg-gray-50 transition-colors flex items-center justify-between relative overflow-hidden">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${t.type === 'income' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                          {t.type === 'income' ? <ArrowUpCircle size={20} /> : <ArrowDownCircle size={20} />}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-gray-900">{t.description}</p>
                          <p className="text-[10px] text-gray-400 uppercase font-medium tracking-tight">
                            {new Date(t.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className={`font-bold text-sm ${t.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>
                          {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                        </span>
                        <button 
                          onClick={() => removeTransaction(t.id)}
                          className="p-2 text-gray-200 hover:text-red-500 hover:bg-red-50 rounded-full transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Divisor Visual entre blocos de dias */}
                <div className="h-[1px] bg-gray-50 mt-4 mx-6" />
              </div>
            ))
          )}
        </div>
      </main>

      {/* FAB */}
      <div className="fixed bottom-24 left-0 right-0 flex justify-center z-30 pointer-events-none">
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="pointer-events-auto bg-black text-white px-8 py-4 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
        >
          <Plus size={20} strokeWidth={3} />
          <span className="font-bold text-sm">Adicionar</span>
        </button>
      </div>

      <TransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={addTransaction}
        accounts={accounts}
        defaultAccountId={accountId} 
      />
    </div>
  );
}