import { getJogadoresRanking } from "@/lib/jogadores";
import { getJogadoresCachetaRanking } from "@/lib/jogadores";
import Link from "next/link";

export default async function RankingPage() {
  const jogadores = await getJogadoresRanking();
  const jogadoresCacheta = await getJogadoresCachetaRanking();

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

      {/* Ranking de Poker */}
      <div className="bg-blue-700 text-white p-4 rounded-t-lg">
        <h2 className="text-xl font-bold flex items-center">
          <i className="fas fa-trophy mr-2"></i> Ranking de Poker
        </h2>
      </div>

      {/* Visualização em tabela para desktop */}
      <div className="hidden md:block bg-white rounded-b-lg shadow overflow-hidden">
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
        <h2 className="text-lg font-semibold mb-2">
          Sistema de Pontuação - Poker
        </h2>
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

      {/* Ranking de Cacheta */}
      {jogadoresCacheta.length > 0 && (
        <>
          <div className="mt-10 bg-purple-700 text-white p-4 rounded-t-lg">
            <h2 className="text-xl font-bold flex items-center">
              <i className="fas fa-dice mr-2"></i> Ranking de Cacheta
            </h2>
          </div>

          {/* Visualização em tabela para desktop */}
          <div className="hidden md:block bg-white rounded-b-lg shadow overflow-hidden">
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
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Pontos
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Vitórias
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Jogos
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Reentradas
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Prêmios
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {jogadoresCacheta.map((jogador, index) => (
                  <tr
                    key={jogador.jogador.id}
                    className={index < 3 ? "bg-purple-50" : ""}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 flex items-center">
                        {getPosicaoIcon(index + 1)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">
                        {jogador.jogador.nome}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-900 font-semibold">
                        {jogador.pontos}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-900">
                        {jogador.vitorias}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-900">
                        {jogador.totalJogos}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-900">
                        {jogador.totalReentradas}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-900">
                        {jogador.totalPremio > 0
                          ? `R$ ${jogador.totalPremio
                              .toFixed(2)
                              .replace(".", ",")}`
                          : "-"}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Visualização em cards para mobile */}
          <div className="md:hidden space-y-4">
            {jogadoresCacheta.map((jogador, index) => (
              <div
                key={jogador.jogador.id}
                className={`bg-white rounded-lg shadow p-4 ${
                  index < 3
                    ? `border-l-4 ${
                        index === 0
                          ? "border-purple-500"
                          : index === 1
                          ? "border-purple-300"
                          : "border-purple-200"
                      }`
                    : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 mr-3">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                        {getPosicaoIcon(index + 1)}
                      </div>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-900">
                        {jogador.jogador.nome}
                      </p>
                      <p className="text-lg font-bold text-purple-600">
                        {jogador.pontos} pts
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/jogadores/${jogador.jogador.id}`}
                    className="text-purple-500 hover:text-purple-700"
                  >
                    <i className="fas fa-user-circle text-xl"></i>
                  </Link>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                  <div className="bg-gray-50 p-2 rounded">
                    <p className="text-xs text-gray-500">Jogos</p>
                    <p className="font-medium">{jogador.totalJogos}</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <p className="text-xs text-gray-500">
                      <i className="fas fa-trophy text-purple-500 text-sm mr-1"></i>
                      Vitórias
                    </p>
                    <p className="font-medium">{jogador.vitorias}</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <p className="text-xs text-gray-500">
                      <i className="fas fa-redo text-red-400 text-sm mr-1"></i>
                      Reentradas
                    </p>
                    <p className="font-medium">{jogador.totalReentradas}</p>
                  </div>
                </div>

                {jogador.totalPremio > 0 && (
                  <div className="mt-2 text-right">
                    <span className="text-xs text-gray-500">
                      Total em prêmios:
                    </span>
                    <p className="font-medium text-green-600">
                      R$ {jogador.totalPremio.toFixed(2).replace(".", ",")}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">
              Sistema de Pontuação - Cacheta
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Vitória: 5 pontos{" "}
                <i className="fas fa-trophy text-purple-500 ml-2"></i>
              </li>
              <li>
                Terminar com pontos: 1 ponto{" "}
                <i className="fas fa-check-circle text-green-500 ml-2"></i>
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
