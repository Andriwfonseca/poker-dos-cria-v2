import { PrismaClient, Jogador } from "@prisma/client";

const prisma = new PrismaClient();

export async function getJogadores() {
  try {
    return await prisma.jogador.findMany({
      include: {
        torneios: true,
        vitoriasP1: true,
        vitoriasP2: true,
        jogosCache: true,
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

export async function getJogadorWithStats(id: number) {
  try {
    // Obter o jogador com suas relações básicas
    const jogador = await prisma.jogador.findUnique({
      where: { id },
      include: {
        torneios: {
          include: {
            torneio: true,
          },
        },
        vitoriasP1: true,
        vitoriasP2: true,
        jogosCache: {
          include: {
            jogo: true,
          },
        },
      },
    });

    if (!jogador) {
      return null;
    }

    // Obter estatísticas de cacheta para o jogador
    const estatisticasCacheta = await prisma.$queryRaw`
      WITH jogos_finalizados AS (
        SELECT jc.id, jc."jogoId", jc."jogadorId", jc.pontos, jc.reentradas,
               jc2."vencedorId", jc2."valorPremiacao", jc2.status
        FROM "JogadorCacheta" jc
        JOIN "JogoCacheta" jc2 ON jc."jogoId" = jc2.id
        WHERE jc."jogadorId" = ${id}
          AND jc2.status = 'FINALIZADO'
      )
      SELECT 
        COUNT(DISTINCT "jogoId") as total_jogos,
        SUM(CASE WHEN "jogadorId" = "vencedorId" THEN 1 ELSE 0 END) as vitorias,
        SUM(reentradas) as total_reentradas,
        SUM(CASE WHEN "jogadorId" = "vencedorId" THEN "valorPremiacao" ELSE 0 END) as total_premio
      FROM jogos_finalizados;
    `;

    // Processar os resultados
    const estatisticaResult = estatisticasCacheta as any;
    const cacheta = {
      totalJogos: Number(estatisticaResult[0]?.total_jogos || 0),
      vitorias: Number(estatisticaResult[0]?.vitorias || 0),
      totalReentradas: Number(estatisticaResult[0]?.total_reentradas || 0),
      totalPremio: Number(estatisticaResult[0]?.total_premio || 0),
    };

    return {
      ...jogador,
      estatisticasCacheta: cacheta,
    };
  } catch (error) {
    console.error(`Erro ao buscar jogador com id ${id}:`, error);
    return null;
  }
}

export async function getJogadoresCachetaRanking() {
  try {
    // Buscar todos os jogos de cacheta finalizados com seus jogadores
    const jogosFinalizados = await prisma.jogoCacheta.findMany({
      where: {
        status: "FINALIZADO",
      },
      include: {
        jogadores: {
          include: {
            jogador: true,
          },
        },
      },
    });

    // Mapear estatísticas para cada jogador
    const estatisticasPorJogador = new Map();

    for (const jogo of jogosFinalizados) {
      // Aqui estamos usando campos que foram adicionados ao esquema
      const vencedorId = jogo.vencedorId;
      const valorPremiacao = jogo.valorPremiacao || 0;

      for (const jogadorCacheta of jogo.jogadores) {
        const jogadorId = jogadorCacheta.jogadorId;
        const isVencedor = vencedorId === jogadorCacheta.id;

        if (!estatisticasPorJogador.has(jogadorId)) {
          estatisticasPorJogador.set(jogadorId, {
            jogador: jogadorCacheta.jogador,
            totalJogos: 0,
            vitorias: 0,
            totalReentradas: 0,
            totalPremio: 0,
            pontos: 0, // Sistema de pontos para ranking
          });
        }

        const stats = estatisticasPorJogador.get(jogadorId);
        stats.totalJogos += 1;
        stats.vitorias += isVencedor ? 1 : 0;
        stats.totalReentradas += jogadorCacheta.reentradas;
        stats.totalPremio += isVencedor ? valorPremiacao : 0;
        stats.pontos += isVencedor ? 5 : 0; // Adicionar 5 pontos por vitória
        stats.pontos += jogadorCacheta.pontos > 0 ? 1 : 0; // 1 ponto se terminou com pontos
      }
    }

    // Converter para array e ordenar por pontos
    return Array.from(estatisticasPorJogador.values()).sort(
      (a, b) => b.pontos - a.pontos || b.vitorias - a.vitorias
    );
  } catch (error) {
    console.error("Erro ao buscar ranking de cacheta:", error);
    return [];
  }
}
