"use client";

import React, { useState, useEffect } from 'react';
import { X, ArrowUpCircle, ArrowDownCircle, TrendingUp } from 'lucide-react';
import { Account, TransactionType } from '@/types';
import { formatCurrency, getBankConfig } from '@/lib/utils';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (amount: number, description: string, type: TransactionType, accountId: string) => void;
  accounts: Account[];
  defaultAccountId?: string;
}

export default function TransactionModal({ isOpen, onClose, onSave, accounts, defaultAccountId }: TransactionModalProps) {
  const [amountInput, setAmountInput] = useState('');
  const [description, setDescription] = useState('');
  const [selectedType, setSelectedType] = useState<TransactionType>('expense');
  const [selectedAccount, setSelectedAccount] = useState<string>('');

  // CORREÇÃO: Lógica ajustada para não depender de 'selectedAccount'
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isOpen) {
        if (defaultAccountId) {
          // Se veio do Extrato, força a conta daquela tela
          setSelectedAccount(defaultAccountId);
        } else {
          // Se veio da Home (sem padrão), limpa a seleção para garantir um estado novo
          // Ao definir '' direto, não precisamos ler o estado anterior, resolvendo o erro do linter
          setSelectedAccount('');
        }
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [isOpen, defaultAccountId]); // Agora as dependências estão completas e corretas

  if (!isOpen) return null;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    const numericValue = parseFloat(value) / 100;
    if (isNaN(numericValue)) {
      setAmountInput("");
      return;
    }
    setAmountInput(numericValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 }));
  };

  const handleSave = () => {
    const rawAmount = parseFloat(amountInput.replace(/\./g, '').replace(',', '.'));
    if (!description || rawAmount <= 0 || !selectedAccount) return;
    
    onSave(rawAmount, description, selectedType, selectedAccount);
    
    // Limpeza do formulário após salvar
    setAmountInput('');
    setDescription('');
    setSelectedType('expense');
    // O selectedAccount será resetado pelo useEffect na próxima abertura
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="bg-white w-full sm:w-[450px] sm:rounded-[2.5rem] rounded-t-[2.5rem] p-6 shadow-2xl animate-in slide-in-from-bottom duration-300 relative z-10 flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900">Nova Movimentação</h3>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 hover:text-black transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Toggle Tipo */}
        <div className="bg-gray-100 p-1.5 rounded-2xl flex relative">
          <button onClick={() => setSelectedType('income')} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 ${selectedType === 'income' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
            <ArrowUpCircle size={18} /> Receita
          </button>
          <button onClick={() => setSelectedType('expense')} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 ${selectedType === 'expense' ? 'bg-white text-red-500 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
            <ArrowDownCircle size={18} /> Despesa
          </button>
        </div>

        {/* Valor */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Valor</label>
          <div className="relative">
            <span className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 text-2xl font-medium">R$</span>
            <input type="text" inputMode="decimal" value={amountInput} onChange={handleAmountChange} placeholder="0,00" className={`w-full bg-transparent text-4xl font-bold py-2 pl-10 focus:outline-none placeholder:text-gray-200 border-b border-gray-100 focus:border-gray-900 transition-colors ${selectedType === 'income' ? 'text-green-600' : 'text-red-500'}`} />
          </div>
        </div>

        {/* Descrição */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Descrição</label>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ex: Mercado, Salário..." className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-black/5 transition-all" />
        </div>

        {/* Seleção de Contas */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Conta de Origem</label>
          <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
            {accounts.map((acc) => {
              const { icon: Icon } = getBankConfig(acc.bank);
              return (
                <button key={acc.id} onClick={() => setSelectedAccount(acc.id)} className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-200 group ${selectedAccount === acc.id ? 'bg-black border-black text-white shadow-lg' : 'bg-white border-gray-100 text-gray-600 hover:border-gray-300'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${acc.color} ${selectedAccount === acc.id ? 'ring-2 ring-white' : ''}`}>
                       <Icon size={16} className="text-white" />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className={`text-sm font-bold ${selectedAccount === acc.id ? 'text-white' : 'text-gray-900'}`}>{acc.name}</span>
                      <span className="text-[10px] opacity-80">Saldo: {formatCurrency(acc.balance)}</span>
                    </div>
                  </div>
                  {selectedAccount === acc.id && <div className="bg-white/20 p-1 rounded-full"><TrendingUp size={14} className="text-white" /></div>}
                </button>
              );
            })}
          </div>
        </div>

        <button onClick={handleSave} disabled={!amountInput || !description || !selectedAccount} className="w-full bg-black text-white font-bold text-lg py-4 rounded-2xl shadow-xl shadow-gray-200 mt-2 hover:bg-gray-800 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed">
          Confirmar
        </button>
      </div>
    </div>
  );
}