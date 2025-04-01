import { NextRequest, NextResponse } from "next/server";
import { removerJogadorDoTorneio, getTorneioById } from "@/lib/torneios";

interface Params {
  params: {
    id: string;
    jogadorId: string;
  };
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const torneioId = parseInt(params.id);
    const jogadorId = parseInt(params.jogadorId);

    if (isNaN(torneioId) || isNaN(jogadorId)) {
      return NextResponse.json({ message: "IDs inválidos" }, { status: 400 });
    }

    // Verificar se o torneio existe e está em estado válido
    const torneio = await getTorneioById(torneioId);
    if (!torneio) {
      return NextResponse.json(
        { message: "Torneio não encontrado" },
        { status: 404 }
      );
    }

    if (torneio.status !== "CONFIGURADO") {
      return NextResponse.json(
        {
          message:
            "Não é possível remover jogadores de um torneio já iniciado ou finalizado",
        },
        { status: 400 }
      );
    }

    await removerJogadorDoTorneio(torneioId, jogadorId);
    return NextResponse.json({ message: "Jogador removido com sucesso" });
  } catch (error) {
    console.error(`Erro ao remover jogador do torneio:`, error);
    return NextResponse.json(
      { message: "Erro ao remover jogador do torneio" },
      { status: 500 }
    );
  }
}
