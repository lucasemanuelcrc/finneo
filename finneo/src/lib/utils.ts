import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { BankType } from "@/types";
import { CreditCard, Landmark, Building2, Wallet, LucideIcon } from 'lucide-react';

// Função para combinar classes CSS (Shadcn/UI)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Formatação de moeda BRL
export function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

// Configuração de ícones dos bancos - NECESSÁRIO para as telas
export const getBankConfig = (bank: BankType): { icon: LucideIcon; defaultColor: string } => {
  switch(bank) {
    case 'nubank': return { icon: CreditCard, defaultColor: 'text-white' };
    case 'bb': return { icon: Landmark, defaultColor: 'text-blue-900' };
    case 'bradesco': return { icon: Building2, defaultColor: 'text-white' };
    default: return { icon: Wallet, defaultColor: 'text-gray-200' };
  }
};