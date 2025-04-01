import { getJogadoresRanking } from "@/lib/jogadores";
import Link from "next/link";

export default async function RankingPage() {
  const jogadores = await getJogadoresRanking();

  // Função para retornar os ícones de posição de acordo com a colocação
  const getPosicaoIcon = (posicao: number) => {
    switch (posicao) {
      case 1:
        return <i className="fas fa-trophy text-yellow-500 text-xl"></i>;
      case 2:
        return <i className="fas fa-medal text-gray-400 text-xl"></i>;
      case 3:
        return <i className="fas fa-medal text-yellow-700 text-xl"></i>;
      default:
        return <span className="font-medium">{posicao}º</span>;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Ranking de Jogadores</h1>

      {/* Visualização em tabela para desktop */}
      <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Posição
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Jogador
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Pontos
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                1º Colocado
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                2º Colocado
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Torneios
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {jogadores.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  Nenhum jogador no ranking ainda. Adicione jogadores e realize
                  torneios.
                </td>
              </tr>
            ) : (
              jogadores.map((jogador, index) => (
                <tr
                  key={jogador.id}
                  className={index < 3 ? "bg-yellow-50" : ""}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 flex items-center">
                      {getPosicaoIcon(index + 1)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">
                      {jogador.nome}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-semibold">
                      {jogador.pontos}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {jogador.vitoriasP1.length}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {jogador.vitoriasP2.length}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {jogador.torneiosParticipados}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Visualização em cards para mobile */}
      <div className="md:hidden space-y-4">
        {jogadores.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <p className="text-gray-500">
              Nenhum jogador no ranking ainda. Adicione jogadores e realize
              torneios.
            </p>
          </div>
        ) : (
          jogadores.map((jogador, index) => (
            <div
              key={jogador.id}
              className={`bg-white rounded-lg shadow p-4 ${
                index < 3
                  ? `border-l-4 ${
                      index === 0
                        ? "border-yellow-500"
                        : index === 1
                        ? "border-gray-400"
                        : "border-yellow-700"
                    }`
                  : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      {getPosicaoIcon(index + 1)}
                    </div>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">
                      {jogador.nome}
                    </p>
                    <p className="text-lg font-bold text-blue-600">
                      {jogador.pontos} pts
                    </p>
                  </div>
                </div>
                <Link
                  href={`/jogadores/${jogador.id}`}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <i className="fas fa-user-circle text-xl"></i>
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                <div className="bg-gray-50 p-2 rounded">
                  <p className="text-xs text-gray-500">Torneios</p>
                  <p className="font-medium">{jogador.torneiosParticipados}</p>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <p className="text-xs text-gray-500">
                    <i className="fas fa-trophy text-yellow-500 text-sm mr-1"></i>
                    1º lugar
                  </p>
                  <p className="font-medium">{jogador.vitoriasP1.length}</p>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <p className="text-xs text-gray-500">
                    <i className="fas fa-medal text-gray-400 text-sm mr-1"></i>
                    2º lugar
                  </p>
                  <p className="font-medium">{jogador.vitoriasP2.length}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">Sistema de Pontuação</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            1º Lugar: 3 pontos{" "}
            <i className="fas fa-trophy text-yellow-500 ml-2"></i>
          </li>
          <li>
            2º Lugar: 1 ponto{" "}
            <i className="fas fa-medal text-gray-400 ml-2"></i>
          </li>
        </ul>
      </div>
    </div>
  );
}
