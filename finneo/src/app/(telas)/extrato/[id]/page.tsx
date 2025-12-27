import TelaExtrato from "@/components/dashboard/TelaExtrato";

interface PageProps {
  // Em Next.js 15, params é tipado como Promise
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  // Obrigatório usar await para extrair o ID nas rotas dinâmicas do Next.js 15
  const { id } = await params;

  return <TelaExtrato accountId={id} />;
}