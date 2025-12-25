import FormularioLogin from "@/components/auth/formularioLogin";
// importamos o ícone de cifrão da biblioteca lucide
import { ArrowLeft, DollarSign } from "lucide-react"; 
import Link from "next/link";

export default function PaginaLogin() {
  return (
    // container principal que segura toda a tela, com altura total do celular
    <div className="relative min-h-screen w-full bg-slate-950 flex flex-col items-center justify-between overflow-hidden">
      
      {/* efeito de fundo para dar aquela elegância (luz azulada no topo) */}
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-blue-900/20 blur-[100px] rounded-full pointer-events-none" />

      {/* cabeçalho superior com botão de voltar */}
      <header className="w-full p-6 flex items-center justify-between z-10 relative">
        <Link 
          href="/" 
          className="w-12 h-12 rounded-full bg-slate-900/80 border border-slate-800 flex items-center justify-center text-white hover:bg-slate-800 transition-colors"
        >
          {/* ícone de seta voltando */}
          <ArrowLeft size={20} />
        </Link>
      </header>

      {/* área do logo central com o novo Cifrão */}
      <div className="flex-1 flex flex-col items-center justify-center z-10 -mt-20">
        
        {/* container do logo girado em 45 graus */}
        <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center transform rotate-45 mb-6 shadow-[0_0_40px_-10px_rgba(37,99,235,0.6)] border border-blue-400/30">
           {/* o cifrão precisa girar -45 graus para ficar em pé visualmente */}
           <DollarSign className="text-white w-12 h-12 transform -rotate-45 drop-shadow-md" strokeWidth={2.5} />
        </div>
        
        <h1 className="text-3xl font-bold text-white tracking-tight">Finneo</h1>
        <p className="text-slate-400 text-sm mt-1">Gestão inteligente.</p>
      </div>

      {/* aqui chamamos o formulário que cuida dos inputs */}
      <div className="w-full z-20">
        <FormularioLogin />
      </div>
    </div>
  );
}