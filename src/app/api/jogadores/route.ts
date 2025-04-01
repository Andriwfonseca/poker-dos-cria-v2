import { NextRequest, NextResponse } from "next/server";
import { criarJogador, getJogadores } from "@/lib/jogadores";

export async function GET() {
  try {
    const jogadores = await getJogadores();
    return NextResponse.json(jogadores);
  } catch (error) {
    console.error("Erro na API de jogadores:", error);
    return NextResponse.json(
      { message: "Erro ao buscar jogadores" },
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

    const jogador = await criarJogador({
      nome: data.nome,
      chavePix: data.chavePix,
    });

    return NextResponse.json(jogador, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar jogador:", error);
    return NextResponse.json(
      { message: "Erro ao criar jogador" },
      { status: 500 }
    );
  }
}
