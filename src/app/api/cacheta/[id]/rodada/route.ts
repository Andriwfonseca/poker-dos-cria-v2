import { NextRequest, NextResponse } from "next/server";
import { registrarRodada } from "@/lib/cacheta";

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
    if (!data.acoes || !Array.isArray(data.acoes) || data.acoes.length === 0) {
      return NextResponse.json(
        { message: "É necessário informar as ações dos jogadores" },
        { status: 400 }
      );
    }

    // Verificar se cada ação tem os campos necessários
    for (const acao of data.acoes) {
      if (!acao.jogadorCachetaId) {
        return NextResponse.json(
          { message: "Todas as ações precisam ter um jogadorCachetaId" },
          { status: 400 }
        );
      }

      if (!acao.acao || !["FOI", "CORREU"].includes(acao.acao)) {
        return NextResponse.json(
          { message: "Ação inválida. Use 'FOI' ou 'CORREU'" },
          { status: 400 }
        );
      }

      if (
        acao.acao === "FOI" &&
        (!acao.resultado || !["GANHOU", "PERDEU"].includes(acao.resultado))
      ) {
        return NextResponse.json(
          {
            message:
              "Quando a ação é 'FOI', o resultado deve ser 'GANHOU' ou 'PERDEU'",
          },
          { status: 400 }
        );
      }
    }

    const resultado = await registrarRodada(id, data.acoes);
    return NextResponse.json(resultado, { status: 201 });
  } catch (error) {
    console.error(`Erro ao registrar rodada:`, error);
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Erro ao registrar rodada",
      },
      { status: 500 }
    );
  }
}
