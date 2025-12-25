import { BankType } from "@/types";
import { CreditCard, Landmark, Building2, Wallet, LucideIcon } from 'lucide-react';

/**
 * Formata um número para moeda BRL
 */
export const formatCurrency = (val: number): string => {
  return new Intl.NumberFormat('pt-BR', { 
    style: 'currency', 
    currency: 'BRL' 
  }).format(val);
};

/**
 * Retorna o ícone e cor baseado no banco
 */
export const getBankConfig = (bank: BankType): { icon: LucideIcon; defaultColor: string } => {
  switch(bank) {
    case 'nubank': return { icon: CreditCard, defaultColor: 'text-white' };
    case 'bb': return { icon: Landmark, defaultColor: 'text-blue-900' };
    case 'bradesco': return { icon: Building2, defaultColor: 'text-white' };
    default: return { icon: Wallet, defaultColor: 'text-gray-200' };
  }
};