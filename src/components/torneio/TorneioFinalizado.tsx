"use client";

import Link from "next/link";
import type { Jogador, Torneio, JogadorTorneio } from "@prisma/client";

type TorneioComRelacoes = Torneio & {
  jogadores: (JogadorTorneio & {
    jogador: Jogador;
  })[];
  primeiroColocado: Jogador | null;
  segundoColocado: Jogador | null;
};

interface TorneioFinalizadoProps {
  torneio: TorneioComRelacoes;
}

export default function TorneioFinalizado({ torneio }: TorneioFinalizadoProps) {
  // Calcular estatísticas
  const totalJogadores = torneio.jogadores.length;
  const totalReentradas = torneio.jogadores.reduce(
    (sum, jt) => sum + jt.reentradas,
    0
  );
  const valorTotal = (totalJogadores + totalReentradas) * torneio.buyIn;

  // Premios (70% para o primeiro, 30% para o segundo)
  const premioP1 = valorTotal * 0.7;
  const premioP2 = valorTotal * 0.3;

  return (
    <div className="space-y-6">
      <div className="bg-green-600 text-white p-4 rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-2">Torneio Finalizado</h2>
        <p className="opacity-90">
          {new Date(torneio.data).toLocaleDateString("pt-BR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="bg-blue-600 text-white p-4">
            <h3 className="text-xl font-bold">Detalhes do Torneio</h3>
          </div>
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Buy-in</p>
                <p className="font-semibold">
                  R$ {torneio.buyIn.toFixed(2).replace(".", ",")}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Valor Total</p>
                <p className="font-semibold">
                  R$ {valorTotal.toFixed(2).replace(".", ",")}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Jogadores</p>
                <p className="font-semibold">{totalJogadores}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Reentradas</p>
                <p className="font-semibold">{totalReentradas}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Blinds Iniciais</p>
              <p className="font-semibold">
                SB: {torneio.smallBlindInicial} / BB: {torneio.bigBlindInicial}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="bg-yellow-600 text-white p-4">
            <h3 className="text-xl font-bold">Resultado</h3>
          </div>
          <div className="p-4 space-y-6">
            {torneio.primeiroColocado && (
              <div className="flex items-center">
                <div className="bg-yellow-100 rounded-full w-10 h-10 flex items-center justify-center text-yellow-800 font-bold mr-3">
                  1º
                </div>
                <div className="flex-grow">
                  <p className="font-bold text-lg">
                    {torneio.primeiroColocado.nome}
                  </p>
                  <p className="text-sm text-gray-500">
                    Prêmio: R$ {premioP1.toFixed(2).replace(".", ",")}
                  </p>
                </div>
              </div>
            )}

            {torneio.segundoColocado && (
              <div className="flex items-center">
                <div className="bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center text-gray-800 font-bold mr-3">
                  2º
                </div>
                <div className="flex-grow">
                  <p className="font-bold text-lg">
                    {torneio.segundoColocado.nome}
                  </p>
                  <p className="text-sm text-gray-500">
                    Prêmio: R$ {premioP2.toFixed(2).replace(".", ",")}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="bg-gray-600 text-white p-4">
          <h3 className="text-xl font-bold">Participantes</h3>
        </div>
        <div className="p-4">
          <div className="overflow-auto">
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
                    Reentradas
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Total Pago
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {torneio.jogadores.map((jogadorTorneio) => (
                  <tr
                    key={jogadorTorneio.jogadorId}
                    className={
                      jogadorTorneio.jogadorId === torneio.primeiroColocadoId
                        ? "bg-yellow-50"
                        : jogadorTorneio.jogadorId === torneio.segundoColocadoId
                        ? "bg-gray-50"
                        : ""
                    }
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {jogadorTorneio.jogador.nome}
                        {jogadorTorneio.jogadorId ===
                          torneio.primeiroColocadoId && (
                          <span className="ml-2 text-yellow-600 text-xs">
                            1º lugar
                          </span>
                        )}
                        {jogadorTorneio.jogadorId ===
                          torneio.segundoColocadoId && (
                          <span className="ml-2 text-gray-600 text-xs">
                            2º lugar
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {jogadorTorneio.reentradas}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      R${" "}
                      {((jogadorTorneio.reentradas + 1) * torneio.buyIn)
                        .toFixed(2)
                        .replace(".", ",")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Link
          href="/torneios"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Voltar para Lista de Torneios
        </Link>
      </div>
    </div>
  );
}
