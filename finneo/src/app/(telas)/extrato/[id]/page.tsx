import TelaExtrato from "@/components/dashboard/TelaExtrato";

// A tipagem correta para Next.js 15 é uma Promise
interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  // É obrigatório aguardar a resolução dos parâmetros
  const { id } = await params; 
  
  return <TelaExtrato accountId={id} />;
}