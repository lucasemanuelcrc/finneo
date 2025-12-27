import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { BankType } from "@/types";
import { CreditCard, Landmark, Building2, Wallet, LucideIcon } from 'lucide-react';

/**
 * Combina classes CSS de forma inteligente e evita conflitos
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatCurrency = (val: number): string => {
  return new Intl.NumberFormat('pt-BR', { 
    style: 'currency', 
    currency: 'BRL' 
  }).format(val);
};

export const getBankConfig = (bank: BankType): { icon: LucideIcon; defaultColor: string } => {
  switch(bank) {
    case 'nubank': return { icon: CreditCard, defaultColor: 'text-white' };
    case 'bb': return { icon: Landmark, defaultColor: 'text-blue-900' };
    case 'bradesco': return { icon: Building2, defaultColor: 'text-white' };
    default: return { icon: Wallet, defaultColor: 'text-gray-200' };
  }
};