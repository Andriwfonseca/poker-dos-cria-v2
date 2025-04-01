"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Jogador, Torneio, JogadorTorneio } from "@prisma/client";

type TorneioComRelacoes = Torneio & {
  jogadores: (JogadorTorneio & {
    jogador: Jogador;
  })[];
};

interface ConfiguracaoTorneioProps {
  torneio: TorneioComRelacoes;
  jogadores: Jogador[];
}

export default function ConfiguracaoTorneio({
  torneio,
  jogadores,
}: ConfiguracaoTorneioProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedJogador, setSelectedJogador] = useState("");
  const [erro, setErro] = useState("");

  const jogadoresDisponiveis = jogadores.filter(
    (jogador) => !torneio.jogadores.some((jt) => jt.jogadorId === jogador.id)
  );

  const handleAddJogador = async () => {
    if (!selectedJogador) return;

    setIsLoading(true);
    setErro("");

    try {
      const response = await fetch(`/api/torneios/${torneio.id}/jogadores`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jogadorId: parseInt(selectedJogador) }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro ao adicionar jogador");
      }

      router.refresh();
      setSelectedJogador("");
    } catch (error) {
      setErro(
        error instanceof Error ? error.message : "Erro ao adicionar jogador"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveJogador = async (jogadorId: number) => {
    setIsLoading(true);
    setErro("");

    try {
      const response = await fetch(
        `/api/torneios/${torneio.id}/jogadores/${jogadorId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro ao remover jogador");
      }

      router.refresh();
    } catch (error) {
      setErro(
        error instanceof Error ? error.message : "Erro ao remover jogador"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleIniciarTorneio = async () => {
    if (torneio.jogadores.length < 2) {
      setErro("O torneio precisa ter pelo menos 2 jogadores para iniciar");
      return;
    }

    setIsLoading(true);
    setErro("");

    try {
      const response = await fetch(`/api/torneios/${torneio.id}/iniciar`, {
        method: "POST",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro ao iniciar torneio");
      }

      router.refresh();
    } catch (error) {
      setErro(
        error instanceof Error ? error.message : "Erro ao iniciar torneio"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Detalhes do Torneio</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">Buy-in</p>
            <p className="font-semibold">
              R$ {torneio.buyIn.toFixed(2).replace(".", ",")}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Tempo de Blind</p>
            <p className="font-semibold">{torneio.tempoBlind} minutos</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Blinds Iniciais</p>
            <p className="font-semibold">
              SB: {torneio.smallBlindInicial} / BB: {torneio.bigBlindInicial}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">
          Jogadores Inscritos ({torneio.jogadores.length})
        </h2>

        {erro && (
          <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-md">
            {erro}
          </div>
        )}

        <div className="flex items-end gap-2 mb-4">
          <div className="flex-grow">
            <label
              htmlFor="jogador"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Adicionar Jogador
            </label>
            <select
              id="jogador"
              value={selectedJogador}
              onChange={(e) => setSelectedJogador(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading || jogadoresDisponiveis.length === 0}
            >
              <option value="">Selecione um jogador</option>
              {jogadoresDisponiveis.map((jogador) => (
                <option key={jogador.id} value={jogador.id}>
                  {jogador.nome}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleAddJogador}
            disabled={isLoading || !selectedJogador}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
          >
            Adicionar
          </button>
        </div>

        {torneio.jogadores.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            Nenhum jogador inscrito no torneio
          </p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {torneio.jogadores.map((jogadorTorneio) => (
              <li
                key={jogadorTorneio.jogadorId}
                className="py-3 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{jogadorTorneio.jogador.nome}</p>
                  {jogadorTorneio.jogador.chavePix && (
                    <p className="text-sm text-gray-500">
                      Pix: {jogadorTorneio.jogador.chavePix}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleRemoveJogador(jogadorTorneio.jogadorId)}
                  disabled={isLoading}
                  className="text-red-600 hover:text-red-800"
                >
                  Remover
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={handleIniciarTorneio}
          disabled={isLoading || torneio.jogadores.length < 2}
          className="px-6 py-3 bg-green-600 text-white rounded-md text-lg hover:bg-green-700 disabled:bg-green-300"
        >
          Iniciar Torneio
        </button>
      </div>
    </div>
  );
}
