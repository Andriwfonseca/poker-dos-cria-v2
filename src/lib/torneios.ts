import { PrismaClient, Torneio } from "@prisma/client";

const prisma = new PrismaClient();

export async function getTorneios() {
  try {
    return await prisma.torneio.findMany({
      include: {
        jogadores: {
          include: {
            jogador: true,
          },
        },
        primeiroColocado: true,
        segundoColocado: true,
      },
      orderBy: {
        data: "desc",
      },
    });
  } catch (error) {
    console.error("Erro ao buscar torneios:", error);
    return [];
  }
}

export async function getTorneioById(id: number) {
  try {
    return await prisma.torneio.findUnique({
      where: { id },
      include: {
        jogadores: {
          include: {
            jogador: true,
          },
        },
        primeiroColocado: true,
        segundoColocado: true,
      },
    });
  } catch (error) {
    console.error(`Erro ao buscar torneio ${id}:`, error);
    return null;
  }
}

export async function criarTorneio(
  data: Omit<
    Torneio,
    | "id"
    | "createdAt"
    | "updatedAt"
    | "primeiroColocadoId"
    | "segundoColocadoId"
    | "status"
  >
) {
  try {
    return await prisma.torneio.create({
      data: {
        ...data,
        status: "CONFIGURADO",
      },
    });
  } catch (error) {
    console.error("Erro ao criar torneio:", error);
    throw new Error("Falha ao criar torneio");
  }
}

export async function atualizarTorneio(
  id: number,
  data: Partial<Omit<Torneio, "id" | "createdAt" | "updatedAt">>
) {
  try {
    return await prisma.torneio.update({
      where: { id },
      data,
    });
  } catch (error) {
    console.error(`Erro ao atualizar torneio ${id}:`, error);
    throw new Error("Falha ao atualizar torneio");
  }
}

export async function deletarTorneio(id: number) {
  try {
    // Primeiro excluímos todas as relações JogadorTorneio
    await prisma.jogadorTorneio.deleteMany({
      where: { torneioId: id },
    });

    // Então excluímos o torneio
    return await prisma.torneio.delete({
      where: { id },
    });
  } catch (error) {
    console.error(`Erro ao deletar torneio ${id}:`, error);
    throw new Error("Falha ao deletar torneio");
  }
}

export async function adicionarJogadorAoTorneio(
  torneioId: number,
  jogadorId: number
) {
  try {
    // Verificar se já existe
    const existente = await prisma.jogadorTorneio.findUnique({
      where: {
        jogadorId_torneioId: {
          jogadorId,
          torneioId,
        },
      },
    });

    if (existente) {
      return existente;
    }

    return await prisma.jogadorTorneio.create({
      data: {
        jogadorId,
        torneioId,
      },
    });
  } catch (error) {
    console.error(
      `Erro ao adicionar jogador ${jogadorId} ao torneio ${torneioId}:`,
      error
    );
    throw new Error("Falha ao adicionar jogador ao torneio");
  }
}

export async function removerJogadorDoTorneio(
  torneioId: number,
  jogadorId: number
) {
  try {
    return await prisma.jogadorTorneio.delete({
      where: {
        jogadorId_torneioId: {
          jogadorId,
          torneioId,
        },
      },
    });
  } catch (error) {
    console.error(
      `Erro ao remover jogador ${jogadorId} do torneio ${torneioId}:`,
      error
    );
    throw new Error("Falha ao remover jogador do torneio");
  }
}

export async function registrarReentrada(torneioId: number, jogadorId: number) {
  try {
    const jogadorTorneio = await prisma.jogadorTorneio.findUnique({
      where: {
        jogadorId_torneioId: {
          jogadorId,
          torneioId,
        },
      },
    });

    if (!jogadorTorneio) {
      throw new Error("Jogador não encontrado no torneio");
    }

    return await prisma.jogadorTorneio.update({
      where: {
        id: jogadorTorneio.id,
      },
      data: {
        reentradas: jogadorTorneio.reentradas + 1,
      },
    });
  } catch (error) {
    console.error(
      `Erro ao registrar reentrada para jogador ${jogadorId} no torneio ${torneioId}:`,
      error
    );
    throw new Error("Falha ao registrar reentrada");
  }
}

export async function iniciarTorneio(id: number) {
  try {
    return await prisma.torneio.update({
      where: { id },
      data: {
        status: "EM_ANDAMENTO",
      },
    });
  } catch (error) {
    console.error(`Erro ao iniciar torneio ${id}:`, error);
    throw new Error("Falha ao iniciar torneio");
  }
}

export async function finalizarTorneio(
  id: number,
  primeiroColocadoId: number,
  segundoColocadoId: number
) {
  try {
    return await prisma.torneio.update({
      where: { id },
      data: {
        status: "FINALIZADO",
        primeiroColocadoId,
        segundoColocadoId,
      },
    });
  } catch (error) {
    console.error(`Erro ao finalizar torneio ${id}:`, error);
    throw new Error("Falha ao finalizar torneio");
  }
}
