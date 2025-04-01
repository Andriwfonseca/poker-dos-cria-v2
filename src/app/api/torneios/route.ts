import { NextRequest, NextResponse } from "next/server";
import { getTorneios, criarTorneio } from "@/lib/torneios";

export async function GET() {
  try {
    const torneios = await getTorneios();
    return NextResponse.json(torneios);
  } catch (error) {
    console.error("Erro na API de torneios:", error);
    return NextResponse.json(
      { message: "Erro ao buscar torneios" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validação básica
    if (!data.nome || data.nome.trim() === "") {
      return NextResponse.json(
        { message: "Nome é obrigatório" },
        { status: 400 }
      );
    }

    if (typeof data.buyIn !== "number" || data.buyIn <= 0) {
      return NextResponse.json(
        { message: "Buy-in deve ser um valor positivo" },
        { status: 400 }
      );
    }

    if (typeof data.tempoBlind !== "number" || data.tempoBlind <= 0) {
      return NextResponse.json(
        { message: "Tempo de blind deve ser um valor positivo" },
        { status: 400 }
      );
    }

    if (!data.smallBlindInicial || !data.bigBlindInicial) {
      return NextResponse.json(
        {
          message: "É necessário definir os valores de Small Blind e Big Blind",
        },
        { status: 400 }
      );
    }

    const torneio = await criarTorneio({
      nome: data.nome,
      buyIn: data.buyIn,
      tempoBlind: data.tempoBlind,
      smallBlindInicial: data.smallBlindInicial,
      bigBlindInicial: data.bigBlindInicial,
      data: new Date(),
    });

    return NextResponse.json(torneio, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar torneio:", error);
    return NextResponse.json(
      { message: "Erro ao criar torneio" },
      { status: 500 }
    );
  }
}
