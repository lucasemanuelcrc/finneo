"use client";

import { useState, useEffect, useMemo } from 'react';
import { Account, Transaction, TransactionType, FinanceSummary } from '@/types';
import { toast } from 'sonner';

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

  // Carregar dados
  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined') {
        const savedAccounts = localStorage.getItem('finneo_accounts');
        const savedTransactions = localStorage.getItem('finneo_transactions');

        if (savedAccounts) setAccounts(JSON.parse(savedAccounts));
        if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
        
        setIsLoaded(true);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Salvar dados
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('finneo_accounts', JSON.stringify(accounts));
      localStorage.setItem('finneo_transactions', JSON.stringify(transactions));
    }
  }, [accounts, transactions, isLoaded]);

  // Cálculos
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

  // --- ACTIONS ---

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
    // 1. Encontrar a transação antes de remover
    const transactionToRemove = transactions.find(t => t.id === transactionId);
    if (!transactionToRemove) return;

    // 2. Definir a função de restauração (Desfazer)
    // CORREÇÃO: Removido o espaço no nome da variável (undoRemoval)
    const undoRemoval = () => {
      // Reinsere a transação na lista
      setTransactions(prev => [transactionToRemove, ...prev].sort((a, b) => b.id - a.id));
      
      // Reverte o saldo da conta para o estado anterior (com a transação)
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

    // 3. Executar a remoção imediata (Optimistic UI)
    setTransactions(prev => prev.filter(t => t.id !== transactionId));
    
    setAccounts(prev => prev.map(acc => {
      if (acc.id === transactionToRemove.accountId) {
        // Reverte o impacto no saldo (tira o dinheiro se era receita, devolve se era despesa)
        const reversedBalance = transactionToRemove.type === 'income'
          ? acc.balance - transactionToRemove.amount
          : acc.balance + transactionToRemove.amount;
        return { ...acc, balance: reversedBalance };
      }
      return acc;
    }));

    // 4. Mostrar Toast com opção de Desfazer
    toast('Transação removida', {
      description: transactionToRemove.description,
      action: {
        label: 'Desfazer',
        onClick: () => undoRemoval(), // Chama a função corrigida
      },
      duration: 4000,
    });
  };

  const clearData = () => {
    toast('Tem certeza que deseja apagar tudo?', {
      action: {
        label: 'Sim, apagar',
        onClick: () => {
          setAccounts(INITIAL_ACCOUNTS);
          setTransactions([]);
          localStorage.clear();
          toast.success('App resetado com sucesso.');
        }
      },
      cancel: {
        label: 'Cancelar',
        onClick: () => {}
      }
    });
  };

  return {
    accounts,
    transactions,
    summary,
    isLoaded,
    addTransaction,
    removeTransaction,
    clearData
  };
}