import { NextRequest, NextResponse } from "next/server";
import { finalizarTorneio, getTorneioById } from "@/lib/torneios";

interface Params {
  params: { id: string };
}

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ message: "ID inválido" }, { status: 400 });
    }

    const torneio = await getTorneioById(id);
    if (!torneio) {
      return NextResponse.json(
        { message: "Torneio não encontrado" },
        { status: 404 }
      );
    }

    if (torneio.status !== "EM_ANDAMENTO") {
      return NextResponse.json(
        { message: "Apenas torneios em andamento podem ser finalizados" },
        { status: 400 }
      );
    }

    const data = await request.json();
    const { primeiroColocadoId, segundoColocadoId } = data;

    if (!primeiroColocadoId || !segundoColocadoId) {
      return NextResponse.json(
        { message: "É necessário informar o primeiro e segundo colocados" },
        { status: 400 }
      );
    }

    if (primeiroColocadoId === segundoColocadoId) {
      return NextResponse.json(
        {
          message:
            "O primeiro e segundo colocados não podem ser o mesmo jogador",
        },
        { status: 400 }
      );
    }

    // Verificar se os jogadores participaram do torneio
    const jogador1 = torneio.jogadores.find(
      (jt) => jt.jogadorId === primeiroColocadoId
    );
    const jogador2 = torneio.jogadores.find(
      (jt) => jt.jogadorId === segundoColocadoId
    );

    if (!jogador1 || !jogador2) {
      return NextResponse.json(
        { message: "Os jogadores informados não participaram deste torneio" },
        { status: 400 }
      );
    }

    const torneioAtualizado = await finalizarTorneio(
      id,
      primeiroColocadoId,
      segundoColocadoId
    );
    return NextResponse.json(torneioAtualizado);
  } catch (error) {
    console.error(`Erro ao finalizar torneio:`, error);
    return NextResponse.json(
      { message: "Erro ao finalizar torneio" },
      { status: 500 }
    );
  }
}
