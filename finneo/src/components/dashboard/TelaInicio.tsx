"use client";

import React, { useState } from 'react';
import Link from 'next/link'; 
import { Plus, TrendingUp, TrendingDown, ArrowUpCircle, ArrowDownCircle, Trash2 } from 'lucide-react';
import { useFinance } from '@/hooks/useFinance';
import { formatCurrency, getBankConfig } from '@/lib/utils';
import TransactionModal from './TransactionModal';

export default function TelaInicio() {
  // Consumindo o Hook Central (Cérebro da aplicação)
  const { accounts, transactions, summary, isLoaded, addTransaction, removeTransaction } = useFinance();
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Previne "flicker" de hidratação
  if (!isLoaded) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400 animate-pulse">Carregando Finneo...</div>;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans relative overflow-hidden pb-32">
      
      {/* --- HEADER --- */}
      <header className="bg-gradient-to-b from-gray-900 to-black text-white pt-8 pb-32 px-6 rounded-b-[2.5rem] shadow-2xl relative z-10">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-xs font-bold border border-gray-700">US</div>
            <div>
              <p className="text-xs text-gray-400">Olá, Visitante</p>
              <h1 className="text-sm font-bold tracking-widest uppercase">FINNEO</h1>
            </div>
          </div>
        </div>
        <div className="text-center">
          <span className="text-gray-400 text-sm font-medium">Saldo Total</span>
          <h2 className="text-4xl font-bold tracking-tight">{formatCurrency(summary.totalBalance)}</h2>
        </div>
      </header>

      {/* --- CARDS FLUTUANTES (RESUMO) --- */}
      <div className="px-6 -mt-20 relative z-20 grid grid-cols-2 gap-4">
        {/* Entradas */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between group hover:border-green-100 transition-colors">
          <div className="flex justify-between items-start mb-2">
            <div className="bg-green-50 p-2 rounded-full text-green-600 group-hover:bg-green-100 transition-colors">
              <TrendingUp size={20} />
            </div>
            <span className="text-[10px] uppercase font-bold text-gray-400">Entradas</span>
          </div>
          <span className="text-xl font-bold text-gray-900">{formatCurrency(summary.totalIncome)}</span>
        </div>

        {/* Saídas */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between group hover:border-red-100 transition-colors">
          <div className="flex justify-between items-start mb-2">
            <div className="bg-red-50 p-2 rounded-full text-red-500 group-hover:bg-red-100 transition-colors">
              <TrendingDown size={20} />
            </div>
            <span className="text-[10px] uppercase font-bold text-gray-400">Saídas</span>
          </div>
          <span className="text-xl font-bold text-gray-900">{formatCurrency(summary.totalExpense)}</span>
        </div>
      </div>

      {/* --- CONTEÚDO PRINCIPAL --- */}
      <main className="px-6 mt-8 space-y-8">
        
        {/* LISTA DE CONTAS (Navegável) */}
        <section>
          <h3 className="text-lg font-bold text-gray-800 mb-4">Minhas Contas</h3>
          <div className="space-y-3">
            {accounts.map(acc => {
              const { icon: Icon } = getBankConfig(acc.bank);
              
              return (
                <Link 
                  key={acc.id} 
                  href={`/extrato/${acc.id}`} 
                  className="block group active:scale-[0.98] transition-transform"
                >
                  <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group-hover:border-black/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${acc.color}`}>
                         <Icon size={18} className="text-white" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm text-gray-900">{acc.name}</span>
                        <span className="text-xs text-gray-400 capitalize">{acc.bank === 'wallet' ? 'Dinheiro' : acc.bank}</span>
                      </div>
                    </div>
                    <span className={`font-bold ${acc.balance < 0 ? 'text-red-500' : 'text-gray-900'}`}>
                      {formatCurrency(acc.balance)}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* HISTÓRICO RECENTE */}
        <section>
          <h3 className="text-lg font-bold text-gray-800 mb-4">Histórico Recente</h3>
          <div className="flex flex-col gap-3">
            {transactions.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200 text-gray-400">
                <p className="text-sm">Nenhuma movimentação registrada.</p>
              </div>
            ) : (
              transactions.map(t => (
                <div key={t.id} className="group bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between animate-in slide-in-from-bottom-2 relative overflow-hidden">
                  
                  {/* Informações */}
                  <div className="flex items-center gap-4 z-10">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${t.type === 'income' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                      {t.type === 'income' ? <ArrowUpCircle size={20} /> : <ArrowDownCircle size={20} />}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-gray-900">{t.description}</p>
                      <p className="text-xs text-gray-400">
                        {accounts.find(a => a.id === t.accountId)?.name} • {t.displayDate}
                      </p>
                    </div>
                  </div>

                  {/* Valor e Ações */}
                  <div className="flex items-center gap-3 z-10">
                    <span className={`font-bold text-sm ${t.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>
                      {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                    </span>
                    
                    {/* Botão de Exclusão (Undo via Sonner) */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        removeTransaction(t.id);
                      }}
                      className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                      title="Excluir movimentação"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      {/* --- FAB (BOTÃO FLUTUANTE) --- */}
      {/* Posicionado em bottom-24 para ficar acima do Menu de Navegação */}
      <div className="fixed bottom-24 left-0 right-0 flex justify-center z-30 pointer-events-none">
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="pointer-events-auto bg-black text-white p-5 rounded-full shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] hover:scale-105 active:scale-95 transition-all group"
          aria-label="Nova movimentação"
        >
          <Plus size={28} strokeWidth={2.5} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </div>

      {/* --- MODAL DE TRANSAÇÃO --- */}
      <TransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={addTransaction}
        accounts={accounts}
      />
    </div>
  );
}