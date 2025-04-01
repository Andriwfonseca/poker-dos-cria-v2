import { NextRequest, NextResponse } from "next/server";
import { adicionarJogadorAoTorneio, getTorneioById } from "@/lib/torneios";

interface Params {
  params: { id: string };
}

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const torneioId = parseInt(params.id);
    if (isNaN(torneioId)) {
      return NextResponse.json(
        { message: "ID do torneio inválido" },
        { status: 400 }
      );
    }

    const data = await request.json();
    const jogadorId = data.jogadorId;

    if (!jogadorId || isNaN(jogadorId)) {
      return NextResponse.json(
        { message: "ID do jogador inválido" },
        { status: 400 }
      );
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
            "Não é possível adicionar jogadores a um torneio já iniciado ou finalizado",
        },
        { status: 400 }
      );
    }

    const jogadorTorneio = await adicionarJogadorAoTorneio(
      torneioId,
      jogadorId
    );
    return NextResponse.json(jogadorTorneio);
  } catch (error) {
    console.error(`Erro ao adicionar jogador ao torneio:`, error);
    return NextResponse.json(
      { message: "Erro ao adicionar jogador ao torneio" },
      { status: 500 }
    );
  }
}
