"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, ArrowUpCircle, ArrowDownCircle, Trash2 } from 'lucide-react';
import { useFinance } from '@/hooks/useFinance';
import { formatCurrency, getBankConfig } from '@/lib/utils';
import TransactionModal from './TransactionModal';

interface TelaExtratoProps {
  accountId: string;
}

export default function TelaExtrato({ accountId }: TelaExtratoProps) {
  const router = useRouter();
  const { accounts, transactions, isLoaded, addTransaction, removeTransaction } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Busca a conta e filtra transações
  const account = accounts.find(a => a.id === accountId);
  const accountTransactions = transactions.filter(t => t.accountId === accountId);

  // Evita flash de hidratação
  if (!isLoaded) return <div className="min-h-screen bg-gray-50" />;

  // Se a conta não existir (url inválida)
  if (!account) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold mb-2">Conta não encontrada</h2>
        <button onClick={() => router.back()} className="text-blue-600 hover:underline">Voltar</button>
      </div>
    );
  }

  const { icon: BankIcon } = getBankConfig(account.bank);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans relative pb-32">
      
      {/* --- HEADER ESPECÍFICO --- */}
      <header className={`bg-gradient-to-b from-gray-900 to-black text-white pt-8 pb-20 px-6 rounded-b-[2.5rem] shadow-2xl relative z-10`}>
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => router.back()} 
            className="p-2 bg-gray-800/50 rounded-full hover:bg-gray-700 transition-colors backdrop-blur-md"
          >
            <ArrowLeft size={20} className="text-white" />
          </button>
          <span className="text-sm font-medium text-gray-300">Detalhes da Conta</span>
        </div>

        <div className="flex flex-col items-center">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-lg ${account.color}`}>
             <BankIcon size={28} className="text-white" />
          </div>
          <h1 className="text-lg font-medium text-gray-300 mb-1">{account.name}</h1>
          <h2 className="text-4xl font-bold tracking-tight">{formatCurrency(account.balance)}</h2>
        </div>
      </header>

      {/* --- LISTA DE MOVIMENTAÇÕES --- */}
      <main className="px-6 -mt-10 relative z-20 space-y-6">
        
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 min-h-[400px] p-2">
            <div className="p-4 pb-2 border-b border-gray-50 mb-2">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Extrato Completo</h3>
            </div>

            <div className="flex flex-col gap-2">
                {accountTransactions.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        <p className="text-sm">Nenhuma movimentação nesta conta.</p>
                    </div>
                ) : (
                    accountTransactions.map(t => (
                        <div key={t.id} className="group p-4 rounded-2xl hover:bg-gray-50 transition-colors flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${t.type === 'income' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                                {t.type === 'income' ? <ArrowUpCircle size={20} /> : <ArrowDownCircle size={20} />}
                            </div>
                            <div>
                                <p className="font-bold text-sm text-gray-900">{t.description}</p>
                                <p className="text-xs text-gray-400 capitalize">{t.displayDate}</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <span className={`font-bold text-sm ${t.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>
                                {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                            </span>
                            <button 
                                onClick={() => removeTransaction(t.id)}
                                className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-100 rounded-full transition-all opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                        </div>
                    ))
                )}
            </div>
        </div>
      </main>

      {/* --- FAB (Contextual) --- */}
      <div className="fixed bottom-8 left-0 right-0 flex justify-center z-30 pointer-events-none">
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="pointer-events-auto bg-black text-white p-5 rounded-full shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] hover:scale-105 active:scale-95 transition-all group flex items-center gap-2 px-6"
        >
          <Plus size={24} strokeWidth={2.5} />
          <span className="font-bold text-sm">Adicionar</span>
        </button>
      </div>

      {/* --- MODAL (Com Default Account) --- */}
      <TransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={addTransaction}
        accounts={accounts}
        defaultAccountId={accountId} // Aqui a mágica acontece
      />
    </div>
  );
}