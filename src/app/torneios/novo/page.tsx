"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BLINDS } from "@/lib/blinds";

export default function NovoTorneioPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nome: "",
    buyIn: "",
    tempoBlind: "",
    smallBlindInicial: BLINDS[0].small,
    bigBlindInicial: BLINDS[0].big,
  });
  const [blindSelecionado, setBlindSelecionado] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [erro, setErro] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlindChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const index = parseInt(e.target.value);
    setBlindSelecionado(index);
    setFormData((prev) => ({
      ...prev,
      smallBlindInicial: BLINDS[index].small,
      bigBlindInicial: BLINDS[index].big,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErro("");

    try {
      // Converter valor do buyIn para número (troca vírgula por ponto)
      const buyInNumerico = parseFloat(formData.buyIn.replace(",", "."));

      const dados = {
        nome: formData.nome,
        buyIn: buyInNumerico,
        tempoBlind: parseInt(formData.tempoBlind),
        smallBlindInicial: formData.smallBlindInicial,
        bigBlindInicial: formData.bigBlindInicial,
      };

      // Validação básica
      if (isNaN(dados.buyIn) || dados.buyIn <= 0) {
        throw new Error("Buy-in deve ser um valor positivo");
      }
      if (isNaN(dados.tempoBlind) || dados.tempoBlind <= 0) {
        throw new Error("Tempo de blind deve ser um valor positivo");
      }

      const response = await fetch("/api/torneios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dados),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro ao cadastrar torneio");
      }

      const data = await response.json();
      router.push(`/torneios/${data.id}`);
    } catch (error) {
      setErro(
        error instanceof Error ? error.message : "Erro ao cadastrar torneio"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Novo Torneio</h1>
        <Link href="/torneios" className="text-blue-600 hover:text-blue-800">
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
              Nome do Torneio
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
              placeholder="Ex: Torneio Semanal"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="buyIn"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Valor do Buy-in (R$)
              </label>
              <input
                type="text"
                id="buyIn"
                name="buyIn"
                value={formData.buyIn}
                onChange={handleChange}
                required
                placeholder="Ex: 50,00"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="tempoBlind"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tempo de Cada Blind (minutos)
              </label>
              <input
                type="number"
                id="tempoBlind"
                name="tempoBlind"
                value={formData.tempoBlind}
                onChange={handleChange}
                required
                min="1"
                placeholder="Ex: 15"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="blinds"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Blinds Iniciais
            </label>
            <select
              id="blinds"
              value={blindSelecionado}
              onChange={handleBlindChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {BLINDS.map((blind, index) => (
                <option key={index} value={index}>
                  Small: {blind.small} / Big: {blind.big}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
            >
              {isSubmitting ? "Criando..." : "Criar Torneio"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
