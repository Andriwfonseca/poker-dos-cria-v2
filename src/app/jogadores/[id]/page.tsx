import { getJogadorById } from "@/lib/jogadores";
import { notFound } from "next/navigation";
import Link from "next/link";

interface PageParams {
  params: {
    id: string;
  };
}

export default async function JogadorPage({ params }: PageParams) {
  const id = parseInt(params.id);
  const jogador = await getJogadorById(id);

  if (!jogador) {
    notFound();
  }

  // Ordenar torneios por data (mais recente primeiro)
  const torneiosOrdenados = [...jogador.torneios].sort(
    (a, b) =>
      new Date(b.torneio.data).getTime() - new Date(a.torneio.data).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">{jogador.nome}</h1>
        <div className="flex gap-2">
          <Link
            href={`/jogadores/editar/${jogador.id}`}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 flex items-center"
          >
            <i className="fas fa-edit mr-2"></i> Editar
          </Link>
          <Link
            href="/jogadores"
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 flex items-center"
          >
            <i className="fas fa-arrow-left mr-2"></i> Voltar
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card de informações básicas */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <i className="fas fa-user-circle text-blue-600 mr-2"></i>{" "}
            Informações Pessoais
          </h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Nome</p>
              <p className="font-medium">{jogador.nome}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Chave Pix</p>
              <p className="font-medium">
                {jogador.chavePix || "Não informada"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Cadastrado em</p>
              <p className="font-medium">
                {new Date(jogador.createdAt).toLocaleDateString("pt-BR")}
              </p>
            </div>
          </div>
        </div>

        {/* Card de estatísticas */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <i className="fas fa-chart-line text-green-600 mr-2"></i>{" "}
            Estatísticas
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-500">Torneios</p>
              <p className="text-2xl font-bold text-blue-600">
                {jogador.torneios.length}
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-500">Pontos</p>
              <p className="text-2xl font-bold text-yellow-600">
                {jogador.vitoriasP1.length * 3 + jogador.vitoriasP2.length}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center flex flex-col items-center">
              <div className="flex items-center">
                <i className="fas fa-trophy text-yellow-500 mr-1"></i>
                <p className="text-sm text-gray-500">1° Lugar</p>
              </div>
              <p className="text-2xl font-bold text-green-600">
                {jogador.vitoriasP1.length}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center flex flex-col items-center">
              <div className="flex items-center">
                <i className="fas fa-medal text-gray-400 mr-1"></i>
                <p className="text-sm text-gray-500">2° Lugar</p>
              </div>
              <p className="text-2xl font-bold text-gray-600">
                {jogador.vitoriasP2.length}
              </p>
            </div>
          </div>
        </div>

        {/* Card de performance */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <i className="fas fa-percentage text-purple-600 mr-2"></i>{" "}
            Performance
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">
                Taxa de Vitória (1º lugar)
              </p>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-yellow-500 h-4 rounded-full"
                  style={{
                    width: `${
                      jogador.torneios.length > 0
                        ? (jogador.vitoriasP1.length /
                            jogador.torneios.length) *
                          100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
              <p className="text-right text-sm mt-1">
                {jogador.torneios.length > 0
                  ? (
                      (jogador.vitoriasP1.length / jogador.torneios.length) *
                      100
                    ).toFixed(1)
                  : 0}
                %
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">
                Taxa de Pódio (1º ou 2º)
              </p>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-blue-500 h-4 rounded-full"
                  style={{
                    width: `${
                      jogador.torneios.length > 0
                        ? ((jogador.vitoriasP1.length +
                            jogador.vitoriasP2.length) /
                            jogador.torneios.length) *
                          100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
              <p className="text-right text-sm mt-1">
                {jogador.torneios.length > 0
                  ? (
                      ((jogador.vitoriasP1.length + jogador.vitoriasP2.length) /
                        jogador.torneios.length) *
                      100
                    ).toFixed(1)
                  : 0}
                %
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Histórico de torneios */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <i className="fas fa-history text-indigo-600 mr-2"></i> Histórico de
          Torneios
        </h2>

        {torneiosOrdenados.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            Este jogador ainda não participou de nenhum torneio.
          </p>
        ) : (
          <div className="overflow-auto">
            {/* Versão desktop */}
            <table className="hidden md:table min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Torneio
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Data
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Resultado
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Reentradas
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {torneiosOrdenados.map((torneioJogador) => {
                  const torneio = torneioJogador.torneio;
                  const isPrimeiroColocado =
                    torneio.primeiroColocadoId === jogador.id;
                  const isSegundoColocado =
                    torneio.segundoColocadoId === jogador.id;

                  return (
                    <tr key={torneio.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          href={`/torneios/${torneio.id}`}
                          className="font-medium text-blue-600 hover:text-blue-800"
                        >
                          {torneio.nome}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(torneio.data).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            torneio.status === "FINALIZADO"
                              ? "bg-green-100 text-green-800"
                              : torneio.status === "EM_ANDAMENTO"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {torneio.status === "FINALIZADO"
                            ? "Finalizado"
                            : torneio.status === "EM_ANDAMENTO"
                            ? "Em Andamento"
                            : "Configurado"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isPrimeiroColocado ? (
                          <span className="inline-flex items-center text-yellow-500">
                            <i className="fas fa-trophy mr-1"></i> 1º Lugar
                          </span>
                        ) : isSegundoColocado ? (
                          <span className="inline-flex items-center text-gray-500">
                            <i className="fas fa-medal mr-1"></i> 2º Lugar
                          </span>
                        ) : torneio.status === "FINALIZADO" ? (
                          "Participante"
                        ) : (
                          "Em andamento"
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {torneioJogador.reentradas}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Versão mobile */}
            <div className="md:hidden space-y-4">
              {torneiosOrdenados.map((torneioJogador) => {
                const torneio = torneioJogador.torneio;
                const isPrimeiroColocado =
                  torneio.primeiroColocadoId === jogador.id;
                const isSegundoColocado =
                  torneio.segundoColocadoId === jogador.id;

                return (
                  <div key={torneio.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <Link
                        href={`/torneios/${torneio.id}`}
                        className="font-medium text-blue-600 hover:text-blue-800"
                      >
                        {torneio.nome}
                      </Link>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          torneio.status === "FINALIZADO"
                            ? "bg-green-100 text-green-800"
                            : torneio.status === "EM_ANDAMENTO"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {torneio.status === "FINALIZADO"
                          ? "Finalizado"
                          : torneio.status === "EM_ANDAMENTO"
                          ? "Em Andamento"
                          : "Configurado"}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 mb-2">
                      {new Date(torneio.data).toLocaleDateString("pt-BR")}
                    </div>
                    <div className="flex justify-between">
                      <div>
                        {isPrimeiroColocado ? (
                          <span className="inline-flex items-center text-yellow-500">
                            <i className="fas fa-trophy mr-1"></i> 1º Lugar
                          </span>
                        ) : isSegundoColocado ? (
                          <span className="inline-flex items-center text-gray-500">
                            <i className="fas fa-medal mr-1"></i> 2º Lugar
                          </span>
                        ) : torneio.status === "FINALIZADO" ? (
                          "Participante"
                        ) : (
                          "Em andamento"
                        )}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Reentradas:</span>{" "}
                        {torneioJogador.reentradas}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
