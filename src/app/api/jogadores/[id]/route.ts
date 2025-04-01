import { NextRequest, NextResponse } from "next/server";
import {
  getJogadorById,
  atualizarJogador,
  deletarJogador,
} from "@/lib/jogadores";

interface Params {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ message: "ID inválido" }, { status: 400 });
    }

    const jogador = await getJogadorById(id);
    if (!jogador) {
      return NextResponse.json(
        { message: "Jogador não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(jogador);
  } catch (error) {
    console.error(`Erro ao buscar jogador:`, error);
    return NextResponse.json(
      { message: "Erro ao buscar jogador" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ message: "ID inválido" }, { status: 400 });
    }

    const data = await request.json();

    // Validação básica
    if (data.nome !== undefined && data.nome.trim() === "") {
      return NextResponse.json(
        { message: "Nome não pode ser vazio" },
        { status: 400 }
      );
    }

    const jogador = await atualizarJogador(id, {
      nome: data.nome,
      chavePix: data.chavePix,
    });

    return NextResponse.json(jogador);
  } catch (error) {
    console.error(`Erro ao atualizar jogador:`, error);
    return NextResponse.json(
      { message: "Erro ao atualizar jogador" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ message: "ID inválido" }, { status: 400 });
    }

    await deletarJogador(id);
    return NextResponse.json({ message: "Jogador removido com sucesso" });
  } catch (error) {
    console.error(`Erro ao deletar jogador:`, error);
    return NextResponse.json(
      { message: "Erro ao deletar jogador" },
      { status: 500 }
    );
  }
}
