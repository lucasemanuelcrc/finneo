"use client";

import { useState, useEffect, useMemo } from 'react';
import { Account, Transaction, TransactionType, FinanceSummary } from '@/types';
import { toast } from 'sonner';

export interface GoalTransaction {
  id: string;
  date: string;
  amount: number;
}

export interface Goal {
  id: string;
  name: string;        // Propriedade sincronizada (Single Source of Truth)
  valorTotal: number;  // Propriedade sincronizada (Single Source of Truth)
  prazo: number;
  unidade: 'meses' | 'anos';
  icone: string;
  gastoAtual: number;
  history: GoalTransaction[];
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
  const [user, setUser] = useState<{ name: string }>({ name: 'Visitante' });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedAccounts = localStorage.getItem('finneo_accounts');
      const savedTransactions = localStorage.getItem('finneo_transactions');
      const savedGoals = localStorage.getItem('finneo_goals');
      const savedUser = localStorage.getItem('finneo_user');

      if (savedAccounts) setAccounts(JSON.parse(savedAccounts));
      if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
      if (savedGoals) {
        const parsed = JSON.parse(savedGoals);
        // Migração de dados para suportar name, valorTotal e history
        setGoals(parsed.map((g: any) => ({
          ...g,
          name: g.name || g.nome || "Sem nome",
          valorTotal: g.valorTotal || g.valor || 0,
          history: g.history || []
        })));
      }
      if (savedUser) setUser(JSON.parse(savedUser));
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('finneo_accounts', JSON.stringify(accounts));
      localStorage.setItem('finneo_transactions', JSON.stringify(transactions));
      localStorage.setItem('finneo_goals', JSON.stringify(goals));
      localStorage.setItem('finneo_user', JSON.stringify(user));
    }
  }, [accounts, transactions, goals, user, isLoaded]);

  const summary: FinanceSummary = useMemo(() => {
    const totalBalance = accounts.reduce((acc, accItem) => acc + accItem.balance, 0);
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    return { totalBalance, totalIncome, totalExpense };
  }, [accounts, transactions]);

  const updateProfile = (newData: { name: string }) => setUser(newData);

  const addTransaction = (amount: number, description: string, type: TransactionType, accountId: string) => {
    const newTransaction: Transaction = {
      id: Date.now(),
      description, amount, type, accountId,
      date: new Date().toISOString(),
      displayDate: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
    };
    setTransactions(prev => [newTransaction, ...prev]);
    setAccounts(prev => prev.map(acc => acc.id === accountId ?
      { ...acc, balance: type === 'income' ? acc.balance + amount : acc.balance - amount } : acc));
  };

  const addGoal = (newGoal: Omit<Goal, 'id' | 'gastoAtual' | 'history'>) => {
    const goal: Goal = { ...newGoal, id: Date.now().toString(), gastoAtual: 0, history: [] };
    setGoals(prev => [...prev, goal]);
    toast.success('Meta criada!');
  };

  const updateGoalAmount = (id: string, amount: number) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id === id) {
        // Adiciona histórico a cada aporte
        const newEntry = { id: Date.now().toString(), date: new Date().toISOString(), amount };
        return {
          ...goal,
          gastoAtual: goal.gastoAtual + amount,
          history: [newEntry, ...(goal.history || [])] // Garante que history existe
        };
      }
      return goal;
    }));
    toast.success('Aporte realizado!');
  };

  const removeGoal = (id: string) => setGoals(prev => prev.filter(g => g.id !== id));

  return {
    goals, accounts, transactions, isLoaded, summary, user,
    addGoal, removeGoal, updateGoalAmount, addTransaction, updateProfile
  };
}