import { NextRequest, NextResponse } from "next/server";
import { getJogosCacheta, criarJogoCacheta } from "@/lib/cacheta";

export async function GET(request: NextRequest) {
  try {
    const jogos = await getJogosCacheta();
    return NextResponse.json(jogos);
  } catch (error) {
    console.error("Erro ao buscar jogos de cacheta:", error);
    return NextResponse.json(
      { message: "Erro ao buscar jogos de cacheta" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validação básica
    if (!data.nome) {
      return NextResponse.json(
        { message: "Nome do jogo é obrigatório" },
        { status: 400 }
      );
    }

    if (
      !data.jogadoresIds ||
      !Array.isArray(data.jogadoresIds) ||
      data.jogadoresIds.length < 2
    ) {
      return NextResponse.json(
        { message: "É necessário informar pelo menos 2 jogadores" },
        { status: 400 }
      );
    }

    if (
      !data.valorEntrada ||
      isNaN(Number(data.valorEntrada)) ||
      Number(data.valorEntrada) <= 0
    ) {
      return NextResponse.json(
        { message: "É necessário informar um valor de entrada válido" },
        { status: 400 }
      );
    }

    const jogo = await criarJogoCacheta({
      nome: data.nome,
      jogadoresIds: data.jogadoresIds,
      valorEntrada: Number(data.valorEntrada),
    });

    return NextResponse.json(jogo, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar jogo de cacheta:", error);
    return NextResponse.json(
      { message: "Erro ao criar jogo de cacheta" },
      { status: 500 }
    );
  }
}
