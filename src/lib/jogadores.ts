import { PrismaClient, Jogador } from "@prisma/client";

const prisma = new PrismaClient();

export async function getJogadores() {
  try {
    return await prisma.jogador.findMany({
      include: {
        torneios: true,
        vitoriasP1: true,
        vitoriasP2: true,
      },
      orderBy: {
        nome: "asc",
      },
    });
  } catch (error) {
    console.error("Erro ao buscar jogadores:", error);
    return [];
  }
}

export async function getJogadorById(id: number) {
  try {
    return await prisma.jogador.findUnique({
      where: { id },
      include: {
        torneios: {
          include: {
            torneio: true,
          },
        },
        vitoriasP1: true,
        vitoriasP2: true,
      },
    });
  } catch (error) {
    console.error(`Erro ao buscar jogador ${id}:`, error);
    return null;
  }
}

export async function criarJogador(
  data: Omit<Jogador, "id" | "createdAt" | "updatedAt">
) {
  try {
    return await prisma.jogador.create({
      data,
    });
  } catch (error) {
    console.error("Erro ao criar jogador:", error);
    throw new Error("Falha ao criar jogador");
  }
}

export async function atualizarJogador(
  id: number,
  data: Partial<Omit<Jogador, "id" | "createdAt" | "updatedAt">>
) {
  try {
    return await prisma.jogador.update({
      where: { id },
      data,
    });
  } catch (error) {
    console.error(`Erro ao atualizar jogador ${id}:`, error);
    throw new Error("Falha ao atualizar jogador");
  }
}

export async function deletarJogador(id: number) {
  try {
    return await prisma.jogador.delete({
      where: { id },
    });
  } catch (error) {
    console.error(`Erro ao deletar jogador ${id}:`, error);
    throw new Error("Falha ao deletar jogador");
  }
}

export async function getJogadoresRanking() {
  try {
    const jogadores = await prisma.jogador.findMany({
      include: {
        vitoriasP1: true,
        vitoriasP2: true,
        torneios: true,
      },
    });

    return jogadores
      .map((jogador) => ({
        ...jogador,
        pontos: jogador.vitoriasP1.length * 3 + jogador.vitoriasP2.length * 1,
        torneiosParticipados: jogador.torneios.length,
      }))
      .sort((a, b) => b.pontos - a.pontos);
  } catch (error) {
    console.error("Erro ao buscar ranking:", error);
    return [];
  }
}
