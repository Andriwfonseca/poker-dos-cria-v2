import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-4">Bem-vindo ao Poker dos Cria</h1>
        <p className="text-xl mb-8">
          Sistema completo para gerenciamento de torneios de poker
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/jogadores" className="block">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-bold mb-3 text-blue-700">Jogadores</h2>
            <p>
              Gerencie os jogadores, cadastre novos e veja informações
              detalhadas.
            </p>
          </div>
        </Link>

        <Link href="/torneios" className="block">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-bold mb-3 text-blue-700">Torneios</h2>
            <p>
              Crie e gerencie torneios, configure blinds e acompanhe em tempo
              real.
            </p>
          </div>
        </Link>

        <Link href="/ranking" className="block">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-bold mb-3 text-blue-700">Ranking</h2>
            <p>
              Veja o ranking atual dos jogadores com base no desempenho nos
              torneios.
            </p>
          </div>
        </Link>
      </div>

      <section className="bg-white p-6 rounded-lg shadow-md mt-8">
        <h2 className="text-2xl font-bold mb-4">Próximos Torneios</h2>
        <p className="text-gray-600 italic">
          Nenhum torneio agendado. Crie um novo torneio para começar!
        </p>
        <div className="mt-4">
          <Link
            href="/torneios/novo"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Criar Novo Torneio
          </Link>
        </div>
      </section>
    </div>
  );
}
