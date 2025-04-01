"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Jogador {
  id: number;
  nome: string;
}

export default function NovoCachetaPage() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [valorEntrada, setValorEntrada] = useState("");
  const [jogadores, setJogadores] = useState<Jogador[]>([]);
  const [jogadoresSelecionados, setJogadoresSelecionados] = useState<number[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const fetchJogadores = async () => {
      try {
        const response = await fetch("/api/jogadores");
        if (!response.ok) {
          throw new Error("Falha ao buscar jogadores");
        }
        const data = await response.json();
        setJogadores(data);
      } catch (error) {
        console.error(error);
        setErro("Erro ao carregar jogadores.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJogadores();
  }, []);

  const handleJogadorToggle = (jogadorId: number) => {
    if (jogadoresSelecionados.includes(jogadorId)) {
      setJogadoresSelecionados(
        jogadoresSelecionados.filter((id) => id !== jogadorId)
      );
    } else {
      setJogadoresSelecionados([...jogadoresSelecionados, jogadorId]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setIsSubmitting(true);

    if (jogadoresSelecionados.length < 2) {
      setErro("Selecione pelo menos 2 jogadores.");
      setIsSubmitting(false);
      return;
    }

    if (!valorEntrada || isNaN(Number(valorEntrada.replace(",", ".")))) {
      setErro("Informe um valor de entrada válido.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/cacheta", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome,
          valorEntrada: parseFloat(valorEntrada.replace(",", ".")),
          jogadoresIds: jogadoresSelecionados,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao criar jogo de cacheta");
      }

      const data = await response.json();
      router.push(`/cacheta/${data.id}`);
    } catch (error) {
      if (error instanceof Error) {
        setErro(error.message);
      } else {
        setErro("Ocorreu um erro ao criar o jogo");
      }
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Novo Jogo de Cacheta</h1>
        <Link
          href="/cacheta"
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Voltar
        </Link>
      </div>

      {erro && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md">
          {erro}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="nome"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nome do Jogo
          </label>
          <input
            type="text"
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ex: Cacheta de Sábado"
            required
          />
        </div>

        <div>
          <label
            htmlFor="valorEntrada"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Valor de Cada Entrada (R$)
          </label>
          <input
            type="text"
            id="valorEntrada"
            value={valorEntrada}
            onChange={(e) => setValorEntrada(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ex: 20,00"
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            Informe o valor que cada jogador deverá pagar por entrada
          </p>
        </div>

        <div>
          <h2 className="text-lg font-medium text-gray-700 mb-2">
            Selecione os Jogadores
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Cada jogador começará com 10 pontos.
          </p>

          {isLoading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {jogadores.map((jogador) => (
                <div
                  key={jogador.id}
                  onClick={() => handleJogadorToggle(jogador.id)}
                  className={`p-4 border rounded-md cursor-pointer transition-colors ${
                    jogadoresSelecionados.includes(jogador.id)
                      ? "bg-blue-50 border-blue-300"
                      : "bg-white border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={jogadoresSelecionados.includes(jogador.id)}
                      onChange={() => {}}
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-gray-900 font-medium">
                      {jogador.nome}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2">
          <Link
            href="/cacheta"
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={isSubmitting || jogadoresSelecionados.length < 2}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Criando..." : "Criar Jogo"}
          </button>
        </div>
      </form>
    </div>
  );
}
