import { NextRequest, NextResponse } from "next/server";
import { fazerReentrada } from "@/lib/cacheta";

interface Params {
  params: { id: string };
}

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ message: "ID inválido" }, { status: 400 });
    }

    const data = await request.json();

    // Validação básica
    if (!data.jogadorCachetaId) {
      return NextResponse.json(
        { message: "É necessário informar o jogadorCachetaId" },
        { status: 400 }
      );
    }

    const jogadorAtualizado = await fazerReentrada(id, data.jogadorCachetaId);
    return NextResponse.json(jogadorAtualizado);
  } catch (error) {
    console.error(`Erro ao fazer reentrada:`, error);
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Erro ao fazer reentrada",
      },
      { status: 500 }
    );
  }
}
