import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Tipos para operações de cacheta
export type JogoCachetaData = {
  nome: string;
  jogadoresIds: number[];
  valorEntrada: number;
};

export type AcaoRodada = {
  jogadorCachetaId: number;
  acao: "FOI" | "CORREU";
  resultado?: "GANHOU" | "PERDEU"; // Obrigatório se ação for "FOI"
};

// Tipos para finalização do jogo
export type FinalizacaoJogoData = {
  vencedorId: number;
  valorPremiacao?: number; // Opcional agora, será calculado automaticamente se não informado
  jogadorLivramentoId?: number | null;
};

// Obter todos os jogos de cacheta
export async function getJogosCacheta() {
  try {
    return await prisma.jogoCacheta.findMany({
      include: {
        jogadores: {
          include: {
            jogador: true,
          },
        },
        rodadas: {
          include: {
            jogadores: true,
          },
        },
      },
      orderBy: {
        data: "desc",
      },
    });
  } catch (error) {
    console.error("Erro ao buscar jogos de cacheta:", error);
    return [];
  }
}

// Obter jogo de cacheta por ID
export async function getJogoCachetaById(id: number) {
  try {
    return await prisma.jogoCacheta.findUnique({
      where: { id },
      include: {
        jogadores: {
          include: {
            jogador: true,
          },
        },
        rodadas: {
          include: {
            jogadores: {
              include: {
                jogadorCacheta: {
                  include: {
                    jogador: true,
                  },
                },
              },
            },
          },
          orderBy: {
            numero: "asc",
          },
        },
      },
    });
  } catch (error) {
    console.error(`Erro ao buscar jogo de cacheta ${id}:`, error);
    return null;
  }
}

// Criar um novo jogo de cacheta
export async function criarJogoCacheta(data: JogoCachetaData) {
  try {
    // Criar o jogo
    const jogo = await prisma.jogoCacheta.create({
      data: {
        nome: data.nome,
        valorEntrada: data.valorEntrada,
        status: "EM_ANDAMENTO",
        jogadores: {
          create: data.jogadoresIds.map((jogadorId) => ({
            jogadorId,
            pontos: 10, // Todos começam com 10 pontos
          })),
        },
      },
      include: {
        jogadores: {
          include: {
            jogador: true,
          },
        },
      },
    });

    return jogo;
  } catch (error) {
    console.error("Erro ao criar jogo de cacheta:", error);
    throw new Error("Falha ao criar jogo de cacheta");
  }
}

// Registrar uma nova rodada
export async function registrarRodada(jogoId: number, acoes: AcaoRodada[]) {
  try {
    // Buscar o jogo e seus jogadores
    const jogo = await prisma.jogoCacheta.findUnique({
      where: { id: jogoId },
      include: {
        jogadores: true,
        rodadas: true,
      },
    });

    if (!jogo) {
      throw new Error("Jogo não encontrado");
    }

    if (jogo.status === "FINALIZADO") {
      throw new Error("Este jogo já foi finalizado");
    }

    // Verificar se todos os jogadores do jogo estão na lista de ações
    const jogadoresIds = new Set(jogo.jogadores.map((j) => j.id));
    for (const acao of acoes) {
      if (!jogadoresIds.has(acao.jogadorCachetaId)) {
        throw new Error(
          `Jogador ID ${acao.jogadorCachetaId} não participa deste jogo`
        );
      }

      // Verificar se a ação é FOI mas não tem resultado
      if (acao.acao === "FOI" && !acao.resultado) {
        throw new Error("Quando a ação é FOI, o resultado é obrigatório");
      }
    }

    // Obter o número da próxima rodada
    const proximoNumero = jogo.rodadas.length + 1;

    // Criar a rodada
    const rodada = await prisma.rodadaCacheta.create({
      data: {
        jogoId,
        numero: proximoNumero,
      },
    });

    // Processar cada ação dos jogadores
    const registrosRodada = [];
    for (const acao of acoes) {
      const jogadorCacheta = jogo.jogadores.find(
        (j) => j.id === acao.jogadorCachetaId
      );
      if (!jogadorCacheta) continue;

      let pontosApos = jogadorCacheta.pontos;

      // Aplicar regras de pontuação
      if (acao.acao === "CORREU") {
        // Se correu, perde 1 ponto
        pontosApos = Math.max(0, jogadorCacheta.pontos - 1);
      } else if (acao.acao === "FOI" && acao.resultado === "PERDEU") {
        // Se foi e perdeu, perde 2 pontos
        pontosApos = Math.max(0, jogadorCacheta.pontos - 2);
      }
      // Se foi e ganhou, não perde pontos

      // Registrar a ação do jogador na rodada
      const registroRodada = await prisma.rodadaJogadorCacheta.create({
        data: {
          rodadaId: rodada.id,
          jogadorCachetaId: acao.jogadorCachetaId,
          acao: acao.acao,
          resultado: acao.resultado,
          pontosAntes: jogadorCacheta.pontos,
          pontosApos,
        },
      });

      registrosRodada.push(registroRodada);

      // Atualizar pontos do jogador
      await prisma.jogadorCacheta.update({
        where: { id: acao.jogadorCachetaId },
        data: { pontos: pontosApos },
      });
    }

    return {
      rodada,
      registrosRodada,
    };
  } catch (error) {
    console.error("Erro ao registrar rodada:", error);
    throw new Error(
      error instanceof Error ? error.message : "Falha ao registrar rodada"
    );
  }
}

// Fazer reentrada de um jogador
export async function fazerReentrada(jogoId: number, jogadorCachetaId: number) {
  try {
    // Buscar o jogo e seus jogadores
    const jogo = await prisma.jogoCacheta.findUnique({
      where: { id: jogoId },
      include: {
        jogadores: true,
      },
    });

    if (!jogo) {
      throw new Error("Jogo não encontrado");
    }

    if (jogo.status === "FINALIZADO") {
      throw new Error("Este jogo já foi finalizado");
    }

    // Encontrar o jogador que quer fazer reentrada
    const jogadorCacheta = jogo.jogadores.find(
      (j) => j.id === jogadorCachetaId
    );
    if (!jogadorCacheta) {
      throw new Error("Jogador não encontrado neste jogo");
    }

    // Verificar se o jogador tem 0 pontos
    if (jogadorCacheta.pontos > 0) {
      throw new Error("Apenas jogadores com 0 pontos podem fazer reentrada");
    }

    // Encontrar o jogador com menos pontos (que não seja o próprio)
    let menorPontuacao = 10; // Pontuação inicial
    for (const j of jogo.jogadores) {
      if (
        j.id !== jogadorCachetaId &&
        j.pontos > 0 &&
        j.pontos < menorPontuacao
      ) {
        menorPontuacao = j.pontos;
      }
    }

    // Se todos os outros jogadores tiverem 0 pontos, definir algum valor padrão
    if (
      menorPontuacao === 10 &&
      jogo.jogadores.some((j) => j.id !== jogadorCachetaId)
    ) {
      menorPontuacao = 5; // Valor padrão se todos tiverem 0 ou 10
    }

    // Fazer a reentrada
    const jogadorAtualizado = await prisma.jogadorCacheta.update({
      where: { id: jogadorCachetaId },
      data: {
        pontos: menorPontuacao,
        reentradas: { increment: 1 },
      },
    });

    return jogadorAtualizado;
  } catch (error) {
    console.error("Erro ao fazer reentrada:", error);
    throw new Error(
      error instanceof Error ? error.message : "Falha ao fazer reentrada"
    );
  }
}

// Finalizar um jogo de cacheta
export async function finalizarJogoCacheta(
  jogoId: number,
  dados?: FinalizacaoJogoData
) {
  try {
    // Buscar o jogo e seus jogadores
    const jogo = await prisma.jogoCacheta.findUnique({
      where: { id: jogoId },
      include: {
        jogadores: true,
      },
    });

    if (!jogo) {
      throw new Error("Jogo não encontrado");
    }

    if (jogo.status === "FINALIZADO") {
      throw new Error("Este jogo já foi finalizado");
    }

    // Calcular o valor da premiação automaticamente se não for informado
    let valorPremiacao = dados?.valorPremiacao;

    if (!valorPremiacao) {
      // Calcular baseado na quantidade de jogadores e reentradas
      const valorPorEntrada = jogo.valorEntrada;
      const totalJogadores = jogo.jogadores.length;
      const totalReentradas = jogo.jogadores.reduce(
        (sum, jogador) => sum + jogador.reentradas,
        0
      );

      // O valor total é a soma das entradas iniciais + reentradas
      valorPremiacao = valorPorEntrada * (totalJogadores + totalReentradas);

      // Se houver jogador que livrou, subtrair o valor dele do total
      if (dados?.jogadorLivramentoId) {
        valorPremiacao -= valorPorEntrada;
      }
    }

    // Atualizar o jogo com dados de finalização
    const jogoAtualizado = await prisma.jogoCacheta.update({
      where: { id: jogoId },
      data: {
        status: "FINALIZADO",
        vencedorId: dados?.vencedorId,
        valorPremiacao: valorPremiacao,
      },
    });

    return jogoAtualizado;
  } catch (error) {
    console.error("Erro ao finalizar jogo:", error);
    throw new Error(
      error instanceof Error ? error.message : "Falha ao finalizar jogo"
    );
  }
}
