import AppNavigation from "@/components/ui/AppNavigation";

export default function LayoutInterno({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* O conteúdo da página renderiza aqui */}
      {children}

      {/* Navegação Fixa Inferior */}
      <AppNavigation />
    </div>
  );
}