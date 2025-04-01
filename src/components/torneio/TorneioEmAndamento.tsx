"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import type { Jogador, Torneio, JogadorTorneio } from "@prisma/client";
import {
  converterValorParaNumero,
  converterNumeroParaValor,
  BLINDS,
} from "@/lib/blinds";

type TorneioComRelacoes = Torneio & {
  jogadores: (JogadorTorneio & {
    jogador: Jogador;
  })[];
};

interface TorneioEmAndamentoProps {
  torneio: TorneioComRelacoes;
  jogadores: Jogador[];
}

export default function TorneioEmAndamento({
  torneio,
  jogadores,
}: TorneioEmAndamentoProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [tempoRestante, setTempoRestante] = useState(torneio.tempoBlind * 60); // em segundos
  const [smallBlind, setSmallBlind] = useState<string>(
    torneio.smallBlindInicial
  );
  const [bigBlind, setBigBlind] = useState<string>(torneio.bigBlindInicial);

  // Encontrar o índice inicial dos blinds na tabela
  const getIndiceInicial = () => {
    const indice = BLINDS.findIndex(
      (blind) =>
        blind.small === torneio.smallBlindInicial &&
        blind.big === torneio.bigBlindInicial
    );
    return indice >= 0 ? indice : 0;
  };

  const [indiceBlind, setIndiceBlind] = useState<number>(getIndiceInicial());
  const [nivel, setNivel] = useState(1);
  const [mostrarReentrada, setMostrarReentrada] = useState(false);
  const [jogadorReentrada, setJogadorReentrada] = useState("");
  const [mostrarFinalizar, setMostrarFinalizar] = useState(false);
  const [primeiroColocado, setPrimeiroColocado] = useState("");
  const [segundoColocado, setSegundoColocado] = useState("");
  const [isPaused, setIsPaused] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const wakeLockRef = useRef<any>(null);
  const [isAlarming, setIsAlarming] = useState(false);

  // WakeLock API para manter a tela ligada
  useEffect(() => {
    const requestWakeLock = async () => {
      if ("wakeLock" in navigator) {
        try {
          // Solicitar um bloqueio de tela
          wakeLockRef.current = await (navigator as any).wakeLock.request(
            "screen"
          );

          console.log("WakeLock ativado");

          // Adicionar evento para reativar o WakeLock se o dispositivo for desbloqueado
          document.addEventListener("visibilitychange", async () => {
            if (
              document.visibilityState === "visible" &&
              wakeLockRef.current === null
            ) {
              wakeLockRef.current = await (navigator as any).wakeLock.request(
                "screen"
              );
            }
          });
        } catch (err) {
          console.error(`Erro ao solicitar WakeLock: ${err}`);
        }
      } else {
        console.log("WakeLock API não suportada neste navegador");
      }
    };

    requestWakeLock();

    // Limpeza ao desmontar o componente
    return () => {
      if (wakeLockRef.current) {
        wakeLockRef.current.release().then(() => {
          wakeLockRef.current = null;
          console.log("WakeLock liberado");
        });
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio("/alarm.wav");
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (isPaused || isAlarming) return;

    if (tempoRestante > 0) {
      const timer = setTimeout(() => {
        setTempoRestante((prev) => prev - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      // Tempo acabou, tocar alarme
      playAlarm();
    }
  }, [tempoRestante, isPaused, isAlarming]);

  const playAlarm = () => {
    setIsAlarming(true);

    if (audioRef.current) {
      audioRef.current.loop = true;
      audioRef.current
        .play()
        .catch((e) => console.error("Erro ao tocar som:", e));
    }

    // Em vez de alterar variáveis CSS globais que afetam toda a página
    // Vamos apenas aplicar estilos ao componente atual
    // As classes de animação já estão aplicadas no retorno do componente

    // Timeout para parar o alarme automaticamente após 30 segundos
    timeoutRef.current = setTimeout(() => {
      stopAlarm();
    }, 30000);
  };

  const stopAlarm = () => {
    setIsAlarming(false);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Como não estamos mais alterando variáveis CSS globais,
    // não precisamos restaurá-las aqui
  };

  const proximoNivel = () => {
    stopAlarm();
    setTempoRestante(torneio.tempoBlind * 60);
    setNivel((prev) => prev + 1);

    // Avançar para o próximo nível de blinds na tabela
    const novoIndice = Math.min(indiceBlind + 1, BLINDS.length - 1);
    setIndiceBlind(novoIndice);

    // Atualizar os blinds com base na tabela
    setSmallBlind(BLINDS[novoIndice].small);
    setBigBlind(BLINDS[novoIndice].big);
  };

  const togglePause = () => {
    setIsPaused((prev) => !prev);
  };

  const handleReentrada = async () => {
    if (!jogadorReentrada) return;

    setIsLoading(true);
    setErro("");

    try {
      const jogadorId = parseInt(jogadorReentrada);
      const response = await fetch(`/api/torneios/${torneio.id}/reentrada`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jogadorId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro ao registrar reentrada");
      }

      setMostrarReentrada(false);
      setJogadorReentrada("");
      router.refresh();
    } catch (error) {
      setErro(
        error instanceof Error ? error.message : "Erro ao registrar reentrada"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalizarTorneio = async () => {
    if (!primeiroColocado || !segundoColocado) {
      setErro("Selecione o primeiro e segundo colocados");
      return;
    }

    if (primeiroColocado === segundoColocado) {
      setErro("O primeiro e segundo colocados não podem ser o mesmo jogador");
      return;
    }

    setIsLoading(true);
    setErro("");

    try {
      const primeiroId = parseInt(primeiroColocado);
      const segundoId = parseInt(segundoColocado);

      const response = await fetch(`/api/torneios/${torneio.id}/finalizar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          primeiroColocadoId: primeiroId,
          segundoColocadoId: segundoId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro ao finalizar torneio");
      }

      router.refresh();
    } catch (error) {
      setErro(
        error instanceof Error ? error.message : "Erro ao finalizar torneio"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const formatarTempo = (segundos: number) => {
    const minutos = Math.floor(segundos / 60);
    const segsRestantes = segundos % 60;
    return `${minutos.toString().padStart(2, "0")}:${segsRestantes
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6 min-h-screen">
      <div
        className={`bg-white rounded-lg shadow p-6 ${
          isAlarming ? "animate-pulse bg-red-100" : ""
        }`}
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Nível {nivel}</h2>
          <div className="text-5xl font-bold mb-4 font-mono">
            {formatarTempo(tempoRestante)}
          </div>
          <div className="text-xl mb-6">
            <span className="font-semibold">Small Blind: {smallBlind}</span>
            <span className="mx-2">|</span>
            <span className="font-semibold">Big Blind: {bigBlind}</span>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={togglePause}
              className={`px-4 py-2 rounded-md text-white ${
                isPaused
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-yellow-600 hover:bg-yellow-700"
              }`}
            >
              {isPaused ? "Continuar" : "Pausar"}
            </button>

            <button
              onClick={proximoNivel}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Próximo Nível
            </button>

            {isAlarming && (
              <button
                onClick={stopAlarm}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Parar Alarme
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={() => setMostrarReentrada(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Reentrada
        </button>

        <button
          onClick={() => setMostrarFinalizar(true)}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Finalizar Torneio
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Jogadores Participantes</h2>

        <div className="overflow-auto max-h-96">
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
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {torneio.jogadores.map((jogadorTorneio) => (
                <tr key={jogadorTorneio.jogadorId}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {jogadorTorneio.jogador.nome}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {jogadorTorneio.reentradas}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Reentrada */}
      {mostrarReentrada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Registrar Reentrada</h3>

            {erro && (
              <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-md">
                {erro}
              </div>
            )}

            <div className="mb-4">
              <label
                htmlFor="jogadorReentrada"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Jogador
              </label>
              <select
                id="jogadorReentrada"
                value={jogadorReentrada}
                onChange={(e) => setJogadorReentrada(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                disabled={isLoading}
              >
                <option value="">Selecione um jogador</option>
                {torneio.jogadores.map((jt) => (
                  <option key={jt.jogadorId} value={jt.jogadorId}>
                    {jt.jogador.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setMostrarReentrada(false);
                  setJogadorReentrada("");
                  setErro("");
                }}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                onClick={handleReentrada}
                disabled={isLoading || !jogadorReentrada}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
              >
                {isLoading ? "Registrando..." : "Registrar Reentrada"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Finalização */}
      {mostrarFinalizar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Finalizar Torneio</h3>

            {erro && (
              <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-md">
                {erro}
              </div>
            )}

            <div className="mb-4">
              <label
                htmlFor="primeiroColocado"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Primeiro Colocado
              </label>
              <select
                id="primeiroColocado"
                value={primeiroColocado}
                onChange={(e) => setPrimeiroColocado(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                disabled={isLoading}
              >
                <option value="">Selecione o 1º colocado</option>
                {torneio.jogadores.map((jt) => (
                  <option key={jt.jogadorId} value={jt.jogadorId}>
                    {jt.jogador.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label
                htmlFor="segundoColocado"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Segundo Colocado
              </label>
              <select
                id="segundoColocado"
                value={segundoColocado}
                onChange={(e) => setSegundoColocado(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                disabled={isLoading}
              >
                <option value="">Selecione o 2º colocado</option>
                {torneio.jogadores.map((jt) => (
                  <option key={jt.jogadorId} value={jt.jogadorId}>
                    {jt.jogador.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setMostrarFinalizar(false);
                  setPrimeiroColocado("");
                  setSegundoColocado("");
                  setErro("");
                }}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                onClick={handleFinalizarTorneio}
                disabled={isLoading || !primeiroColocado || !segundoColocado}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-red-300"
              >
                {isLoading ? "Finalizando..." : "Finalizar Torneio"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
