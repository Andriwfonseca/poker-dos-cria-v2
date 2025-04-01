import Link from "next/link";
import { getJogosCacheta } from "@/lib/cacheta";

interface Jogador {
  id: number;
  nome: string;
}

interface JogadorCacheta {
  id: number;
  jogadorId: number;
  jogoId: number;
  pontos: number;
  reentradas: number;
  jogador: Jogador;
}

interface JogoCacheta {
  id: number;
  nome: string;
  data: Date | string;
  status: string;
  jogadores: JogadorCacheta[];
}

export default async function CachetaPage() {
  const jogos = await getJogosCacheta();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Jogos de Cacheta</h1>
        <Link
          href="/cacheta/novo"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
        >
          <i className="fas fa-plus-circle mr-2"></i> Novo Jogo
        </Link>
      </div>

      {jogos.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-gray-500">Nenhum jogo de cacheta criado.</p>
          <p className="mt-2">Clique em "Novo Jogo" para começar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jogos.map((jogo) => (
            <div
              key={jogo.id}
              className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div
                className={`p-4 text-white ${
                  jogo.status === "FINALIZADO" ? "bg-green-600" : "bg-blue-600"
                }`}
              >
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-bold truncate">{jogo.nome}</h2>
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      jogo.status === "FINALIZADO"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    <i
                      className={`fas ${
                        jogo.status === "FINALIZADO"
                          ? "fa-check-circle"
                          : "fa-play-circle"
                      } mr-1`}
                    ></i>
                    {jogo.status === "FINALIZADO"
                      ? "Finalizado"
                      : "Em Andamento"}
                  </span>
                </div>
                <p className="text-sm opacity-90 flex items-center mt-1">
                  <i className="fas fa-calendar-alt mr-1"></i>
                  {new Date(jogo.data).toLocaleDateString("pt-BR")}
                </p>
              </div>
              <div className="p-4">
                <div className="bg-blue-50 p-3 rounded mb-4">
                  <p className="text-xs text-gray-500 flex items-center">
                    <i className="fas fa-users text-blue-600 mr-1"></i>{" "}
                    Jogadores
                  </p>
                  <div className="mt-1 space-y-1">
                    {jogo.jogadores.map((jogadorCacheta) => (
                      <div
                        key={jogadorCacheta.id}
                        className="flex justify-between items-center"
                      >
                        <span className="font-medium">
                          {jogadorCacheta.jogador.nome}
                        </span>
                        <div className="flex items-center space-x-3">
                          <span className="text-sm">
                            <i className="fas fa-coins text-yellow-500 mr-1"></i>
                            {jogadorCacheta.pontos}
                          </span>
                          {jogadorCacheta.reentradas > 0 && (
                            <span className="text-sm text-red-500">
                              <i className="fas fa-redo mr-1"></i>
                              {jogadorCacheta.reentradas}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-center">
                  <Link
                    href={`/cacheta/${jogo.id}`}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors"
                  >
                    <i className="fas fa-eye mr-2"></i> Ver Jogo
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">Regras do Cacheta</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Cada jogador começa com 10 pontos</li>
          <li>Se um jogador correr, perde 1 ponto</li>
          <li>Se um jogador for e perder, perde 2 pontos</li>
          <li>Se um jogador for e ganhar, não perde pontos</li>
          <li>
            Quando um jogador chega a 0 pontos, pode fazer reentrada com a
            pontuação do jogador que tem menos pontos no momento
          </li>
        </ul>
      </div>
    </div>
  );
}
