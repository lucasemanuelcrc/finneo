"use client"; //

import React, { useState } from 'react';
import { Target, Plus, Trash2, Calendar, History } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { useFinance, Goal } from '@/hooks/useFinance';
import { formatCurrency } from '@/lib/utils';

export default function TelaPlanos() { // Alterado para export default para evitar erro de tipo undefined
  const { goals, addGoal, removeGoal, updateGoalAmount } = useFinance();
  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [amountToAdd, setAmountToAdd] = useState('');

  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalValue, setNewGoalValue] = useState('');

  const handleCreateGoal = () => {
    if (!newGoalName || !newGoalValue) return;
    addGoal({
      nome: newGoalName,
      valor: Number(newGoalValue),
      prazo: 12,
      unidade: 'meses',
      icone: 'Target'
    });
    setNewGoalName('');
    setNewGoalValue('');
    setIsAddOpen(false);
  };

  const handleAddMoney = () => {
    if (!selectedGoal || !amountToAdd) return;
    updateGoalAmount(selectedGoal.id, Number(amountToAdd));
    setAmountToAdd('');
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Minhas Metas</h2>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" /> Nova Meta
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Nova Meta</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <Input 
                placeholder="Nome da meta (ex: Viagem)" 
                value={newGoalName}
                onChange={(e) => setNewGoalName(e.target.value)}
              />
              <Input 
                type="number" 
                placeholder="Valor total (ex: 5000)" 
                value={newGoalValue}
                onChange={(e) => setNewGoalValue(e.target.value)}
              />
              <Button onClick={handleCreateGoal} className="w-full bg-blue-600">Criar Meta</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {goals.length === 0 ? (
          <div className="text-center py-10 text-gray-500 bg-white rounded-xl border border-dashed">
            <Target className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>Nenhuma meta criada ainda.</p>
          </div>
        ) : (
          goals.map((goal) => {
            const percentage = Math.min(100, Math.round((goal.gastoAtual / goal.valor) * 100));
            
            return (
              <Card 
                key={goal.id} 
                className="cursor-pointer hover:shadow-md transition-shadow relative overflow-hidden"
                onClick={() => setSelectedGoal(goal)}
              >
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                        <Target className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{goal.nome}</h3>
                        <p className="text-sm text-gray-500">
                          Meta: {formatCurrency(goal.valor)}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      {percentage}%
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Guardado</span>
                      <span className="font-medium text-gray-900">{formatCurrency(goal.gastoAtual)}</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      <Dialog open={!!selectedGoal} onOpenChange={(open) => !open && setSelectedGoal(null)}>
        <DialogContent className="max-w-md">
          {selectedGoal && (
            <>
              <DialogHeader>
                <DialogTitle className="flex justify-between items-center">
                  <span>{selectedGoal.nome}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeGoal(selectedGoal.id);
                      setSelectedGoal(null);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </DialogTitle>
              </DialogHeader>

              <div className="bg-gray-50 p-4 rounded-lg space-y-3 mb-4">
                <label className="text-sm font-medium text-gray-700">Adicionar valor à meta</label>
                <div className="flex gap-2">
                  <Input 
                    type="number" 
                    placeholder="R$ 0,00"
                    value={amountToAdd}
                    onChange={(e) => setAmountToAdd(e.target.value)}
                    className="bg-white"
                  />
                  <Button onClick={handleAddMoney} className="bg-green-600 hover:bg-green-700">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                  <History className="w-4 h-4" /> Histórico de Depósitos
                </h4>
                
                <div className="max-h-[200px] overflow-y-auto space-y-2 pr-1">
                  {selectedGoal.history && selectedGoal.history.length > 0 ? (
                    selectedGoal.history.map((item) => (
                      <div key={item.id} className="flex justify-between items-center text-sm p-2 bg-white border rounded-md">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {new Date(item.date).toLocaleDateString('pt-BR', {
                              day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute:'2-digit'
                            })}
                          </span>
                        </div>
                        <span className="font-semibold text-green-600">
                          + {formatCurrency(item.amount)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400 text-center py-4">Nenhum depósito registrado.</p>
                  )}
                </div>
              </div>

              <div className="pt-4 mt-2 border-t flex justify-between items-center">
                 <span className="text-gray-500">Total Acumulado</span>
                 <span className="text-xl font-bold text-gray-900">{formatCurrency(selectedGoal.gastoAtual)}</span>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}