"use client";

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Wallet, ChevronRight, X, History, Trash2, Calendar } from 'lucide-react';
import { useFinance } from '@/hooks/useFinance';
import { formatCurrency, cn } from '@/lib/utils';
import { Goal } from '@/hooks/useFinance';

export default function TelaPlanos() {
  const router = useRouter();
  const { goals, isLoaded, addGoal, removeGoal } = useFinance();

  // Estados para Modais
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  // Estados do Formulário de Criação
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

    setIsCreateModalOpen(false);
    setName(''); setValorTotal(''); setPrazo(''); setIcone('💰');
  };

  const handleRemove = (id: string) => {
    removeGoal(id);
    setSelectedGoal(null);
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
          <button onClick={() => router.back()} className="p-2.5 bg-white/10 rounded-full backdrop-blur-md">
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
          <h2 className="text-4xl font-extrabold tracking-tight">{formatCurrency(totalSaved)}</h2>
        </div>
      </header>

      {/* --- LISTA DE METAS --- */}
      <main className="px-6 -mt-12 relative z-20 space-y-4">
        {goals.map((goal) => {
          const percentage = Math.min(100, Math.round((goal.gastoAtual / goal.valorTotal) * 100));
          return (
            <div 
              key={goal.id} 
              onClick={() => setSelectedGoal(goal)}
              className="bg-white p-5 rounded-[2.2rem] border border-gray-100 shadow-md active:scale-[0.98] transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-14 h-14 rounded-[1.2rem] flex items-center justify-center shrink-0 bg-gray-50 text-2xl shadow-inner border border-gray-100">
                    {goal.icone}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 truncate">{goal.name}</h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      {goal.prazo} {goal.unidade}
                    </p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-gray-300" />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-2xl font-black text-gray-900 tracking-tighter">{formatCurrency(goal.gastoAtual)}</span>
                  <span className="text-xs font-bold text-gray-400">Objetivo: {formatCurrency(goal.valorTotal)}</span>
                </div>
                <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className={cn("h-full rounded-full transition-all duration-1000", percentage >= 100 ? "bg-blue-600" : "bg-black")}
                    style={{ width: `${percentage}%` }} 
                  />
                </div>
              </div>
            </div>
          );
        })}
      </main>

      {/* --- FAB --- */}
      <div className="fixed bottom-40 left-0 right-0 flex justify-center z-40 pointer-events-none px-6">
        <button onClick={() => setIsCreateModalOpen(true)} className="pointer-events-auto w-full max-w-xs bg-black text-white py-5 rounded-[1.8rem] shadow-2xl flex items-center justify-center gap-3">
          <Plus size={18} strokeWidth={3} />
          <span className="font-bold text-sm">Criar Nova Meta</span>
        </button>
      </div>

      {/* --- MODAL DETALHES & HISTÓRICO --- */}
      {selectedGoal && (
        <div className="fixed inset-0 z-[110] flex items-end justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedGoal.icone}</span>
                <h3 className="text-xl font-black text-gray-900">{selectedGoal.name}</h3>
              </div>
              <button onClick={() => setSelectedGoal(null)} className="p-2 bg-gray-100 rounded-full text-gray-400">
                <X size={20} />
              </button>
            </div>

            <div className="bg-gray-50 rounded-3xl p-6 mb-8 border border-gray-100">
              <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Status do Plano</p>
              <h4 className="text-3xl font-black text-gray-900 mb-2">
                {Math.min(100, Math.round((selectedGoal.gastoAtual / selectedGoal.valorTotal) * 100))}%
              </h4>
              <p className="text-sm text-gray-500">
                Você já economizou <strong>{formatCurrency(selectedGoal.gastoAtual)}</strong> de <strong>{formatCurrency(selectedGoal.valorTotal)}</strong>.
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-2 text-gray-900 mb-4">
                <History size={18} className="text-blue-600" />
                <span className="font-bold text-sm uppercase tracking-widest">Histórico de Depósitos</span>
              </div>
              
              {selectedGoal.history.length === 0 ? (
                <p className="text-center py-6 text-sm text-gray-400 border border-dashed rounded-2xl">Nenhum depósito realizado ainda.</p>
              ) : (
                <div className="space-y-3">
                  {selectedGoal.history.map((h) => (
                    <div key={h.id} className="flex justify-between items-center p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="bg-green-50 p-2 rounded-xl text-green-600"><Plus size={16} /></div>
                        <div>
                          <p className="font-bold text-sm text-gray-900">Aporte realizado</p>
                          <p className="text-[10px] text-gray-400 flex items-center gap-1">
                            <Calendar size={10} /> {new Date(h.date).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <span className="font-black text-green-600 text-sm">+{formatCurrency(h.amount)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button 
              onClick={() => handleRemove(selectedGoal.id)}
              className="w-full py-4 text-red-500 font-bold text-sm flex items-center justify-center gap-2 hover:bg-red-50 rounded-2xl transition-colors"
            >
              <Trash2 size={16} /> Excluir este plano
            </button>
          </div>
        </div>
      )}

      {/* --- MODAL CRIAR META --- */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-gray-900">Nova Meta</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="p-2 bg-gray-100 rounded-full text-gray-400"><X size={20} /></button>
            </div>
            <form onSubmit={handleCreateGoal} className="space-y-5">
              <input type="text" required placeholder="Nome do objetivo" value={name} onChange={e => setName(e.target.value)} className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none font-medium" />
              <div className="grid grid-cols-2 gap-4">
                <input type="number" required placeholder="R$ Total" value={valorTotal} onChange={e => setValorTotal(e.target.value)} className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none font-medium" />
                <div className="flex bg-gray-50 rounded-2xl overflow-hidden">
                  <input type="number" required placeholder="Prazo" value={prazo} onChange={e => setPrazo(e.target.value)} className="w-1/2 p-4 bg-transparent border-none outline-none font-medium" />
                  <select value={unidade} onChange={e => setUnidade(e.target.value as 'meses' | 'anos')} className="w-1/2 bg-transparent border-none text-[10px] font-bold uppercase outline-none px-2">
                    <option value="meses">Meses</option><option value="anos">Anos</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {emojisDisponiveis.map(e => (
                  <button key={e} type="button" onClick={() => setIcone(e)} className={cn("text-2xl w-11 h-11 flex items-center justify-center rounded-xl transition-all", icone === e ? "bg-black scale-110 shadow-lg" : "bg-gray-50")}>{e}</button>
                ))}
              </div>
              <button type="submit" className="w-full py-5 bg-black text-white rounded-[2rem] font-bold shadow-xl active:scale-95 transition-all mt-4">Confirmar Plano</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}