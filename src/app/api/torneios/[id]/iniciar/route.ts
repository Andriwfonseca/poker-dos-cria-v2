import { NextRequest, NextResponse } from "next/server";
import { iniciarTorneio, getTorneioById } from "@/lib/torneios";

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

    if (torneio.status !== "CONFIGURADO") {
      return NextResponse.json(
        { message: "Torneio já foi iniciado ou finalizado" },
        { status: 400 }
      );
    }

    if (torneio.jogadores.length < 2) {
      return NextResponse.json(
        {
          message:
            "O torneio precisa ter pelo menos 2 jogadores para ser iniciado",
        },
        { status: 400 }
      );
    }

    const torneioAtualizado = await iniciarTorneio(id);
    return NextResponse.json(torneioAtualizado);
  } catch (error) {
    console.error(`Erro ao iniciar torneio:`, error);
    return NextResponse.json(
      { message: "Erro ao iniciar torneio" },
      { status: 500 }
    );
  }
}
