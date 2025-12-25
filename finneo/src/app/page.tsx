import { redirect } from 'next/navigation';

export default function RootPage() {
  // Redireciona automaticamente para a tela de início dentro do grupo (telas)
  redirect('/inicio');
}