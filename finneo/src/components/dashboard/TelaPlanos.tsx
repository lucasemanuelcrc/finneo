"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Target, Plus, X, Trash2, ChevronRight, History, Calendar, ArrowLeft } from 'lucide-react';
import { useFinance, Goal } from '@/hooks/useFinance';
import { formatCurrency, cn } from '@/lib/utils';

export default function TelaPlanos() {
  const router = useRouter();
  const { isLoaded, goals, addGoal, removeGoal, updateGoalAmount } = useFinance();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [amountToAdd, setAmountToAdd] = useState('');

  // Estados do Formulário
  const [name, setName] = useState('');
  const [valorTotal, setValorTotal] = useState('');
  const [prazo, setPrazo] = useState('');
  const [unidade, setUnidade] = useState<'meses' | 'anos'>('meses');
  const [icone, setIcone] = useState('💰');

  const iconesDisponiveis = ['💰', '🏠', '🚗', '✈️', '🎓', '📱', '💍', '🚴', '🎮', '🏥', '🏢', '🏗️'];

  if (!isLoaded) return <div className="min-h-screen bg-gray-50 flex items-center justify-center animate-pulse" />;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !valorTotal || !prazo) return;

    addGoal({
      name,
      valorTotal: parseFloat(valorTotal.replace(',', '.')),
      prazo: parseInt(prazo),
      unidade,
      icone
    });

    setShowCreateModal(false);
    setName(''); setValorTotal(''); setPrazo('');
  };

  const handleAporte = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedGoal && amountToAdd) {
      updateGoalAmount(selectedGoal.id, parseFloat(amountToAdd.replace(',', '.')));
      setAmountToAdd('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-44">
      <header className="bg-gradient-to-b from-gray-900 to-black text-white pt-10 pb-28 px-6 rounded-b-[2.5rem] shadow-2xl relative z-10">
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => router.back()} className="p-2 bg-white/10 rounded-full backdrop-blur-md">
            <ArrowLeft size={22} />
          </button>
          <h1 className="text-xs font-black tracking-widest uppercase opacity-50">Planejamento</h1>
          <div className="w-10" />
        </div>
        <div className="text-center">
          <p className="text-gray-400 text-xs font-bold uppercase mb-1">Total Guardado em Metas</p>
          <h2 className="text-4xl font-black">{formatCurrency(goals.reduce((acc, g) => acc + g.gastoAtual, 0))}</h2>
        </div>
      </header>

      <main className="px-6 -mt-12 relative z-20 space-y-4">
        {goals.length === 0 ? (
          <div className="bg-white p-12 rounded-[2.5rem] border-2 border-dashed border-gray-200 text-center shadow-sm">
            <Target size={40} className="mx-auto mb-3 opacity-10" />
            <p className="text-gray-500 font-bold">Nenhum plano ativo no momento.</p>
          </div>
        ) : (
          goals.map((meta) => {
            const progresso = Math.min((meta.gastoAtual / meta.valorTotal) * 100, 100);
            return (
              <div key={meta.id} onClick={() => setSelectedGoal(meta)} className="bg-white p-6 rounded-[2.2rem] border border-gray-100 shadow-sm active:scale-[0.98] transition-all cursor-pointer">
                <div className="flex justify-between items-center mb-5">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl bg-gray-50 w-12 h-12 flex items-center justify-center rounded-2xl shadow-inner">{meta.icone}</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 truncate">{meta.name}</h4>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{meta.prazo} {meta.unidade}</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-gray-300 ml-2" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-xl font-black">{formatCurrency(meta.gastoAtual)}</span>
                    <span className="text-[10px] font-bold text-gray-400">Objetivo: {formatCurrency(meta.valorTotal)}</span>
                  </div>
                  <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner">
                    <div className={cn("h-full transition-all duration-1000", progresso >= 100 ? 'bg-green-500' : 'bg-black')} style={{ width: `${progresso}%` }} />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </main>

      {/* FAB - FIX POSICIONAMENTO (bottom-36) */}
      <div className="fixed bottom-36 left-0 right-0 flex justify-center z-40 pointer-events-none px-6">
        <button onClick={() => setShowCreateModal(true)} className="pointer-events-auto w-full max-w-xs bg-black text-white py-5 rounded-[1.8rem] shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all">
          <Plus size={18} strokeWidth={3} />
          <span className="font-bold text-sm">Criar Nova Meta</span>
        </button>
      </div>

      {/* MODAL DETALHES E HISTÓRICO (Unificado) */}
      {selectedGoal && (
        <div className="fixed inset-0 z-[110] flex items-end justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-300 shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedGoal.icone}</span>
                <h3 className="text-xl font-black text-gray-900">{selectedGoal.name}</h3>
              </div>
              <button onClick={() => setSelectedGoal(null)} className="p-2 bg-gray-100 rounded-full text-gray-400 hover:bg-gray-200 transition-colors"><X size={20} /></button>
            </div>

            <form onSubmit={handleAporte} className="mb-8 bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
              <label className="text-[10px] font-black uppercase text-gray-400 block mb-3 text-center">Adicionar Valor</label>
              <div className="flex gap-3">
                <input type="number" step="0.01" value={amountToAdd} onChange={e => setAmountToAdd(e.target.value)} className="flex-1 p-4 bg-white rounded-2xl outline-none font-bold text-gray-900 shadow-sm" placeholder="R$ 0,00" />
                <button type="submit" className="bg-black text-white p-4 rounded-2xl shadow-lg active:scale-95 transition-all"><Plus size={24} /></button>
              </div>
            </form>

            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <History size={18} className="text-blue-600" />
                <span className="font-bold text-xs uppercase tracking-widest text-gray-400">Histórico de Depósitos</span>
              </div>
              {(!selectedGoal.history || selectedGoal.history.length === 0) ? (
                <p className="text-center text-sm text-gray-400 py-4">Nenhum depósito recente.</p>
              ) : (
                selectedGoal.history.map(h => (
                  <div key={h.id} className="flex justify-between items-center p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-3">
                      <Calendar size={16} className="text-gray-400" />
                      <p className="text-xs font-bold text-gray-900">{new Date(h.date).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <span className="font-black text-green-600 text-sm">+{formatCurrency(h.amount)}</span>
                  </div>
                ))
              )}
            </div>

            <button onClick={() => { removeGoal(selectedGoal.id); setSelectedGoal(null); }} className="w-full mt-8 py-4 text-red-500 font-bold text-xs flex items-center justify-center gap-2 bg-red-50 rounded-2xl hover:bg-red-100 transition-colors">
              <Trash2 size={16} /> Excluir Meta
            </button>
          </div>
        </div>
      )}

      {/* MODAL CRIAR META */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 animate-in slide-in-from-bottom duration-300 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-gray-900">Nova Meta</h3>
              <button onClick={() => setShowCreateModal(false)} className="p-2 bg-gray-100 rounded-full text-gray-400 hover:bg-gray-200 transition-colors"><X size={20} /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-5">
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Nome do objetivo</label>
                <input type="text" placeholder="Ex: Viagem, Casa..." value={name} onChange={e => setName(e.target.value)} className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-medium text-gray-900" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Valor Total</label>
                  <input type="number" placeholder="R$ 0,00" value={valorTotal} onChange={e => setValorTotal(e.target.value)} className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-medium text-gray-900" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Tempo</label>
                  <div className="flex bg-gray-50 rounded-2xl overflow-hidden">
                    <input type="number" placeholder="12" value={prazo} onChange={e => setPrazo(e.target.value)} className="w-1/2 p-4 bg-transparent outline-none font-medium text-gray-900" />
                    <select value={unidade} onChange={e => setUnidade(e.target.value as 'meses' | 'anos')} className="w-1/2 bg-transparent text-[10px] font-bold uppercase outline-none px-2 text-gray-900">
                      <option value="meses">Meses</option><option value="anos">Anos</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {iconesDisponiveis.map(i => (
                  <button key={i} type="button" onClick={() => setIcone(i)} className={cn("text-2xl w-11 h-11 flex items-center justify-center rounded-xl transition-all", icone === i ? "bg-black scale-110 shadow-lg" : "bg-gray-50")}>{i}</button>
                ))}
              </div>
              <button type="submit" className="w-full py-5 bg-black text-white rounded-[2rem] font-bold shadow-xl mt-4 active:scale-95 transition-all">Criar Meta</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}