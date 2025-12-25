import TelaExtrato from "@/components/dashboard/TelaExtrato";

interface PageProps {
  params: {
    id: string;
  };
}

export default function Page({ params }: PageProps) {
  return <TelaExtrato accountId={params.id} />;
}