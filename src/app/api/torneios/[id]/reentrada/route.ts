import { NextRequest, NextResponse } from "next/server";
import { registrarReentrada, getTorneioById } from "@/lib/torneios";

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
        {
          message:
            "Reentradas só podem ser registradas em torneios em andamento",
        },
        { status: 400 }
      );
    }

    const data = await request.json();
    const { jogadorId } = data;

    if (!jogadorId) {
      return NextResponse.json(
        { message: "É necessário informar o jogador" },
        { status: 400 }
      );
    }

    // Verificar se o jogador participa do torneio
    const jogadorTorneio = torneio.jogadores.find(
      (jt) => jt.jogadorId === jogadorId
    );
    if (!jogadorTorneio) {
      return NextResponse.json(
        { message: "Este jogador não está inscrito no torneio" },
        { status: 400 }
      );
    }

    const reentrada = await registrarReentrada(id, jogadorId);
    return NextResponse.json(reentrada);
  } catch (error) {
    console.error(`Erro ao registrar reentrada:`, error);
    return NextResponse.json(
      { message: "Erro ao registrar reentrada" },
      { status: 500 }
    );
  }
}
