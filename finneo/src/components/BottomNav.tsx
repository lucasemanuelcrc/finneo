import React from 'react';
import { Home, CreditCard, PieChart, FileText } from 'lucide-react';
import Link from 'next/link';

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 py-3 px-6 pb-6 shadow-[0_-5px_15px_rgba(0,0,0,0.02)] z-50">
      <ul className="flex justify-between items-center">
        <li>
          <Link href="/dashboard" className="flex flex-col items-center text-black gap-1">
            <Home size={22} strokeWidth={2.5} />
            <span className="text-[10px] font-semibold">Início</span>
          </Link>
        </li>
        <li>
          <Link href="/contas" className="flex flex-col items-center text-gray-400 hover:text-black transition-colors gap-1">
            <CreditCard size={22} />
            <span className="text-[10px] font-medium">Contas</span>
          </Link>
        </li>
        <li>
          {/* Botão Central de Ação Rápida (FAB) - Visualmente destacado */}
          <div className="relative -top-6">
            <button className="bg-black text-white p-4 rounded-full shadow-lg shadow-black/30 hover:scale-105 transition-transform">
              <span className="text-2xl leading-none font-light">+</span>
            </button>
          </div>
        </li>
        <li>
          <Link href="/relatorios" className="flex flex-col items-center text-gray-400 hover:text-black transition-colors gap-1">
            <FileText size={22} />
            <span className="text-[10px] font-medium">Relatórios</span>
          </Link>
        </li>
        <li>
          <Link href="/planejamento" className="flex flex-col items-center text-gray-400 hover:text-black transition-colors gap-1">
            <PieChart size={22} />
            <span className="text-[10px] font-medium">Planos</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}