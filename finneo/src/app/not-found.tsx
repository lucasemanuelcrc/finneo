import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-900 px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Página não encontrada</h2>
            <p className="text-gray-600 mb-8 text-center text-lg">
                Ops! Não conseguimos encontrar a página que você está procurando.
            </p>
            <Link
                href="/"
                className="px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
                Voltar para o início
            </Link>
        </div>
    )
}
