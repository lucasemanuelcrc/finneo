"use client";

import { useState, useEffect, useMemo } from 'react';
import { Account, Transaction, TransactionType, FinanceSummary } from '@/types';
import { toast } from 'sonner';

// Adicionando a interface interna para Metas
export interface Goal {
  id: string;
  nome: string;
  valor: number;
  prazo: number;
  unidade: 'meses' | 'anos';
  icone: string;
  gastoAtual: number;
}

const INITIAL_ACCOUNTS: Account[] = [
  { id: '1', name: 'Nubank', bank: 'nubank', balance: 0, color: 'bg-purple-600' },
  { id: '2', name: 'Banco do Brasil', bank: 'bb', balance: 0, color: 'bg-yellow-400' },
  { id: '3', name: 'Bradesco', bank: 'bradesco', balance: 0, color: 'bg-red-600' },
  { id: '4', name: 'Carteira', bank: 'wallet', balance: 0, color: 'bg-gray-800' },
];

export function useFinance() {
  const [accounts, setAccounts] = useState<Account[]>(INITIAL_ACCOUNTS);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // --- MEMBER: USUÁRIO ---
  const [user, setUser] = useState<{ name: string }>({ name: 'Visitante' });

  const updateProfile = (newData: { name: string }) => {
    setUser(newData);
    localStorage.setItem('finneo_user', JSON.stringify(newData));
  };

  // --- CARREGAR DADOS ---
  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined') {
        const savedAccounts = localStorage.getItem('finneo_accounts');
        const savedTransactions = localStorage.getItem('finneo_transactions');
        const savedGoals = localStorage.getItem('finneo_goals');
        const savedUser = localStorage.getItem('finneo_user');

        if (savedAccounts) setAccounts(JSON.parse(savedAccounts));
        if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
        if (savedGoals) setGoals(JSON.parse(savedGoals));
        if (savedUser) setUser(JSON.parse(savedUser));

        setIsLoaded(true);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // --- SALVAR DADOS ---
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('finneo_accounts', JSON.stringify(accounts));
      localStorage.setItem('finneo_transactions', JSON.stringify(transactions));
      localStorage.setItem('finneo_goals', JSON.stringify(goals));
      // User savings is handled directly in updateProfile or initialized here if needed, 
      // but updateProfile handles the explicit save. 
      // We can also add it here for redundancy if state changes elsewhere, 
      // but strict instructions asked for updateProfile to handle it. 
      // Consistency: Let's rely on updateProfile for user updates as requested, 
      // but if we wanted auto-save on state change we'd add it here. 
      // The instructions said "updateProfile... sets state and localstorage".
    }
  }, [accounts, transactions, goals, isLoaded]);

  // --- CÁLCULOS ---
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

  // --- ACTIONS: TRANSAÇÕES ---

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

    toast.success('Movimentação registrada!');
  };

  const removeTransaction = (transactionId: number) => {
    const transactionToRemove = transactions.find(t => t.id === transactionId);
    if (!transactionToRemove) return;

    const undoRemoval = () => {
      setTransactions(prev => [transactionToRemove, ...prev].sort((a, b) => b.id - a.id));
      setAccounts(prev => prev.map(acc => {
        if (acc.id === transactionToRemove.accountId) {
          const newBalance = transactionToRemove.type === 'income'
            ? acc.balance + transactionToRemove.amount
            : acc.balance - transactionToRemove.amount;
          return { ...acc, balance: newBalance };
        }
        return acc;
      }));
      toast.info('Ação desfeita.');
    };

    setTransactions(prev => prev.filter(t => t.id !== transactionId));
    setAccounts(prev => prev.map(acc => {
      if (acc.id === transactionToRemove.accountId) {
        const reversedBalance = transactionToRemove.type === 'income'
          ? acc.balance - transactionToRemove.amount
          : acc.balance + transactionToRemove.amount;
        return { ...acc, balance: reversedBalance };
      }
      return acc;
    }));

    toast('Transação removida', {
      description: transactionToRemove.description,
      action: {
        label: 'Desfazer',
        onClick: () => undoRemoval(),
      },
      duration: 4000,
    });
  };

  // --- ACTIONS: METAS ---

  const addGoal = (newGoal: Omit<Goal, 'id' | 'gastoAtual'>) => {
    const goal: Goal = {
      ...newGoal,
      id: Date.now().toString(),
      gastoAtual: 0
    };
    setGoals(prev => [...prev, goal]);
    toast.success('Nova meta estabelecida!');
  };

  const removeGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
    toast.success('Meta removida.');
  };

  // --- NOVA FUNÇÃO: ADICIONAR VALOR À META ---
  const updateGoalAmount = (id: string, amount: number) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id === id) {
        return { ...goal, gastoAtual: goal.gastoAtual + amount };
      }
      return goal;
    }));
    toast.success('Valor adicionado à meta!');
  };

  // --- SISTEMA ---

  const clearData = () => {
    toast('Tem certeza que deseja apagar tudo?', {
      action: {
        label: 'Sim, apagar',
        onClick: () => {
          setAccounts(INITIAL_ACCOUNTS);
          setTransactions([]);
          setGoals([]);
          setUser({ name: 'Visitante' });
          localStorage.clear();
          toast.success('App resetado com sucesso.');
        }
      }
    });
  };

  return {
    accounts,
    transactions,
    goals,
    summary,
    isLoaded,
    addTransaction,
    removeTransaction,
    addGoal,
    removeGoal,
    updateGoalAmount,
    clearData,
    user,
    updateProfile
  };
}