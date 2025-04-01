"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NovoJogadorPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nome: "",
    chavePix: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [erro, setErro] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErro("");

    try {
      const response = await fetch("/api/jogadores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro ao cadastrar jogador");
      }

      router.push("/jogadores");
      router.refresh();
    } catch (error) {
      setErro(
        error instanceof Error ? error.message : "Erro ao cadastrar jogador"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Novo Jogador</h1>
        <Link href="/jogadores" className="text-blue-600 hover:text-blue-800">
          Voltar para lista
        </Link>
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

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
            >
              {isSubmitting ? "Cadastrando..." : "Cadastrar Jogador"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
