import Link from "next/link";
import { getJogadores } from "@/lib/jogadores";

export default async function JogadoresPage() {
  const jogadores = await getJogadores();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Jogadores</h1>
        <Link
          href="/jogadores/novo"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
        >
          <i className="fas fa-plus-circle mr-2"></i> Novo Jogador
        </Link>
      </div>

      {jogadores.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-gray-500">Nenhum jogador cadastrado.</p>
          <p className="mt-2">Clique em "Novo Jogador" para começar.</p>
        </div>
      ) : (
        <div>
          {/* Visualização em tabela apenas para desktop */}
          <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Nome
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Chave Pix
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Torneios
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Vitórias
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {jogadores.map((jogador) => (
                  <tr key={jogador.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {jogador.nome}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-500">
                        {jogador.chavePix || "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-500">
                        {jogador.torneios?.length || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-500">
                        {jogador.vitoriasP1?.length || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/jogadores/${jogador.id}`}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Ver
                      </Link>
                      <Link
                        href={`/jogadores/editar/${jogador.id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Editar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Visualização em cards para mobile */}
          <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
            {jogadores.map((jogador) => (
              <div
                key={jogador.id}
                className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {jogador.nome}
                  </h3>
                  {jogador.vitoriasP1?.length > 0 && (
                    <span className="text-yellow-500">
                      <i className="fas fa-trophy"></i>{" "}
                      {jogador.vitoriasP1?.length || 0}
                    </span>
                  )}
                </div>

                <div className="mt-2 text-sm text-gray-600">
                  <div className="flex items-center mb-1">
                    <i className="fas fa-money-bill-wave text-green-500 w-5"></i>
                    <span className="ml-2 truncate">
                      {jogador.chavePix || "Sem chave PIX"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-gamepad text-blue-500 w-5"></i>
                    <span className="ml-2">
                      Torneios: {jogador.torneios?.length || 0}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex justify-end space-x-2">
                  <Link
                    href={`/jogadores/${jogador.id}`}
                    className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm hover:bg-blue-200"
                  >
                    <i className="fas fa-eye mr-1"></i> Ver
                  </Link>
                  <Link
                    href={`/jogadores/editar/${jogador.id}`}
                    className="inline-flex items-center px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-sm hover:bg-indigo-200"
                  >
                    <i className="fas fa-edit mr-1"></i> Editar
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
