"use client";

import React, { useState, useEffect } from 'react';
import { PieChart, Target, Plus, ChevronRight, AlertCircle } from 'lucide-react';
import { useFinance } from '@/hooks/useFinance';
import { formatCurrency } from '@/lib/utils';

export default function TelaPlanos() {
  const { summary, isLoaded } = useFinance();
  const [mounted, setMounted] = useState(false);

  // CORREÇÃO DEFINITIVA: 
  // O uso do setTimeout com 0ms move a execução do setMounted para o final da fila 
  // de processamento, garantindo que a renderização inicial do React seja concluída 
  // antes de disparar uma nova atualização de estado.
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Bloqueio de renderização para evitar erros de hidratação (SSR vs Client mismatch)
  // Também aguarda o carregamento dos dados do localStorage via useFinance
  if (!mounted || !isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-black"></div>
      </div>
    );
  }

  // Dados Mockados para o Design (Podem ser movidos para um estado global futuramente)
  const metas = [
    { categoria: "Alimentação", planejado: 800, icone: "🍔", gastoAtual: 520 },
    { categoria: "Transporte", planejado: 300, icone: "🚗", gastoAtual: 150 },
    { categoria: "Lazer", planejado: 400, icone: "🍿", gastoAtual: 380 },
    { categoria: "Saúde", planejado: 200, icone: "💊", gastoAtual: 40 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-40">
      
      {/* --- HEADER (Padrão de Design Finneo) --- */}
      <header className="bg-gradient-to-b from-gray-900 to-black text-white pt-8 pb-32 px-6 rounded-b-[2.5rem] shadow-2xl relative z-10">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-xs font-bold border border-gray-700 text-gray-300">
              PL
            </div>
            <div>
              <p className="text-xs text-gray-400">Meu foco</p>
              <h1 className="text-sm font-bold tracking-widest uppercase">PLANEJAMENTO</h1>
            </div>
          </div>
        </div>
        <div className="text-center">
          <span className="text-gray-400 text-sm font-medium">Meta de Economia</span>
          <h2 className="text-4xl font-bold tracking-tight">
            {formatCurrency(summary.totalBalance * 0.2)}
          </h2>
        </div>
      </header>

      {/* --- CARDS DE RESUMO FLUTUANTES --- */}
      <div className="px-6 -mt-20 relative z-20 grid grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <div className="bg-blue-50 p-2 rounded-full text-blue-600">
              <PieChart size={20} />
            </div>
            <span className="text-[10px] uppercase font-bold text-gray-400">Gastos Reais</span>
          </div>
          <span className="text-xl font-bold text-gray-900">{formatCurrency(summary.totalExpense)}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <div className="bg-purple-50 p-2 rounded-full text-purple-600">
              <Target size={20} />
            </div>
            <span className="text-[10px] uppercase font-bold text-gray-400">Limite Ideal</span>
          </div>
          <span className="text-xl font-bold text-gray-900">{formatCurrency(1700)}</span>
        </div>
      </div>

      {/* --- LISTA DE METAS POR CATEGORIA --- */}
      <main className="px-6 mt-8 space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">Metas Mensais</h3>
          <button className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:opacity-70 transition-opacity">
            <Plus size={14} /> Ajustar
          </button>
        </div>

        <div className="space-y-4">
          {metas.map((meta, index) => {
            const porcentagem = (meta.gastoAtual / meta.planejado) * 100;
            const isAlert = porcentagem > 85;

            return (
              <div key={index} className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm transition-all active:scale-[0.98]">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{meta.icone}</span>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{meta.categoria}</p>
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">
                        Limite: {formatCurrency(meta.planejado)}
                      </p>
                    </div>
                  </div>
                  {isAlert && <AlertCircle size={18} className="text-orange-500 animate-pulse" />}
                  <ChevronRight size={18} className="text-gray-300" />
                </div>

                {/* Barra de Progresso */}
                <div className="space-y-2">
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-700 ${isAlert ? 'bg-orange-500' : 'bg-black'}`}
                      style={{ width: `${Math.min(porcentagem, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-gray-400">
                      {porcentagem.toFixed(0)}% Utilizado
                    </span>
                    <span className="text-[10px] font-black text-gray-900">
                      {formatCurrency(meta.gastoAtual)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Banner de Feedback de Saúde Financeira */}
      <div className="mx-6 mt-8 p-6 bg-green-50 rounded-[2.5rem] border border-green-100 flex items-center gap-4">
        <div className="bg-green-100 p-3 rounded-2xl text-green-600">
           <PieChart size={24} />
        </div>
        <div>
          <p className="text-sm font-bold text-green-900">Bom trabalho!</p>
          <p className="text-xs text-green-700">
            Você economizou {formatCurrency(240)} a mais que no mês passado até agora.
          </p>
        </div>
      </div>
    </div>
  );
}