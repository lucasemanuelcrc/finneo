"use client";

import { useState, useEffect, useMemo } from "react";
import { Account, Transaction, TransactionType, FinanceSummary } from "@/types";
import { toast } from "sonner";

/* ============================
 * Types
 * ============================ */
export interface GoalTransaction {
  id: string;
  date: string;
  amount: number;
}

export interface Goal {
  id: string;
  name: string;
  valorTotal: number;
  prazo: number;
  unidade: "meses" | "anos";
  icone: string;
  gastoAtual: number;
  history: GoalTransaction[];
}

/* ============================
 * Initial data
 * ============================ */
const INITIAL_ACCOUNTS: Account[] = [
  { id: "1", name: "Nubank", bank: "nubank", balance: 0, color: "bg-purple-600" },
  { id: "2", name: "Banco do Brasil", bank: "bb", balance: 0, color: "bg-yellow-400" },
  { id: "3", name: "Bradesco", bank: "bradesco", balance: 0, color: "bg-red-600" },
  { id: "4", name: "Carteira", bank: "wallet", balance: 0, color: "bg-gray-800" },
];

/* ============================
 * Hook
 * ============================ */
export function useFinance() {
  const [accounts, setAccounts] = useState<Account[]>(INITIAL_ACCOUNTS);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [user, setUser] = useState<{ name: string }>({ name: "Visitante" });
  const [isLoaded, setIsLoaded] = useState(false);

  /* ============================
   * Load from localStorage
   * ============================ */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedAccounts = localStorage.getItem("finneo_accounts");
    const savedTransactions = localStorage.getItem("finneo_transactions");
    const savedGoals = localStorage.getItem("finneo_goals");
    const savedUser = localStorage.getItem("finneo_user");

    if (savedAccounts) {
      setAccounts(JSON.parse(savedAccounts) as Account[]);
    }

    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions) as Transaction[]);
    }

    if (savedGoals) {
      const parsed = JSON.parse(savedGoals) as Partial<Goal>[];

      setGoals(
        parsed.map((g) => ({
          id: g.id ?? crypto.randomUUID(),
          name: g.name ?? "Sem nome",
          valorTotal: g.valorTotal ?? 0,
          prazo: g.prazo ?? 0,
          unidade: g.unidade ?? "meses",
          icone: g.icone ?? "🎯",
          gastoAtual: g.gastoAtual ?? 0,
          history: g.history ?? [],
        }))
      );
    }

    if (savedUser) {
      setUser(JSON.parse(savedUser) as { name: string });
    }

    setIsLoaded(true);
  }, []);

  /* ============================
   * Persist to localStorage
   * ============================ */
  useEffect(() => {
    if (!isLoaded) return;

    localStorage.setItem("finneo_accounts", JSON.stringify(accounts));
    localStorage.setItem("finneo_transactions", JSON.stringify(transactions));
    localStorage.setItem("finneo_goals", JSON.stringify(goals));
    localStorage.setItem("finneo_user", JSON.stringify(user));
  }, [accounts, transactions, goals, user, isLoaded]);

  /* ============================
   * Summary
   * ============================ */
  const summary: FinanceSummary = useMemo(() => {
    const totalBalance = accounts.reduce((acc, a) => acc + a.balance, 0);
    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((acc, t) => acc + t.amount, 0);
    const totalExpense = transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => acc + t.amount, 0);

    return { totalBalance, totalIncome, totalExpense };
  }, [accounts, transactions]);

  /* ============================
   * Profile
   * ============================ */
  const updateProfile = (newData: { name: string }) => {
    setUser(newData);
    toast.success("Perfil atualizado!");
  };

  /* ============================
   * Transactions
   * ============================ */
  const addTransaction = (
    amount: number,
    description: string,
    type: TransactionType,
    accountId: string
  ) => {
    const newTransaction: Transaction = {
      id: Date.now(),
      description,
      amount,
      type,
      accountId,
      date: new Date().toISOString(),
      displayDate: new Date().toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
      }),
    };

    setTransactions((prev) => [newTransaction, ...prev]);

    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === accountId
          ? {
              ...acc,
              balance:
                type === "income"
                  ? acc.balance + amount
                  : acc.balance - amount,
            }
          : acc
      )
    );

    toast.success("Movimentação adicionada!");
  };

  const removeTransaction = (id: number) => {
    const transaction = transactions.find((t) => t.id === id);
    if (!transaction) return;

    setTransactions((prev) => prev.filter((t) => t.id !== id));

    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === transaction.accountId
          ? {
              ...acc,
              balance:
                transaction.type === "income"
                  ? acc.balance - transaction.amount
                  : acc.balance + transaction.amount,
            }
          : acc
      )
    );

    toast.success("Movimentação removida!");
  };

  /* ============================
   * Goals
   * ============================ */
  const addGoal = (newGoal: Omit<Goal, "id" | "gastoAtual" | "history">) => {
    const goal: Goal = {
      ...newGoal,
      id: crypto.randomUUID(),
      gastoAtual: 0,
      history: [],
    };

    setGoals((prev) => [...prev, goal]);
    toast.success("Meta criada!");
  };

  const updateGoalAmount = (id: string, amount: number) => {
    setGoals((prev) =>
      prev.map((goal) => {
        if (goal.id !== id) return goal;

        const newEntry: GoalTransaction = {
          id: crypto.randomUUID(),
          date: new Date().toISOString(),
          amount,
        };

        return {
          ...goal,
          gastoAtual: goal.gastoAtual + amount,
          history: [newEntry, ...goal.history],
        };
      })
    );

    toast.success("Aporte realizado!");
  };

  const removeGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
    toast.success("Meta removida!");
  };

  /* ============================
   * Public API
   * ============================ */
  return {
    accounts,
    transactions,
    goals,
    summary,
    user,
    isLoaded,

    addTransaction,
    removeTransaction,

    addGoal,
    updateGoalAmount,
    removeGoal,

    updateProfile,
  };
}
