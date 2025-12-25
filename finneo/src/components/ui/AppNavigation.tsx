"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FileText, PieChart, User } from 'lucide-react';

export default function AppNavigation() {
  const pathname = usePathname();

  // Definição dos itens do menu
  const navItems = [
    {
      label: 'Início',
      href: '/inicio',
      icon: Home
    },
    {
      label: 'Extrato',
      href: '/extrato', // Rota geral que criaremos
      icon: FileText
    },
    {
      label: 'Planos',
      href: '/planejamento', // Futura tela
      icon: PieChart
    },
    {
      label: 'Perfil',
      href: '/perfil', // Futura tela
      icon: User
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 pb-safe pt-2 px-6 shadow-[0_-5px_20px_rgba(0,0,0,0.03)] z-40 h-[80px]">
      <ul className="flex justify-between items-center h-full pb-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          // Verifica se a rota atual começa com o href do item (para manter ativo em sub-rotas)
          const isActive = pathname.startsWith(item.href);

          return (
            <li key={item.href} className="flex-1">
              <Link 
                href={item.href}
                className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 group ${
                  isActive ? 'text-black' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {/* Indicador Ativo (Ponto ou Ícone preenchido) */}
                <div className={`relative p-1.5 rounded-xl transition-all ${isActive ? 'bg-gray-100' : 'bg-transparent'}`}>
                  <Icon 
                    size={24} 
                    strokeWidth={isActive ? 2.5 : 2} 
                    className="transition-transform group-active:scale-90"
                  />
                </div>
                <span className={`text-[10px] font-medium ${isActive ? 'font-bold' : ''}`}>
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}