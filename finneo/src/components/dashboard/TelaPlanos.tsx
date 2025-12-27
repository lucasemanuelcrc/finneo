"use client";

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Target, Wallet, ChevronRight, X } from 'lucide-react';
import { useFinance } from '@/hooks/useFinance';
import { formatCurrency, cn } from '@/lib/utils';

export default function TelaPlanos() {
  const router = useRouter();
  const { goals, isLoaded, addGoal } = useFinance();

  // Estados para o Modal e Formulário
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [valorTotal, setValorTotal] = useState('');
  const [prazo, setPrazo] = useState('');
  const [unidade, setUnidade] = useState<'meses' | 'anos'>('meses');
  const [icone, setIcone] = useState('💰');

  const emojisDisponiveis = ['💰', '🏠', '🚗', '✈️', '🎓', '📱', '💍', '🚴', '🎮', '🏥', '🏗️', '🔋'];

  const totalSaved = useMemo(() => {
    return goals.reduce((acc, goal) => acc + (goal.gastoAtual || 0), 0);
  }, [goals]);

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !valorTotal || !prazo) return;

    addGoal({
      name,
      valorTotal: Number(valorTotal),
      prazo: Number(prazo),
      unidade,
      icone
    });

    // Reset e Fechar
    setIsModalOpen(false);
    setName('');
    setValorTotal('');
    setPrazo('');
    setUnidade('meses');
    setIcone('💰');
  };

  if (!isLoaded) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-pulse text-gray-400 font-medium">Sincronizando planos...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-44 overflow-x-hidden">
      
      {/* --- HEADER --- */}
      <header className="bg-gradient-to-b from-gray-900 to-black text-white pt-12 pb-24 px-6 rounded-b-[2.5rem] shadow-2xl relative z-10">
        <div className="flex items-center justify-between mb-10">
          <button 
            onClick={() => router.back()} 
            className="p-2.5 bg-white/10 rounded-full active:scale-90 transition-transform backdrop-blur-md border border-white/5"
          >
            <ArrowLeft size={22} />
          </button>
          <h1 className="text-xs font-black tracking-[0.3em] uppercase opacity-50">Planejamento</h1>
          <div className="w-11" />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-blue-400/80">
            <Wallet size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">Economia Total</span>
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight">
            {formatCurrency(totalSaved)}
          </h2>
        </div>
      </header>

      {/* --- LISTA DE METAS --- */}
      <main className="px-6 -mt-12 relative z-20 space-y-4">
        {goals.length === 0 ? (
          <div className="bg-white p-12 rounded-[2.5rem] border-2 border-dashed border-gray-200 text-center shadow-sm">
             <Target size={40} className="mx-auto mb-3 opacity-10 text-black" />
            <p className="text-gray-400 text-sm font-medium">Nenhum plano ativo no momento.</p>
          </div>
        ) : (
          goals.map((goal) => {
            const total = goal.valorTotal || 1; 
            const atual = goal.gastoAtual || 0;
            const percentage = Math.min(100, Math.round((atual / total) * 100));
            const isCompleted = percentage >= 100;

            return (
              <div key={goal.id} className="bg-white p-5 rounded-[2.2rem] border border-gray-100 shadow-md active:scale-[0.98] transition-all">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-14 h-14 rounded-[1.2rem] flex items-center justify-center shrink-0 bg-gray-50 text-2xl shadow-inner border border-gray-100">
                      {goal.icone}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 leading-tight truncate">{goal.name}</h3>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                        Prazo: {goal.prazo} {goal.unidade}
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-gray-300 ml-2" />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Acumulado</span>
                      <span className="text-2xl font-black text-gray-900 tracking-tighter">{formatCurrency(atual)}</span>
                    </div>
                    <div className="text-right">
                       <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest block mb-1">Objetivo</span>
                       <span className="text-xs font-bold text-gray-400">{formatCurrency(total)}</span>
                    </div>
                  </div>

                  <div className="relative h-3 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className={cn(
                        "absolute left-0 top-0 h-full rounded-full transition-all duration-1000 ease-out",
                        isCompleted ? "bg-blue-600" : "bg-black"
                      )}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </main>

      {/* --- BOTÃO FLUTUANTE (FAB) --- */}
      <div className="fixed bottom-40 left-0 right-0 flex justify-center z-40 pointer-events-none px-6">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="pointer-events-auto w-full max-w-xs bg-black text-white py-5 rounded-[1.8rem] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3 border border-white/5"
        >
          <div className="bg-white/20 p-1 rounded-lg">
            <Plus size={18} strokeWidth={3} />
          </div>
          <span className="font-bold text-sm tracking-tight">Criar Nova Meta</span>
        </button>
      </div>

      {/* --- MODAL DE CRIAR META --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-gray-900">Nova Meta</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 bg-gray-100 rounded-full text-gray-400">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="space-y-5">
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Nome do objetivo</label>
                <input 
                  type="text" required placeholder="Ex: Viagem, Carro..." value={name} onChange={e => setName(e.target.value)}
                  className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-black outline-none font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Valor total</label>
                  <input 
                    type="number" required placeholder="R$ 0,00" value={valorTotal} onChange={e => setValorTotal(e.target.value)}
                    className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-black outline-none font-medium"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Prazo</label>
                  <div className="flex bg-gray-50 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-black">
                    <input 
                      type="number" required placeholder="12" value={prazo} onChange={e => setPrazo(e.target.value)}
                      className="w-1/2 p-4 bg-transparent border-none outline-none font-medium"
                    />
                    <select 
                      value={unidade} onChange={e => setUnidade(e.target.value as 'meses' | 'anos')}
                      className="w-1/2 bg-transparent border-none text-[10px] font-bold uppercase outline-none px-2"
                    >
                      <option value="meses">Meses</option>
                      <option value="anos">Anos</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Escolha um ícone</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {emojisDisponiveis.map(e => (
                    <button 
                      key={e} type="button" onClick={() => setIcone(e)}
                      className={cn(
                        "text-2xl w-11 h-11 flex items-center justify-center rounded-xl transition-all",
                        icone === e ? "bg-black scale-110 shadow-lg" : "bg-gray-50 hover:bg-gray-100"
                      )}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" className="w-full py-5 bg-black text-white rounded-[2rem] font-bold shadow-xl active:scale-95 transition-all mt-4">
                Confirmar Plano
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}