"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Jogador {
  id: number;
  nome: string;
  chavePix: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface PageProps {
  params: {
    id: string;
  };
}

export default function EditarJogadorPage({ params }: PageProps) {
  const router = useRouter();
  const [jogador, setJogador] = useState<Jogador | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    chavePix: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [erro, setErro] = useState("");

  const id = parseInt(params.id);

  // Buscar dados do jogador ao carregar a página
  useEffect(() => {
    const fetchJogador = async () => {
      try {
        const response = await fetch(`/api/jogadores/${id}`);
        if (!response.ok) {
          throw new Error("Jogador não encontrado");
        }
        const data = await response.json();
        setJogador(data);
        setFormData({
          nome: data.nome,
          chavePix: data.chavePix || "",
        });
      } catch (error) {
        setErro(
          error instanceof Error ? error.message : "Erro ao buscar jogador"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchJogador();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErro("");

    try {
      const response = await fetch(`/api/jogadores/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro ao atualizar jogador");
      }

      router.push(`/jogadores/${id}`);
      router.refresh();
    } catch (error) {
      setErro(
        error instanceof Error ? error.message : "Erro ao atualizar jogador"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Tem certeza que deseja excluir este jogador? Esta ação não pode ser desfeita."
      )
    ) {
      return;
    }

    setIsSubmitting(true);
    setErro("");

    try {
      const response = await fetch(`/api/jogadores/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro ao excluir jogador");
      }

      router.push("/jogadores");
      router.refresh();
    } catch (error) {
      setErro(
        error instanceof Error ? error.message : "Erro ao excluir jogador"
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

  if (!jogador && !isLoading) {
    return (
      <div className="bg-red-50 p-6 rounded-lg shadow text-center">
        <p className="text-red-600">Jogador não encontrado.</p>
        <Link
          href="/jogadores"
          className="mt-4 inline-block text-blue-600 hover:text-blue-800"
        >
          Voltar para a lista de jogadores
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">Editar Jogador</h1>
        <div className="flex gap-2">
          <Link
            href={`/jogadores/${id}`}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 flex items-center"
          >
            <i className="fas fa-arrow-left mr-2"></i> Cancelar
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {erro && (
          <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-md">
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="nome"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nome
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="chavePix"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Chave Pix (opcional)
            </label>
            <input
              type="text"
              id="chavePix"
              name="chavePix"
              value={formData.chavePix}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col md:flex-row gap-4 pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300 flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i> Salvando...
                </>
              ) : (
                <>
                  <i className="fas fa-save mr-2"></i> Salvar Alterações
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isSubmitting}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:bg-red-300 flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i> Processando...
                </>
              ) : (
                <>
                  <i className="fas fa-trash-alt mr-2"></i> Excluir Jogador
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
