"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Target, Plus, X, Trash2 } from 'lucide-react';
import { useFinance } from '@/hooks/useFinance';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

export default function TelaPlanos() {
  const { isLoaded, goals, addGoal, removeGoal, updateGoalAmount } = useFinance();
  
  const [mounted, setMounted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showAddValueModal, setShowAddValueModal] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [amountToAdd, setAmountToAdd] = useState('');

  // Estados do Formulário
  const [nome, setNome] = useState('');
  const [valor, setValor] = useState('');
  const [prazo, setPrazo] = useState('');
  const [unidade, setUnidade] = useState<'meses' | 'anos'>('meses');
  const [icone, setIcone] = useState('💰');

  const iconesDisponiveis = ['💰', '🏠', '🚗', '✈️', '🎓', '📱', '💍', '🚴', '🎮', '🏥', '🏢', '🏗️'];

  // CORREÇÃO 1: Timer para evitar Cascading Renders (Erro Amarelo)
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // CORREÇÃO 2: useCallback para estabilizar a função e evitar warnings de dependência
  const resetForm = useCallback(() => {
    setNome('');
    setValor('');
    setPrazo('');
    setIcone('💰');
    setUnidade('meses');
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !valor || !prazo) {
      toast.error("Preencha todos os campos.");
      return;
    }

    addGoal({
      nome,
      valor: parseFloat(valor),
      prazo: parseInt(prazo),
      unidade,
      icone
    });

    setShowModal(false);
    resetForm();
  };

  const handleAddValue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoalId || !amountToAdd) return;
    
    updateGoalAmount(selectedGoalId, parseFloat(amountToAdd));
    setShowAddValueModal(false);
    setAmountToAdd('');
    setSelectedGoalId(null);
  };

  if (!mounted || !isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-40">
      
      {/* HEADER */}
      <header className="bg-gradient-to-b from-gray-900 to-black text-white pt-8 pb-32 px-6 rounded-b-[2.5rem] shadow-2xl relative z-10">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center border border-gray-700">
              <Target size={18} className="text-blue-400" />
            </div>
            <h1 className="text-sm font-bold tracking-widest uppercase">PLANEJAMENTO</h1>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <Plus size={24} />
          </button>
        </div>
        <div className="text-center">
          <p className="text-gray-400 text-sm">Economia Acumulada em Metas</p>
          <h2 className="text-4xl font-bold tracking-tight">
            {formatCurrency(goals?.reduce((acc, m) => acc + (m.gastoAtual || 0), 0) || 0)}
          </h2>
        </div>
      </header>

      {/* LISTA DE METAS */}
      <main className="px-6 -mt-12 relative z-20 space-y-4">
        {goals?.length === 0 ? (
          <div className="bg-white p-12 rounded-[2.5rem] border-2 border-dashed border-gray-200 text-center shadow-sm">
            <p className="text-gray-500 font-medium font-sans">Nenhuma meta definida ainda.</p>
          </div>
        ) : (
          goals?.map((meta) => {
            const progresso = Math.min((meta.gastoAtual / meta.valor) * 100, 100);
            return (
              <div key={meta.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl bg-gray-50 w-12 h-12 flex items-center justify-center rounded-2xl shadow-inner">
                      {meta.icone}
                    </span>
                    <div>
                      <h4 className="font-bold text-gray-900">{meta.nome}</h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                        Prazo: {meta.prazo} {meta.unidade}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => { setSelectedGoalId(meta.id); setShowAddValueModal(true); }}
                      className="p-2 bg-black text-white rounded-full hover:scale-110 transition-transform shadow-lg"
                    >
                      <Plus size={16} />
                    </button>
                    <button onClick={() => removeGoal(meta.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="text-gray-900">{formatCurrency(meta.gastoAtual)}</span>
                    <span className="text-gray-400">Objetivo: {formatCurrency(meta.valor)}</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className={`h-full transition-all duration-1000 ${progresso === 100 ? 'bg-green-500' : 'bg-black'}`} 
                      style={{ width: `${progresso}%` }} 
                    />
                  </div>
                  <p className="text-[9px] text-right font-bold text-gray-400">{progresso.toFixed(1)}% Completo</p>
                </div>
              </div>
            );
          })
        )}
      </main>

      {/* MODAL ADICIONAR VALOR */}
      {showAddValueModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-6">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 animate-in zoom-in-95 duration-200 shadow-2xl">
            <h3 className="text-xl font-black mb-6 text-center text-gray-900">Adicionar Valor</h3>
            <form onSubmit={handleAddValue} className="space-y-4">
              <input 
                type="number" step="0.01" autoFocus placeholder="R$ 0,00" 
                value={amountToAdd} onChange={e => setAmountToAdd(e.target.value)}
                className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-black outline-none font-bold text-center text-2xl text-gray-900"
              />
              <div className="flex gap-3 mt-6">
                <button 
                  type="button" 
                  onClick={() => setShowAddValueModal(false)} 
                  className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-bold hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-4 bg-black text-white rounded-2xl font-bold hover:bg-gray-800 shadow-lg active:scale-95 transition-all"
                >
                  Confirmar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CRIAR META */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 animate-in slide-in-from-bottom duration-300">
             <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-gray-900">Nova Meta</h3>
              <button onClick={() => setShowModal(false)} className="p-2 bg-gray-100 rounded-full text-gray-400 hover:text-black transition-colors">
                <X size={20}/>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Descrição</label>
                <input 
                  type="text" placeholder="Ex: Viagem, Casa Própria..." 
                  value={nome} onChange={e => setNome(e.target.value)}
                  className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-black outline-none font-medium placeholder:text-gray-300 transition-all text-gray-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Valor do Objetivo</label>
                  <input 
                    type="number" placeholder="0.00" 
                    value={valor} onChange={e => setValor(e.target.value)}
                    className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-black outline-none font-medium text-gray-900"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Tempo</label>
                  <div className="flex bg-gray-50 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-black">
                    <input 
                      type="number" placeholder="12" 
                      value={prazo} onChange={e => setPrazo(e.target.value)}
                      className="w-1/2 p-4 bg-transparent border-none outline-none font-medium text-gray-900"
                    />
                    <select 
                      value={unidade} onChange={e => setUnidade(e.target.value as 'meses' | 'anos')}
                      className="w-1/2 bg-transparent border-none text-[10px] font-bold uppercase outline-none px-2 text-gray-900"
                    >
                      <option value="meses">Meses</option>
                      <option value="anos">Anos</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Ícone</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {iconesDisponiveis.map(i => (
                    <button 
                      key={i} type="button" onClick={() => setIcone(i)}
                      className={`text-2xl w-11 h-11 flex items-center justify-center rounded-xl transition-all ${icone === i ? 'bg-black scale-110 shadow-lg' : 'bg-gray-50 hover:bg-gray-100'}`}
                    >
                      {i}
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" className="w-full py-5 bg-black text-white rounded-[2rem] font-bold shadow-xl active:scale-95 transition-transform mt-4 hover:bg-gray-800">
                Criar Meta
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}