"use client"; // este arquivo precisa rodar no navegador do cliente pois tem interações

import { useState } from "react";
import { useRouter } from "next/navigation"; // IMPORTANTE: Import do hook de navegação
import { Mail, Eye, EyeOff, Apple } from "lucide-react";

// ícone do google (svg simples para não precisar de lib extra agora)
const IconeGoogle = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

export default function FormularioLogin() {
  // estado para mostrar ou esconder a senha
  const [mostrarSenha, setMostrarSenha] = useState(false);
  
  // hook de navegação do Next.js
  const router = useRouter();

  // Função para lidar com o envio do formulário
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você adicionaria a lógica de validação do login
    
    // Redireciona para a rota solicitada
    router.push('/inicio');
  };

  return (
    // o card principal que envolve o formulário (borda arredondada no topo estilo bottom sheet)
    <div className="bg-slate-900/90 backdrop-blur-xl border-t border-slate-800 rounded-t-[2.5rem] p-8 pb-10 shadow-2xl w-full animate-in slide-in-from-bottom-10 duration-500">
      
      {/* textos de boas vindas */}
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-semibold text-white mb-2">Bem-vindo de volta</h2>
        <p className="text-slate-400 text-sm">Faça login para gerenciar suas finanças</p>
      </div>

      {/* Adicionei a função handleLogin aqui no onSubmit */}
      <form className="space-y-5" onSubmit={handleLogin}>
        
        {/* grupo do input de email */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-300 ml-1">Email</label>
          <div className="relative group">
            <input
              type="email"
              placeholder="seu@email.com"
              className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-4 px-5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
            {/* ícone posicionado dentro do input à direita */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors">
              <Mail size={20} />
            </div>
          </div>
        </div>

        {/* grupo do input de senha */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-300 ml-1">Senha</label>
          <div className="relative group">
            <input
              type={mostrarSenha ? "text" : "password"}
              placeholder="••••••••"
              className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-4 px-5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
            {/* botãozinho de olho para ver a senha */}
            <button
              type="button"
              onClick={() => setMostrarSenha(!mostrarSenha)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
            >
              {mostrarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* botão principal de ação - azul elegante */}
        <button 
          type="submit" // Garante que o botão dispare o onSubmit do form
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-900/20 active:scale-[0.98] transition-all mt-4"
        >
          Entrar no Finneo
        </button>

        {/* link de esqueceu a senha */}
        <div className="text-center">
          <a href="#" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">
            Esqueceu sua senha?
          </a>
        </div>

        <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-700"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-slate-900 px-2 text-slate-500">Ou continue com</span></div>
        </div>

        {/* botões sociais quadrados estilo a imagem */}
        <div className="flex gap-4 justify-center">
          <button type="button" className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-700 hover:bg-slate-700 transition-colors">
            <IconeGoogle />
          </button>
          <button type="button" className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-700 hover:bg-slate-700 transition-colors text-white">
            <Apple size={24} fill="currentColor" />
          </button>
        </div>

      </form>
    </div>
  );
}