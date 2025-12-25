"use client";

import { useState, useEffect, useMemo } from 'react';
// CORREÇÃO 1: Importando o nome correto 'FinanceSummary' (singular)
import { Account, Transaction, TransactionType, FinanceSummary } from '@/types';

const INITIAL_ACCOUNTS: Account[] = [
  { id: '1', name: 'Nubank', bank: 'nubank', balance: 0, color: 'bg-purple-600' },
  { id: '2', name: 'Banco do Brasil', bank: 'bb', balance: 0, color: 'bg-yellow-400' },
  { id: '3', name: 'Bradesco', bank: 'bradesco', balance: 0, color: 'bg-red-600' },
  { id: '4', name: 'Carteira', bank: 'wallet', balance: 0, color: 'bg-gray-800' },
];

export function useFinance() {
  const [accounts, setAccounts] = useState<Account[]>(INITIAL_ACCOUNTS);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Carregar dados (apenas no cliente)
  useEffect(() => {
    // CORREÇÃO 2: setTimeout resolve o erro de "cascading renders"
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined') {
        const savedAccounts = localStorage.getItem('finneo_accounts');
        const savedTransactions = localStorage.getItem('finneo_transactions');

        if (savedAccounts) {
          setAccounts(JSON.parse(savedAccounts));
        }
        if (savedTransactions) {
          setTransactions(JSON.parse(savedTransactions));
        }
        
        setIsLoaded(true);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Salvar dados (apenas após carregamento inicial)
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('finneo_accounts', JSON.stringify(accounts));
      localStorage.setItem('finneo_transactions', JSON.stringify(transactions));
    }
  }, [accounts, transactions, isLoaded]);

  // Cálculos Memoizados
  const summary: FinanceSummary = useMemo(() => {
    const totalBalance = accounts.reduce((acc, accItem) => acc + accItem.balance, 0);
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);
    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);

    return { totalBalance, totalIncome, totalExpense };
  }, [accounts, transactions]);

  // Actions
  const addTransaction = (amount: number, description: string, type: TransactionType, accountId: string) => {
    const newTransaction: Transaction = {
      id: Date.now(),
      description,
      amount,
      type,
      accountId,
      date: new Date().toISOString(),
      displayDate: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
    };

    setTransactions(prev => [newTransaction, ...prev]);

    setAccounts(prev => prev.map(acc => {
      if (acc.id === accountId) {
        const newBalance = type === 'income' 
          ? acc.balance + amount 
          : acc.balance - amount;
        return { ...acc, balance: newBalance };
      }
      return acc;
    }));
  };

  const clearData = () => {
    if (window.confirm("Isso apagará todos os seus dados locais. Continuar?")) {
      setAccounts(INITIAL_ACCOUNTS);
      setTransactions([]);
      localStorage.clear();
    }
  };

  return {
    accounts,
    transactions,
    summary,
    isLoaded,
    addTransaction,
    clearData
  };
}