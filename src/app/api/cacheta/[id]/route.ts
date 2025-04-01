import { NextRequest, NextResponse } from "next/server";
import { getJogoCachetaById, finalizarJogoCacheta } from "@/lib/cacheta";

interface Params {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ message: "ID inválido" }, { status: 400 });
    }

    const jogo = await getJogoCachetaById(id);
    if (!jogo) {
      return NextResponse.json(
        { message: "Jogo de cacheta não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(jogo);
  } catch (error) {
    console.error(`Erro ao buscar jogo de cacheta:`, error);
    return NextResponse.json(
      { message: "Erro ao buscar jogo de cacheta" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ message: "ID inválido" }, { status: 400 });
    }

    const data = await request.json();

    // Verificar a ação solicitada
    if (data.acao === "finalizar") {
      // Validar dados necessários para finalização
      if (!data.vencedorId) {
        return NextResponse.json(
          { message: "É necessário informar o vencedor do jogo" },
          { status: 400 }
        );
      }

      // Valor da premiação agora é opcional, será calculado automaticamente se não informado
      if (
        data.valorPremiacao &&
        (isNaN(Number(data.valorPremiacao)) || Number(data.valorPremiacao) < 0)
      ) {
        return NextResponse.json(
          {
            message:
              "O valor da premiação, quando informado, deve ser um número válido",
          },
          { status: 400 }
        );
      }

      const jogoAtualizado = await finalizarJogoCacheta(id, {
        vencedorId: Number(data.vencedorId),
        valorPremiacao: data.valorPremiacao
          ? Number(data.valorPremiacao)
          : undefined,
        jogadorLivramentoId: data.jogadorLivramentoId
          ? Number(data.jogadorLivramentoId)
          : null,
      });

      return NextResponse.json(jogoAtualizado);
    }

    return NextResponse.json(
      { message: "Ação desconhecida ou não suportada" },
      { status: 400 }
    );
  } catch (error) {
    console.error(`Erro ao atualizar jogo de cacheta:`, error);
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Erro ao atualizar jogo de cacheta",
      },
      { status: 500 }
    );
  }
}
