"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface PageProps {
  params: {
    id: string;
  };
}

interface Jogador {
  id: number;
  nome: string;
}

interface JogadorCacheta {
  id: number;
  jogadorId: number;
  jogoId: number;
  pontos: number;
  reentradas: number;
  jogador: Jogador;
}

interface RodadaJogador {
  id: number;
  rodadaId: number;
  jogadorCachetaId: number;
  acao: string;
  resultado: string | null;
  pontosAntes: number;
  pontosApos: number;
  jogadorCacheta: {
    id: number;
    jogador: Jogador;
  };
}

interface Rodada {
  id: number;
  jogoId: number;
  numero: number;
  jogadores: RodadaJogador[];
}

interface JogoCacheta {
  id: number;
  nome: string;
  data: string;
  valorEntrada: number;
  status: string;
  jogadores: JogadorCacheta[];
  rodadas: Rodada[];
}

export default function JogoCachetaPage({ params }: PageProps) {
  const router = useRouter();
  const id = parseInt(params.id);
  const [jogo, setJogo] = useState<JogoCacheta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [erro, setErro] = useState("");
  const [mostrarModalRodada, setMostrarModalRodada] = useState(false);
  const [mostrarModalReentrada, setMostrarModalReentrada] = useState(false);
  const [mostrarModalFinalizar, setMostrarModalFinalizar] = useState(false);
  const [jogadorReentrada, setJogadorReentrada] = useState("");
  const [vencedor, setVencedor] = useState("");
  const [valorPremiacao, setValorPremiacao] = useState("");
  const [jogadorLivramento, setJogadorLivramento] = useState("");
  const [acoesJogadores, setAcoesJogadores] = useState<{
    [jogadorId: number]: {
      acao: string;
      resultado: string | null;
    };
  }>({});

  useEffect(() => {
    const fetchJogo = async () => {
      try {
        const response = await fetch(`/api/cacheta/${id}`);
        if (!response.ok) {
          throw new Error("Falha ao buscar jogo");
        }
        const data = await response.json();
        setJogo(data);

        // Inicializar as ações dos jogadores (todos como CORREU por padrão)
        const acoes: {
          [jogadorId: number]: { acao: string; resultado: string | null };
        } = {};
        data.jogadores.forEach((jogador: JogadorCacheta) => {
          acoes[jogador.id] = { acao: "CORREU", resultado: null };
        });
        setAcoesJogadores(acoes);
      } catch (error) {
        setErro(error instanceof Error ? error.message : "Erro ao buscar jogo");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJogo();
  }, [id]);

  const handleAcaoChange = (jogadorId: number, acao: string) => {
    setAcoesJogadores((prev) => ({
      ...prev,
      [jogadorId]: {
        ...prev[jogadorId],
        acao,
        resultado: acao === "CORREU" ? null : prev[jogadorId].resultado,
      },
    }));
  };

  const handleResultadoChange = (jogadorId: number, resultado: string) => {
    // Ao selecionar um jogador como GANHOU, automaticamente marcar os outros que foram como PERDEU
    if (resultado === "GANHOU") {
      const acoesAtualizadas = { ...acoesJogadores };

      // Primeiro, definir o jogador selecionado como GANHOU
      acoesAtualizadas[jogadorId] = {
        ...acoesAtualizadas[jogadorId],
        resultado,
      };

      // Depois, definir todos os outros jogadores que foram como PERDEU
      Object.keys(acoesAtualizadas).forEach((id) => {
        const idJogador = parseInt(id);
        if (
          idJogador !== jogadorId &&
          acoesAtualizadas[idJogador].acao === "FOI"
        ) {
          acoesAtualizadas[idJogador] = {
            ...acoesAtualizadas[idJogador],
            resultado: "PERDEU",
          };
        }
      });

      setAcoesJogadores(acoesAtualizadas);
    } else {
      // Se está marcando como PERDEU, apenas atualiza o jogador específico
      setAcoesJogadores((prev) => ({
        ...prev,
        [jogadorId]: {
          ...prev[jogadorId],
          resultado,
        },
      }));
    }
  };

  const handleRegistrarRodada = async () => {
    setIsSubmitting(true);
    setErro("");

    try {
      // Encontrar jogadores que foram e ganharam
      const foramGanharamIds = Object.entries(acoesJogadores)
        .filter(
          ([, { acao, resultado }]) => acao === "FOI" && resultado === "GANHOU"
        )
        .map(([id]) => parseInt(id));

      // Verificar se há mais de um jogador que foi e ganhou
      if (foramGanharamIds.length > 1) {
        throw new Error("Apenas um jogador pode ganhar por rodada");
      }

      // Verificar se alguém foi e não tem resultado definido
      const jogadoresSemResultado = Object.entries(acoesJogadores)
        .filter(([, { acao, resultado }]) => acao === "FOI" && !resultado)
        .map(([id]) => {
          const jogador = jogo?.jogadores.find((j) => j.id === parseInt(id));
          return jogador?.jogador.nome || `Jogador ${id}`;
        });

      if (jogadoresSemResultado.length > 0) {
        throw new Error(
          `Defina o resultado para: ${jogadoresSemResultado.join(", ")}`
        );
      }

      // Converter as ações para o formato esperado pela API
      const acoes = Object.entries(acoesJogadores).map(
        ([id, { acao, resultado }]) => ({
          jogadorCachetaId: parseInt(id),
          acao,
          resultado,
        })
      );

      const response = await fetch(`/api/cacheta/${id}/rodada`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ acoes }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro ao registrar rodada");
      }

      // Fechar o modal e recarregar dados
      setMostrarModalRodada(false);
      router.refresh();

      // Recarregar os dados do jogo
      const jogoResponse = await fetch(`/api/cacheta/${id}`);
      if (jogoResponse.ok) {
        const jogoAtualizado = await jogoResponse.json();
        setJogo(jogoAtualizado);
      }
    } catch (error) {
      setErro(
        error instanceof Error ? error.message : "Erro ao registrar rodada"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReentrada = async () => {
    setIsSubmitting(true);
    setErro("");

    try {
      if (!jogadorReentrada) {
        throw new Error("Selecione um jogador para reentrada");
      }

      const response = await fetch(`/api/cacheta/${id}/reentrada`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jogadorCachetaId: parseInt(jogadorReentrada) }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro ao fazer reentrada");
      }

      // Fechar o modal e recarregar dados
      setMostrarModalReentrada(false);
      setJogadorReentrada("");
      router.refresh();

      // Recarregar os dados do jogo
      const jogoResponse = await fetch(`/api/cacheta/${id}`);
      if (jogoResponse.ok) {
        const jogoAtualizado = await jogoResponse.json();
        setJogo(jogoAtualizado);
      }
    } catch (error) {
      setErro(
        error instanceof Error ? error.message : "Erro ao fazer reentrada"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinalizarJogo = () => {
    // Abrir o modal para finalizar o jogo
    setMostrarModalFinalizar(true);
  };

  const handleConfirmarFinalizarJogo = async () => {
    if (!vencedor) {
      setErro("Selecione o vencedor do jogo");
      return;
    }

    // Validar valor de premiação apenas se for informado
    if (valorPremiacao && isNaN(Number(valorPremiacao.replace(",", ".")))) {
      setErro("Formato de valor de premiação inválido");
      return;
    }

    setIsSubmitting(true);
    setErro("");

    try {
      const response = await fetch(`/api/cacheta/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          acao: "finalizar",
          vencedorId: parseInt(vencedor),
          valorPremiacao: valorPremiacao
            ? parseFloat(valorPremiacao.replace(",", "."))
            : undefined,
          jogadorLivramentoId: jogadorLivramento
            ? parseInt(jogadorLivramento)
            : null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro ao finalizar jogo");
      }

      // Fechar o modal e recarregar dados
      setMostrarModalFinalizar(false);

      // Recarregar os dados do jogo
      const jogoResponse = await fetch(`/api/cacheta/${id}`);
      if (jogoResponse.ok) {
        const jogoAtualizado = await jogoResponse.json();
        setJogo(jogoAtualizado);
      }
    } catch (error) {
      setErro(
        error instanceof Error ? error.message : "Erro ao finalizar jogo"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!jogo) {
    return (
      <div className="bg-red-50 p-6 rounded-lg shadow text-center">
        <p className="text-red-600">Jogo não encontrado</p>
        <Link
          href="/cacheta"
          className="mt-4 inline-block text-blue-600 hover:text-blue-800"
        >
          Voltar para jogos de cacheta
        </Link>
      </div>
    );
  }

  // Ordenar os jogadores por pontos (decrescente)
  const jogadoresOrdenados = [...jogo.jogadores].sort(
    (a, b) => b.pontos - a.pontos
  );

  // Filtrar jogadores ativos (com pontos > 0) para o modal de nova rodada
  const jogadoresAtivos = jogadoresOrdenados.filter(
    (jogador) => jogador.pontos > 0
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">{jogo.nome}</h1>
          <p className="text-gray-600">
            {new Date(jogo.data).toLocaleDateString("pt-BR")}
          </p>
          <p className="text-gray-600">
            Valor da entrada: R${" "}
            {jogo.valorEntrada.toFixed(2).replace(".", ",")}
          </p>
        </div>
        <div className="flex gap-2">
          {jogo.status === "EM_ANDAMENTO" && (
            <>
              <button
                onClick={() => setMostrarModalRodada(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
              >
                <i className="fas fa-plus mr-2"></i> Nova Rodada
              </button>
              <button
                onClick={() => setMostrarModalReentrada(true)}
                className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 flex items-center"
              >
                <i className="fas fa-redo mr-2"></i> Reentrada
              </button>
              <button
                onClick={handleFinalizarJogo}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center"
              >
                <i className="fas fa-flag-checkered mr-2"></i> Finalizar
              </button>
            </>
          )}
          <Link
            href="/cacheta"
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 flex items-center"
          >
            <i className="fas fa-arrow-left mr-2"></i> Voltar
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <i className="fas fa-users text-blue-600 mr-2"></i> Jogadores
        </h2>

        <div className="overflow-auto">
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
                  Nome
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
                  Reentradas
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {jogadoresOrdenados.map((jogadorCacheta, index) => (
                <tr
                  key={jogadorCacheta.id}
                  className={index === 0 ? "bg-yellow-50" : ""}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {index + 1}º
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">
                      {jogadorCacheta.jogador.nome}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-lg font-semibold text-blue-600">
                      {jogadorCacheta.pontos}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-gray-900">
                      {jogadorCacheta.reentradas > 0 ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          {jogadorCacheta.reentradas}
                        </span>
                      ) : (
                        "-"
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {jogo.rodadas.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <i className="fas fa-history text-green-600 mr-2"></i> Histórico de
            Rodadas
          </h2>

          <div className="space-y-4">
            {jogo.rodadas.map((rodada) => (
              <div
                key={rodada.id}
                className="border rounded-lg overflow-hidden"
              >
                <div className="bg-gray-50 px-4 py-2 border-b">
                  <h3 className="font-medium">Rodada {rodada.numero}</h3>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {rodada.jogadores.map((jogadorRodada) => {
                      const acao = jogadorRodada.acao;
                      const resultado = jogadorRodada.resultado;
                      const pontosPerdidos =
                        jogadorRodada.pontosAntes - jogadorRodada.pontosApos;

                      return (
                        <div
                          key={jogadorRodada.id}
                          className={`border rounded-md p-3 ${
                            acao === "FOI" && resultado === "GANHOU"
                              ? "bg-green-50 border-green-200"
                              : acao === "FOI" && resultado === "PERDEU"
                              ? "bg-red-50 border-red-200"
                              : "bg-gray-50 border-gray-200"
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <span className="font-medium">
                              {jogadorRodada.jogadorCacheta.jogador.nome}
                            </span>
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                acao === "FOI"
                                  ? resultado === "GANHOU"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {acao === "FOI" ? (
                                resultado === "GANHOU" ? (
                                  <>
                                    <i className="fas fa-trophy text-yellow-500 mr-1"></i>{" "}
                                    Ganhou
                                  </>
                                ) : (
                                  <>
                                    <i className="fas fa-times mr-1"></i> Perdeu
                                    (-2)
                                  </>
                                )
                              ) : (
                                <>
                                  <i className="fas fa-running mr-1"></i> Correu
                                  (-1)
                                </>
                              )}
                            </span>
                          </div>
                          <div className="mt-2 text-sm">
                            <div className="flex justify-between">
                              <span>Antes:</span>
                              <span className="font-semibold">
                                {jogadorRodada.pontosAntes}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Depois:</span>
                              <span className="font-semibold">
                                {jogadorRodada.pontosApos}
                              </span>
                            </div>
                            {pontosPerdidos > 0 && (
                              <div className="flex justify-between text-red-600">
                                <span>Perdeu:</span>
                                <span className="font-semibold">
                                  -{pontosPerdidos}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal de Nova Rodada */}
      {mostrarModalRodada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
            <h3 className="text-xl font-bold mb-4">Nova Rodada</h3>

            {erro && (
              <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-md">
                {erro}
              </div>
            )}

            <div className="space-y-4">
              {jogadoresAtivos.map((jogadorCacheta) => {
                const acaoAtual =
                  acoesJogadores[jogadorCacheta.id]?.acao || "CORREU";
                const resultadoAtual =
                  acoesJogadores[jogadorCacheta.id]?.resultado || null;

                return (
                  <div
                    key={jogadorCacheta.id}
                    className="border p-4 rounded-md"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">
                        {jogadorCacheta.jogador.nome}
                      </span>
                      <span className="text-sm">
                        Pontos:{" "}
                        <span className="font-semibold">
                          {jogadorCacheta.pontos}
                        </span>
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                          Ação
                        </label>
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleAcaoChange(jogadorCacheta.id, "CORREU")
                            }
                            className={`px-3 py-1 rounded-md ${
                              acaoAtual === "CORREU"
                                ? "bg-gray-600 text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                          >
                            Correu
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleAcaoChange(jogadorCacheta.id, "FOI")
                            }
                            className={`px-3 py-1 rounded-md ${
                              acaoAtual === "FOI"
                                ? "bg-blue-600 text-white"
                                : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                            }`}
                          >
                            Foi
                          </button>
                        </div>
                      </div>

                      {acaoAtual === "FOI" && (
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1 block">
                            Resultado
                          </label>
                          <div className="flex space-x-2">
                            <button
                              type="button"
                              onClick={() =>
                                handleResultadoChange(
                                  jogadorCacheta.id,
                                  "GANHOU"
                                )
                              }
                              className={`px-3 py-1 rounded-md ${
                                resultadoAtual === "GANHOU"
                                  ? "bg-green-600 text-white"
                                  : "bg-green-100 text-green-700 hover:bg-green-200"
                              }`}
                            >
                              Ganhou
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handleResultadoChange(
                                  jogadorCacheta.id,
                                  "PERDEU"
                                )
                              }
                              className={`px-3 py-1 rounded-md ${
                                resultadoAtual === "PERDEU"
                                  ? "bg-red-600 text-white"
                                  : "bg-red-100 text-red-700 hover:bg-red-200"
                              }`}
                            >
                              Perdeu
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setMostrarModalRodada(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                onClick={handleRegistrarRodada}
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
              >
                {isSubmitting ? "Registrando..." : "Registrar Rodada"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Reentrada */}
      {mostrarModalReentrada && (
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
                disabled={isSubmitting}
              >
                <option value="">Selecione um jogador</option>
                {jogadoresOrdenados.map((jogadorCacheta) => (
                  <option key={jogadorCacheta.id} value={jogadorCacheta.id}>
                    {jogadorCacheta.jogador.nome}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-sm text-gray-500">
                Apenas jogadores com 0 pontos podem fazer reentrada
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setMostrarModalReentrada(false);
                  setJogadorReentrada("");
                  setErro("");
                }}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                onClick={handleReentrada}
                disabled={isSubmitting || !jogadorReentrada}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
              >
                {isSubmitting ? "Registrando..." : "Registrar Reentrada"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Finalizar Jogo */}
      {mostrarModalFinalizar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Finalizar Jogo</h3>

            {erro && (
              <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-md">
                {erro}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="vencedor"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Vencedor
                </label>
                <select
                  id="vencedor"
                  value={vencedor}
                  onChange={(e) => setVencedor(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  disabled={isSubmitting}
                >
                  <option value="">Selecione o vencedor</option>
                  {jogadoresOrdenados.map((jogadorCacheta) => (
                    <option key={jogadorCacheta.id} value={jogadorCacheta.id}>
                      {jogadorCacheta.jogador.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="valorPremiacao"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Valor da Premiação (R$) - Opcional
                </label>
                <input
                  type="text"
                  id="valorPremiacao"
                  value={valorPremiacao}
                  onChange={(e) => setValorPremiacao(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Será calculado automaticamente se não informado"
                  disabled={isSubmitting}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Se não informado, será calculado: (valor da entrada) ×
                  (jogadores + reentradas)
                </p>
              </div>

              <div>
                <label
                  htmlFor="jogadorLivramento"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Jogador que Livrou (opcional)
                </label>
                <select
                  id="jogadorLivramento"
                  value={jogadorLivramento}
                  onChange={(e) => setJogadorLivramento(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  disabled={isSubmitting}
                >
                  <option value="">Nenhum (todos pagaram)</option>
                  {jogadoresOrdenados.map((jogadorCacheta) => (
                    <option key={jogadorCacheta.id} value={jogadorCacheta.id}>
                      {jogadorCacheta.jogador.nome}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-gray-500 mt-1">
                  Selecione apenas se algum jogador não precisou pagar
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => {
                  setMostrarModalFinalizar(false);
                  setErro("");
                }}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmarFinalizarJogo}
                disabled={isSubmitting}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-red-300"
              >
                {isSubmitting ? "Finalizando..." : "Finalizar Jogo"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
