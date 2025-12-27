// Define os tipos de transação
export type TransactionType = 'income' | 'expense';

// --- CORREÇÃO: Exportando o tipo BankType que estava faltando ---
export type BankType = 'nubank' | 'bb' | 'bradesco' | 'wallet';

export interface Account {
  id: string;
  name: string;
  bank: BankType; // Agora usa o tipo exportado acima
  balance: number;
  color: string;
}

export interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: TransactionType;
  accountId: string;
  date: string;
  displayDate: string;
}

export interface FinanceSummary {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
}
// Adicione ao final do arquivo src/types/index.ts
export interface UserProfile {
  name: string;
  avatar?: string;
}
// src/types/index.ts ou similar
export interface Goal {
  id: string;
  name: string;      // Verificado: Imagem 65a049 pede 'name'
  valorTotal: number; // Verificado: Imagem 65a049 pede 'valorTotal'
  gastoAtual: number;
  prazo: number;
  unidade: 'meses' | 'anos';
  icone: string;
  history: {          // Necessário para a função de histórico que adicionamos
    id: string;
    date: string;
    amount: number;
  }[];
}